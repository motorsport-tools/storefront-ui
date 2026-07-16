import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrlInput } from '#sitemap/types'
import { createDirectus, rest, readItems, staticToken } from '@directus/sdk'
import type { Schema } from '~/layers/directus/shared/types/schema'

const SITEMAP_CACHE_SECONDS = Number.parseInt(
  process.env.NUXT_SITEMAP_CACHE_SECONDS || '86400',
  10,
)

const normalisePath = (path?: string | null) => {
  if (!path) return null
  return path.startsWith('/') ? path : `/${path}`
}

const getCachedDirectusPages = cachedFunction(
  async (): Promise<SitemapUrlInput[]> => {
    const directusUrl = process.env.DIRECTUS_URL || ''
    const directusToken = process.env.DIRECTUS_SERVER_TOKEN || null

    if (!directusUrl) {
      console.error('[sitemap/pages] Missing Directus URL')
      return []
    }

    const directusServer = createDirectus<Schema>(directusUrl).with(rest())
    const authenticatedServer = directusToken
      ? directusServer.with(staticToken(directusToken))
      : directusServer

    const response = await authenticatedServer.request(
      readItems('Pages', {
        filter: {
          status: { _eq: 'published' },
        },
        fields: ['permalink', 'date_updated'] as any,
        limit: -1,
        sort: ['permalink'] as any,
      }),
    )

    return (response || [])
      .map((page: any) => {
        const loc = normalisePath(page.permalink)
        if (!loc) return null

        const sitemapUrl: SitemapUrlInput = {
          loc,
          _sitemap: 'pages',
        }

        if (page.date_updated) {
          sitemapUrl.lastmod = page.date_updated
        }

        return sitemapUrl
      })
      .filter(Boolean) as SitemapUrlInput[]
  },
  {
    name: 'sitemap-pages',
    maxAge: SITEMAP_CACHE_SECONDS,
    staleMaxAge: SITEMAP_CACHE_SECONDS,
    getKey: () => `directus-pages:${process.env.DIRECTUS_URL || ''}:v1`,
  },
)

export default defineSitemapEventHandler(async () => {
  try {
    return await getCachedDirectusPages()
  }
  catch (error) {
    console.error('[sitemap/pages] Error fetching Directus pages:', error)
    return []
  }
})
