import { QueryName } from '~/server/queries/'

/**
 * This plugin is responsible for managing the product response.
 * It listens to the POST requests and updates the product appending the STOCK from redis.
 */
export default defineNitroPlugin((nitro) => {
    nitro.hooks.hook('beforeResponse', async (event, { body }) => {
        const websiteId = 1 // Example website ID, adjust when defined

        if (event.method == "POST") {
            const requestBody = await readBody(event)

            if (requestBody[0]?.queryName === QueryName.GetProductVariantQuery) {
                const id = (body as any).productVariant?.product?.id

                const stock = await useStorage('stock').getItem(`stock:product-${id}`);

                (body as any).productVariant.product.stock = stock?.[websiteId] || 0

                /*
                const sessionPwd = process.env.NUXT_SESSION_SECRET || ""
                const session = await useSession(event, {
                    password: sessionPwd,
                })

                const pricelistId = session.data?.pricelistId || 4

                const priceInfo = await useStorage('price').getItem(`price:${id}:pricelist:${pricelistId}:website:${websiteId}`);

                console.log(`price:${id}:pricelist:${pricelistId}:website:${websiteId}`);

                console.log('Price Info:', priceInfo);

                if (priceInfo) {
                    (body as any).productVariant.product['combinationInfoVariant'] = priceInfo || {}
                }
                */
            }
        }
    })
})