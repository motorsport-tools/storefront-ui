import type { H3Event } from 'h3'

const DEFAULT_WEBSITE_ID = 1
const DEFAULT_PRICELIST_ID = 4

export default defineEventHandler(async (event: H3Event) => {
    const { res } = event.node
    const prefix = '/api/search/'
    if (event.path.startsWith(prefix) && event.method == 'POST') {

        res.setHeader('Cache-Control', 'no-store')

        const targetPath = event.path.replace(prefix, '/')

        const targetUrl = `https://api.clerk.io${targetPath}`

        // Get the request body
        const body = await readBody(event)

        const response = await $fetch(targetUrl, {
            method: event.method,
            headers: event.headers,
            body: JSON.stringify(body),
        })

        if (response?.result) {
            //Enrich
            const enrichedProducts = await enrichProducts(event, response.result)
            response.result = enrichedProducts
        }

        return response
    }
})

async function enrichProducts(event: H3Event, products: any[]) {
    const websiteId = DEFAULT_WEBSITE_ID
    const sessionPwd = process.env.NUXT_SESSION_SECRET || ""
    const session = await useSession(event, {
        password: sessionPwd,
    })
    const pricelistId = session.data?.pricelistId || DEFAULT_PRICELIST_ID

    // Build all keys upfront
    const stockKeys = products.map(p => `stock:product-${p.id}`)
    const priceKeys = products.map(p => `price:${p.id}:pricelist:${pricelistId}:website:${websiteId}`)

    try {
        const stockResults = await useStorage('stock').getItems(stockKeys)
        const priceResults = await useStorage('price').getItems(priceKeys)

        products.forEach((product, index) => {
            const stockKey = stockKeys[index]
            const priceKey = priceKeys[index]

            const stockMap = new Map(stockResults.map(item => [item.key, item.value]))
            const priceMap = new Map(priceResults.map(item => [item.key, item.value]))

            const stock = stockMap.get(stockKey)
            const priceInfo = priceMap.get(priceKey)

            product.stock = stock?.[websiteId] || 0

            if (priceInfo) {
                Object.assign(product, priceInfo)
            }
        })
    } catch (e) {
        console.log('-----------------')
        console.log('Failed Enrichment')
        console.log(e)
        console.log('-----------------')
    }

    return products
}