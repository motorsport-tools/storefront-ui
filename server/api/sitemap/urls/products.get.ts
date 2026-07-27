import { defineSitemapEventHandler, useRuntimeConfig } from '#imports'
import type { SitemapUrlInput } from '#sitemap/types'
import { getRequestHost, getRequestIP } from 'h3'

type OdooSitemapImage = {
  loc?: string
  caption?: string
  title?: string
}

type OdooSitemapProduct = {
  loc?: string
  lastmod?: string
  images?: OdooSitemapImage[]
}

type OdooProductSitemapResponse = {
  items?: OdooSitemapProduct[]
  nextAfterId?: number
  hasMore?: boolean
  pageSize?: number
  error?: string
}

const parsePositiveInteger = (
  value: string | undefined,
  fallback: number,
  maximum: number,
) => {
  const parsed = Number.parseInt(String(value || ''), 10)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback
  }

  return Math.min(parsed, maximum)
}

const SITEMAP_CACHE_SECONDS = parsePositiveInteger(
  process.env.NUXT_SITEMAP_CACHE_SECONDS,
  86400,
  604800,
)

/*
 * This is an Odoo API page size, not the maximum number of products.
 * The loop continues until Odoo returns hasMore=false.
 */
const PRODUCT_PAGE_SIZE = parsePositiveInteger(
  process.env.NUXT_SITEMAP_PRODUCT_PAGE_SIZE,
  2000,
  50000,
)

const MAX_PRODUCT_PAGES = parsePositiveInteger(
  process.env.NUXT_SITEMAP_PRODUCT_MAX_PAGES,
  1000,
  10000,
)

const INCLUDE_IMAGES = ['1', 'true', 'yes'].includes(
  String(process.env.NUXT_SITEMAP_INCLUDE_IMAGES || '0').toLowerCase(),
)

/*
 * Bump when pagination or URL-shaping behaviour changes so an old 10,000-item
 * result is not reused from Nitro/Redis.
 */
const CACHE_VERSION = 'cursor-v2'

const normaliseBaseUrl = (value: string) => value.replace(/\/+$/, '')

const normalisePath = (path?: string) => {
  if (!path || path === 'false') return null
  return path.startsWith('/') ? path : `/${path}`
}

const joinUrl = (baseUrl: string, path: string) => {
  if (!path) return path
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`
}

export default defineSitemapEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  const odooBaseUrl = normaliseBaseUrl(String(
    config.public.odooBaseUrl
    || process.env.NUXT_PUBLIC_ODOO_BASE_URL
    || '',
  ))

  if (!odooBaseUrl) {
    console.error('[sitemap/products] Missing Odoo base URL')
    return []
  }

  const requestHost = String(
    (config.public as any).middlewareUrl || getRequestHost(event),
  )

  const cacheKey = [
    'sitemap',
    'products',
    requestHost,
    `page-size:${PRODUCT_PAGE_SIZE}`,
    `max-pages:${MAX_PRODUCT_PAGES}`,
    `images:${INCLUDE_IMAGES ? 1 : 0}`,
    CACHE_VERSION,
  ].join(':')

  const storage = useStorage('cache')
  const cached = await storage.getItem<SitemapUrlInput[]>(cacheKey)

  // Cache an intentionally empty result as well as a populated result.
  if (Array.isArray(cached)) {
    return cached
  }

  const headers: Record<string, string> = {
    accept: 'application/json',
    'request-host': requestHost,
  }

  const ip = getRequestIP(event, { xForwardedFor: true })

  if (ip) {
    headers['REAL-IP'] = ip
  }

  const products: OdooSitemapProduct[] = []
  let afterId = 0
  let hasMore = true
  let pageCounter = 0

  while (hasMore && pageCounter < MAX_PRODUCT_PAGES) {
    pageCounter += 1

    const response = await $fetch<OdooProductSitemapResponse>(
      `${odooBaseUrl}/vsf/sitemap/products`,
      {
        method: 'GET',
        headers,
        query: {
          after_id: afterId,
          limit: PRODUCT_PAGE_SIZE,
          include_images: INCLUDE_IMAGES ? 1 : 0,
        },
        timeout: 60000,
        retry: 2,
        retryDelay: 500,
      },
    )

    if (response.error) {
      throw new Error(`[sitemap/products] Odoo error: ${response.error}`)
    }

    const pageItems = response.items || []
    products.push(...pageItems)

    const nextAfterId = Number(response.nextAfterId || 0)
    hasMore = Boolean(response.hasMore)

    if (!hasMore) {
      break
    }

    if (!Number.isFinite(nextAfterId) || nextAfterId <= afterId) {
      throw new Error(
        '[sitemap/products] Odoo returned hasMore=true without advancing '
        + `the cursor. afterId=${afterId}, nextAfterId=${nextAfterId}`,
      )
    }

    afterId = nextAfterId
  }

  if (hasMore) {
    throw new Error(
      `[sitemap/products] Reached MAX_PRODUCT_PAGES=${MAX_PRODUCT_PAGES} `
      + 'before Odoo returned hasMore=false.',
    )
  }

  /*
   * Deduplicate by canonical path. This protects the sitemap from accidental
   * duplicate slugs while preserving the newest lastmod value encountered.
   */
  const urlsByLocation = new Map<string, SitemapUrlInput>()

  for (const product of products) {
    const loc = normalisePath(product.loc)

    if (!loc) {
      continue
    }

    const url: SitemapUrlInput = {
      loc,
      _sitemap: 'products',
    }

    if (product.lastmod) {
      url.lastmod = product.lastmod
    }

    if (INCLUDE_IMAGES && product.images?.length) {
      url.images = product.images
        .filter(image => image.loc)
        .map(image => ({
          loc: joinUrl(odooBaseUrl, image.loc as string),
          caption: image.caption || '',
          title: image.title || image.caption || '',
        }))
    }

    const existing = urlsByLocation.get(loc)

    if (
      !existing
      || (
        url.lastmod
        && (
          !existing.lastmod
          || Date.parse(String(url.lastmod)) > Date.parse(String(existing.lastmod))
        )
      )
    ) {
      urlsByLocation.set(loc, url)
    }
  }

  const sitemapUrls = Array.from(urlsByLocation.values()).sort((a, b) =>
    String(a.loc).localeCompare(String(b.loc)),
  )

  await storage.setItem(cacheKey, sitemapUrls, {
    ttl: SITEMAP_CACHE_SECONDS,
  })

  return sitemapUrls
})
