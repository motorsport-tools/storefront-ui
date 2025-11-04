import type { CustomProductWithStockFromRedis } from '~/graphql'
export default defineEventHandler(async (event: any) => {
  const websiteId = 1
  const sessionPwd = process.env.NUXT_SESSION_SECRET || ""
  const session = await useSession(event, {
    password: sessionPwd,
  });
  const keyName = `cache:cart:session:${session?.id}`
  const data = await useStorage('cart').getItem(keyName);

  console.log('Cart Load called')
  console.log('Cart: ', keyName)
  console.log(data)

  for (const orderLine of data?.cart?.order?.orderLines || []) {
    const stock = await useStorage('stock').getItem<string>(
      `stock:product-${orderLine?.product?.id}`,
    )

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

  return data || {}
});
