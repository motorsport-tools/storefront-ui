import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrlInput } from '#sitemap/types'
import { createDirectus, rest, readItems, withToken, staticToken } from '@directus/sdk'
import type { Schema } from '~/layers/directus/shared/types/schema'

export default defineSitemapEventHandler(async (event) => {
  const directusUrl = process.env.DIRECTUS_URL || ''
  const directusToken = process.env.DIRECTUS_SERVER_TOKEN || null

  if (!directusUrl) {
    console.error('[sitemap/pages] Missing Directus URL')
    return []
  }

  try {
    const directusServer = createDirectus<Schema>(directusUrl).with(rest())
    let authenticatedServer = directusServer
    if (directusToken) {
      authenticatedServer = directusServer.with(staticToken(directusToken))
    }

    const response = await authenticatedServer.request(
      readItems('Pages', {
        filter: {
          status: { _eq: 'published' },
        },
        fields: ['permalink', 'date_updated'] as any,
      })
    )

    const directusPages: SitemapUrlInput[] = (response || []).map((page: any) => {
      const path = page.permalink.startsWith('/') ? page.permalink : `/${page.permalink}`
      return {
        loc: path,
        lastmod: page.date_updated || new Date().toISOString(),
        _sitemap: 'pages',
      }
    })

    return [directusPages]
  } catch (error) {
    console.error('[sitemap/pages] Error fetching directus pages:', error)
    return []
  }
})
