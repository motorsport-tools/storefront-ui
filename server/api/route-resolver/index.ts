import type {
    ProductResponse,
} from '~/graphql'
export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const slug = query.slug as string

    if (!slug) {
        throw createError({
            statusCode: 404,
            message: 'Not Found',
        })
    }

    const redisKey = `slug:${encodeURIComponent(slug)}`
    let data = await useStorage<string>('slug').getItem(redisKey)
    if (!data) {
        const odooBaseUrl: string = process.env?.NUXT_PUBLIC_ODOO_BASE_URL ? `${process.env.NUXT_PUBLIC_ODOO_BASE_URL}graphql/vsf` : ''

        if (slug.startsWith('/product/')) {
            const productQuery = `
            query ($id: Int = null, $slug: String = null, $barcode: String = null) {
                product(id: $id, slug: $slug, barcode: $barcode) {
                    id
                }
            }
            `
            const variables = { slug: slug }
            try {
                const res: ProductResponse = await $fetch(odooBaseUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: productQuery, variables }),
                })
                if (res.data?.product?.id) {
                    data = 'product.template'
                    await useStorage('slug').setItem(redisKey, data)
                }
            } catch (e) {
                console.log('Error', e)
            }
        }
    }
    if (data) {
        try {
            const modelToRouteType: Record<string, string> = {
                'product.template': 'product',
                'product.public.category': 'category',
                'pages': 'page',
            }

            return {
                data: modelToRouteType[data],
            }
        } catch (error) {
            console.error('Error parsing route data:', error)
            throw createError({
                statusCode: 500,
                message: 'Error processing route data',
            })
        }
    }
    return {
        data: null,
    }
}) 