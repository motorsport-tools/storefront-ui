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
  error?: string
}

const SITEMAP_CACHE_SECONDS = Number.parseInt(
  process.env.NUXT_SITEMAP_CACHE_SECONDS || '86400',
  10,
)

const PRODUCT_LIMIT = Number.parseInt(
  process.env.NUXT_SITEMAP_PRODUCT_PAGE_SIZE || '10000',
  10,
)

const MAX_PRODUCT_PAGES = Number.parseInt(
  process.env.NUXT_SITEMAP_PRODUCT_MAX_PAGES || '1000',
  10,
)

const INCLUDE_IMAGES = ['1', 'true', 'yes'].includes(
  String(process.env.NUXT_SITEMAP_INCLUDE_IMAGES || '0').toLowerCase(),
)

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
    config.public.odooBaseUrl ||
    process.env.NUXT_PUBLIC_ODOO_BASE_URL ||
    '',
  ))

  if (!odooBaseUrl) {
    console.error('[sitemap/products] Missing Odoo base URL')
    return []
  }

  const requestHost = String((config.public as any).middlewareUrl || getRequestHost(event))

  const cacheKey = [
    'sitemap',
    'products',
    requestHost,
    `limit:${PRODUCT_LIMIT}`,
    `images:${INCLUDE_IMAGES ? 1 : 0}`,
    'cursor-v1',
  ].join(':')

  const storage = useStorage('cache')
  const cached = await storage.getItem<SitemapUrlInput[]>(cacheKey)

  if (cached?.length) {
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
          limit: PRODUCT_LIMIT,
          include_images: INCLUDE_IMAGES ? 1 : 0,
        },
      },
    )

    if (response.error) {
      throw new Error(`[sitemap/products] Odoo error: ${response.error}`)
    }

    products.push(...(response.items || []))

    const nextAfterId = Number(response.nextAfterId || 0)

    if (!response.hasMore || nextAfterId <= afterId) {
      hasMore = false
    }
    else {
      afterId = nextAfterId
      hasMore = true
    }
  }

  if (pageCounter >= MAX_PRODUCT_PAGES) {
    console.warn(
      `[sitemap/products] Stopped at MAX_PRODUCT_PAGES=${MAX_PRODUCT_PAGES}. ` +
      'Increase NUXT_SITEMAP_PRODUCT_MAX_PAGES if required.',
    )
  }

  const sitemapUrls: SitemapUrlInput[] = products
    .map((product) => {
      const loc = normalisePath(product.loc)
      if (!loc) return null

      const url: SitemapUrlInput = {
        loc,
        _sitemap: 'products',
      }

      if (product.lastmod) {
        url.lastmod = product.lastmod
      }

      if (INCLUDE_IMAGES && product.images?.length) {
        url.images = product.images
          .filter((image) => image.loc)
          .map((image) => ({
            loc: joinUrl(odooBaseUrl, image.loc as string),
            caption: image.caption || '',
            title: image.title || image.caption || '',
          }))
      }

      return url
    })
    .filter(Boolean) as SitemapUrlInput[]

  await storage.setItem(cacheKey, sitemapUrls, {
    ttl: SITEMAP_CACHE_SECONDS,
  })

  return sitemapUrls
})
