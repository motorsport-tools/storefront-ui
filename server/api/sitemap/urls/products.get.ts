import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrl } from '#sitemap/types'

export default defineSitemapEventHandler(async (event: any) => {

    const query = `
        query GetProducts {
        products(pageSize: 1000) {
            products {
            slug
            }
        }
        }
    `

    const odooBaseUrl = `${process.env?.NUXT_PUBLIC_ODOO_BASE_URL}graphql/vsf`

    const response = await $fetch(odooBaseUrl, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    })


    return data?.data?.products?.products?.map((product) => ({
        loc: product.slug,
        _sitemap: 'products'
    } satisfies SitemapUrl)) || [];
})