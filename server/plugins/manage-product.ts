import { QueryName } from '~/server/queries/'
import { MutationName } from '~/server/mutations'

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

            }

            if (requestBody[0]?.mutationName === MutationName.CartUpdateQuantity) {
                if ((body as any).cartUpdateMultipleItems?.order?.orderLines.length > 0) {

                    for (const line of (body as any).cartUpdateMultipleItems?.order?.orderLines) {
                        const id = line.product?.id
                        const stock = await useStorage('stock').getItem(`stock:product-${id}`)
                        line.product.stock = stock?.[websiteId] || 0
                    }
                }

            }
        }
    })
})