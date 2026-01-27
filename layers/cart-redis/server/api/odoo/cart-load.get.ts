import type { CustomProductWithStockFromRedis } from '~/graphql'
export default defineEventHandler(async (event: any) => {
  const websiteId = 1
  const sessionId = getCookie(event, 'session_id');
  const keyName = `cache:cart:session:${sessionId}`
  const data = await useStorage('cart').getItem(keyName);

  const productIds = (data as any)?.cart?.order?.orderLines?.map((line: any) => line?.product?.id).filter(Boolean) || []
  const stockKeys = productIds.map((id: number) => `stock:product-${id}`)
  const stocks = productIds.length > 0 ? await useStorage('stock').getItems(stockKeys) : []

  for (const orderLine of (data as any)?.cart?.order?.orderLines || []) {
    const stockId = `stock:product-${orderLine?.product?.id}`
    const stock = stocks.find((s: any) => s.key === stockId)?.value as any

    try {
      (orderLine.product as CustomProductWithStockFromRedis).stock = 0
      if (stock) {
        (orderLine.product as CustomProductWithStockFromRedis).stock = Number(stock?.[websiteId]) || 0
      }
    }
    catch (e) {
      console.log(e)
      console.log(stock)
    }
  }

  return (data as any) || {}
});
