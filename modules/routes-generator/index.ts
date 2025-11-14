import { defineNuxtModule, extendRouteRules } from '@nuxt/kit'
import type { NuxtPage } from 'nuxt/schema'
import { ofetch } from 'ofetch'
import type { Schema } from '../../layers/directus/shared/types/schema'
import { createDirectus, rest, readItems, withToken, staticToken, type RegularCollections } from '@directus/sdk'

export default defineNuxtModule({
  meta: {
    name: 'routes-generator',
  },
  async setup(_, nuxt) {
    const odooBaseUrl: string = process.env?.NUXT_PUBLIC_ODOO_BASE_URL ? `${process.env.NUXT_PUBLIC_ODOO_BASE_URL}/graphql/vsf` : ''
    const CATEGORY_PAGE_SIZE = parseInt(process.env?.NUXT_PUBLIC_CATEGORY_PAGE_SIZE || '10000', 10)
    const swrValue = Number(process.env?.NUXT_SWR_CACHE_TIME || 300)
    const directusUrl = process.env.DIRECTUS_URL || ''
    const directusToken = process.env.DIRECTUS_SERVER_TOKEN || null

    if (!odooBaseUrl) {
      console.error('[routes-generator] ODOO_BASE_URL is not set')
      return
    }

    const categoriesQuery = `
            query {
                categories(pageSize: ${CATEGORY_PAGE_SIZE}) {
                    categories {
                        slug
                    }
                }
            }
        `;

    const fetchCategorySlugs = async (): Promise<string[]> => {
      try {
        const res = await ofetch(odooBaseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: categoriesQuery }),
        });
        return (
          res?.data?.categories?.categories
            ?.map((c: any) => c.slug)
            .filter(
              (s: string) => !!s && s !== 'false' && s.startsWith('/')
            ) || []
        );
      } catch (e) {
        console.error(
          '[routes-generator] Error fetching category slugs:',
          e
        );
        return [];
      }
    };

    const fetchWebpageSlugs = async (): Promise<string[]> => {
      try {
        const collection = 'Pages' as RegularCollections<String>

        const directusServer = createDirectus<Schema>(directusUrl as string).with(rest())
          .with(staticToken(directusToken as string))

        const res = await directusServer.request(
          withToken(
            directusToken as string,
            readItems(collection, {
              filter: {
                status: { _eq: 'published' },
              },
              fields: ['id', 'permalink'],
            }),
          ),
        )
        console.log('Directus Response: ', res)

        return res
          ?.map((p: any) => p.permalink)
          .filter((s: string) => !!s) || []
      }
      catch (e) {
        console.error('[routes-generator] Error fetching website pages:', e)
        return []
      }
    }

    const [categorySlugs, websitePagesUrls] = await Promise.all([
      fetchCategorySlugs(),
      fetchWebpageSlugs(),
    ])

    categorySlugs.forEach((slug) => {
      extendRouteRules(slug, { swr: swrValue })
    })

    websitePagesUrls.forEach((url) => {
      const path = url.startsWith('/') ? url : `/${url}`
      console.log('Page path: ', path)
      extendRouteRules(path, { swr: swrValue })
    })

    console.info(
      `[routes-generator] ✅ ${categorySlugs.length} categories and ${websitePagesUrls.length} website pages loaded`
    );

    nuxt.hook('pages:extend', (pages: NuxtPage[]) => {
      categorySlugs.forEach(slug => {
        pages.push({
          name: slug.replace(/^\//, '').replace(/\//g, '-'),
          path: slug,
          file: '~/layers/clerkio/custom-pages/category-page.vue',
          meta: {
            layout: 'category',
          }
        })
      })

      websitePagesUrls.forEach(url => {
        pages.push({
          name: url.replace(/^\//, '').replace(/\//g, '-'),
          path: url,
          file: '~/layers/directus/custom-pages/page-builder-page.vue'
        })
      })
    })
  },
})