import { QueryName } from '~/server/queries/'

/**
 * This plugin is responsible for managing the product list response.
 * It listens to the POST requests and updates the product list appending the STOCK from redis.
 */
export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('beforeResponse', async (event, { body }) => {
    const websiteId = 1 // Example website ID, adjust when defined
    if (event.method == "POST") {
      const requestBody = await readBody(event)
      if (requestBody[0]?.queryName === QueryName.GetProductTemplateListQuery) {
        for (const product of (body as any).products.products) {
          const stock = await useStorage('stock').getItem<string>(
            `stock:product-${product.firstVariant.id}`,
          )
          try {
            product.stock = 0
            if (stock) {
              product.firstVariant.stock = stock?.[websiteId] || 0
            }
          }
          catch (e) {
            console.log(e)
            console.log(stock)
          }
        }
      }
    }
  })
})