import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrlInput } from '#sitemap/types'
import { createDirectus, rest, readItems, staticToken } from '@directus/sdk'
import type { Schema } from '~/layers/directus/shared/types/schema'

type DirectusSitemapPage = {
  permalink?: string | null
  date_updated?: string | null
  seo?: {
    no_index?: boolean | null
    sitemap?: {
      change_frequency?: string | null
      priority?: string | number | null
    } | null
  } | null
}

const SITEMAP_CACHE_SECONDS = Number.parseInt(
  process.env.NUXT_SITEMAP_CACHE_SECONDS || '86400',
  10,
)

/*
 * Bump this whenever the sitemap-shaping logic changes.
 * This avoids old duplicate results being served from Nitro / Redis cache.
 */
const CACHE_VERSION = 'v2'

const normalisePath = (path?: string | null) => {
  const raw = String(path || '').trim()

  if (!raw || raw === 'false') {
    return null
  }

  let pathname = raw

  try {
    if (/^https?:\/\//i.test(raw)) {
      pathname = new URL(raw).pathname
    }
  }
  catch {
    pathname = raw
  }

  pathname = pathname.split('?')[0]?.split('#')[0] || ''

  if (!pathname) {
    return null
  }

  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  pathname = pathname.replace(/\/{2,}/g, '/')

  if (pathname.length > 1) {
    pathname = pathname.replace(/\/+$/, '')
  }

  return pathname || '/'
}

const shouldReplaceExistingUrl = (
  candidate: SitemapUrlInput,
  existing?: SitemapUrlInput,
) => {
  if (!existing) {
    return true
  }

  if (!candidate.lastmod) {
    return false
  }

  if (!existing.lastmod) {
    return true
  }

  const candidateTime = Date.parse(String(candidate.lastmod))
  const existingTime = Date.parse(String(existing.lastmod))

  if (Number.isNaN(candidateTime)) {
    return false
  }

  if (Number.isNaN(existingTime)) {
    return true
  }

  return candidateTime > existingTime
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
          permalink: { _nnull: true },
        },
        fields: [
          'permalink',
          'date_updated',
          'seo',
        ] as any,
        limit: -1,
        sort: ['permalink'] as any,
      }),
    ) as DirectusSitemapPage[]

    const urlsByLoc = new Map<string, SitemapUrlInput>()

    for (const page of response || []) {
      if (page.seo?.no_index) {
        continue
      }

      const loc = normalisePath(page.permalink)

      if (!loc) {
        continue
      }

      const sitemapUrl: SitemapUrlInput = {
        loc,
        _sitemap: 'pages',
      }

      if (page.date_updated) {
        sitemapUrl.lastmod = page.date_updated
      }

      const changeFrequency = page.seo?.sitemap?.change_frequency

      if (changeFrequency) {
        sitemapUrl.changefreq = changeFrequency as any
      }

      const priority = Number(page.seo?.sitemap?.priority)

      if (!Number.isNaN(priority)) {
        sitemapUrl.priority = Math.max(0, Math.min(1, priority))
      }

      const existing = urlsByLoc.get(loc)

      if (shouldReplaceExistingUrl(sitemapUrl, existing)) {
        urlsByLoc.set(loc, sitemapUrl)
      }
    }

    return Array.from(urlsByLoc.values()).sort((a, b) =>
      String(a.loc).localeCompare(String(b.loc)),
    )
  },
  {
    name: 'sitemap-pages',
    maxAge: SITEMAP_CACHE_SECONDS,
    staleMaxAge: SITEMAP_CACHE_SECONDS,
    getKey: () => `directus-pages:${process.env.DIRECTUS_URL || ''}:${CACHE_VERSION}`,
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