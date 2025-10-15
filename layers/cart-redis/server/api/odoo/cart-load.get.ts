import type { CustomProductWithStockFromRedis } from '~/graphql'
export default defineEventHandler(async (event: any) => {
  const websiteId = 1
  const session = await useSession(event, {
    password: "b013b03ac2231e0b448e9a22ba488dcf",
  });
  const keyName = `cache:cart:session:${session?.id}`
  const data = await useStorage().getItem(keyName);

  console.log('Cart Data initially?', data)

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
  console.log('Data Loaded: ', data)
  return data || {}
});
