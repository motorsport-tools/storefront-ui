import { defineSitemapEventHandler, useRuntimeConfig } from '#imports'
import type { SitemapUrlInput } from '#sitemap/types'
import { getRequestHost, getRequestIP } from 'h3'
import type { Product } from '~/graphql'

type SitemapProduct = Pick<Product, 'slug' | 'image' | 'imageFilename'>

type ProductsGraphqlResponse = {
  data?: {
    products?: {
      totalCount?: number
      products?: Array<SitemapProduct | null>
    }
  }
  errors?: Array<{
    message?: string
  }>
}

const rawPageSize = Number.parseInt(process.env.NUXT_SITEMAP_PRODUCT_PAGE_SIZE || '1000', 10)
const PRODUCT_PAGE_SIZE = Number.isFinite(rawPageSize) && rawPageSize > 0 ? rawPageSize : 1000

const query = `
query GetProducts($currentPage: Int!, $pageSize: Int!) {
  products(currentPage: $currentPage, pageSize: $pageSize) {
    totalCount
    products {
      slug
      image
      imageFilename
    }
  }
}
`

export default defineSitemapEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  const baseUrl = String(
    config.public.odooBaseUrl ||
    process.env.NUXT_PUBLIC_ODOO_BASE_URL ||
    ''
  ).replace(/\/+$/, '')

  if (!baseUrl) {
    console.error('[sitemap/products] Missing Odoo base URL')
    return []
  }

  const odooBaseUrl = `${baseUrl}/graphql/vsf`

  const headers: Record<string, string> = {
    accept: 'application/json',
    'content-type': 'application/json',
    'request-host': String((config.public as any).middlewareUrl || getRequestHost(event)),
  }

  const ip = getRequestIP(event, { xForwardedFor: true })
  if (ip) {
    headers['REAL-IP'] = ip
  }

  const fetchProductPage = async (currentPage: number): Promise<ProductsGraphqlResponse['data']['products']> => {
    const response = await $fetch<ProductsGraphqlResponse>(odooBaseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables: {
          currentPage,
          pageSize: PRODUCT_PAGE_SIZE,
        },
      }),
    })

    if (response?.errors?.length) {
      const message = response.errors.map((error) => error.message).filter(Boolean).join('; ')
      throw new Error(`[sitemap/products] Odoo GraphQL error: ${message}`)
    }

    return response?.data?.products
  }

  const firstPage = await fetchProductPage(1)

  const totalCount = firstPage?.totalCount || 0
  const totalPages = Math.ceil(totalCount / PRODUCT_PAGE_SIZE)

  const products: SitemapProduct[] = [
    ...(firstPage?.products || []).filter(Boolean) as SitemapProduct[],
  ]

  for (let currentPage = 2; currentPage <= totalPages; currentPage += 1) {
    const page = await fetchProductPage(currentPage)

    products.push(
      ...((page?.products || []).filter(Boolean) as SitemapProduct[])
    )
  }

  const sitemapUrls: SitemapUrlInput[] = products
    .filter((product) => product.slug && product.slug !== 'false' && product.slug.startsWith('/'))
    .map((product) => {
      const url: SitemapUrlInput = {
        loc: product.slug as string,
        lastmod: new Date().toISOString(),
        _sitemap: 'products',
      }

      if (product.image) {
        url.images = [
          {
            loc: product.image,
            caption: product.imageFilename || '',
            title: product.imageFilename || '',
          },
        ]
      }

      return url
    })

  return sitemapUrls
})