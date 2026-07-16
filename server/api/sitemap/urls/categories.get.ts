import { defineSitemapEventHandler, useRuntimeConfig } from '#imports'
import type { SitemapUrlInput } from '#sitemap/types'
import { getRequestHost, getRequestIP } from 'h3'

const SITEMAP_CACHE_SECONDS = Number.parseInt(
  process.env.NUXT_SITEMAP_CACHE_SECONDS || '86400',
  10,
)

const normaliseBaseUrl = (value: string) => value.replace(/\/+$/, '')

const normalisePath = (path?: string) => {
  if (!path || path === 'false') return null
  return path.startsWith('/') ? path : `/${path}`
}

export default defineSitemapEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  const odooBaseUrl = normaliseBaseUrl(String(
    config.public.odooBaseUrl ||
    process.env.NUXT_PUBLIC_ODOO_BASE_URL ||
    '',
  ))

  if (!odooBaseUrl) {
    console.error('[sitemap/categories] Missing Odoo base URL')
    return []
  }

  const requestHost = String((config.public as any).middlewareUrl || getRequestHost(event))
  const cacheKey = `sitemap:categories:${requestHost}:vsf-categories-v1`

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

  /*
   * This intentionally uses your existing Odoo endpoint:
   *
   *   /vsf/categories
   *
   * That endpoint is already part of graphql_alokai.controllers.main and is
   * the same lightweight category slug source your storefront architecture
   * expects.
   */
  const categorySlugs = await $fetch<string[]>(
    `${odooBaseUrl}/vsf/categories`,
    {
      method: 'GET',
      headers,
    },
  )

  const sitemapUrls: SitemapUrlInput[] = (categorySlugs || [])
    .map((slug) => {
      const loc = normalisePath(slug)
      if (!loc) return null

      return {
        loc,
        _sitemap: 'categories',
      } satisfies SitemapUrlInput
    })
    .filter(Boolean) as SitemapUrlInput[]

  await storage.setItem(cacheKey, sitemapUrls, {
    ttl: SITEMAP_CACHE_SECONDS,
  })

  return sitemapUrls
})
