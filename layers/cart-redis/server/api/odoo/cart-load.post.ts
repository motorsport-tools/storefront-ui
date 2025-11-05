import type { Cart } from '~/graphql'
//import { isCartStale, transformCart } from '../../utils/cartHelpers';
import { QueryName } from '~/server/queries'
import { Queries } from '~/server/queries'
export default defineEventHandler(async (event: any) => {
  const config = useRuntimeConfig(event)
  const sessionPwd = process.env.NUXT_SESSION_SECRET || ""
  const session = await useSession(event, {
    password: sessionPwd,
  });

  if (!session.id) {
    throw createError({
      statusCode: 400,
      message: 'Invalid session - please refresh your browser and try again',
    })
  }

  const { forceSync } = await readBody<{ forceSync?: boolean }>(event);
  const keyName = `cache:cart:session:${session?.id}`
  try {
    // 1. Redis
    if (!forceSync) {
      const cacheCart = await useStorage('cart').getItem(keyName) as any

      if (cacheCart && !isCartStale(cacheCart)) {
        console.log('cart from cache: ', cacheCart.cart)
        return { success: true, cart: cacheCart.cart }
      }
      console.log('No Cache Cart')
    }

    // 2. Odoo
    const odooData: any = await $fetch(`${config.public.odooBaseUrl}graphql/vsf`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'REAL-IP': getRequestIP(event) || '',
        'request-host': config.public.middlewareUrl || getRequestHost(event),
        'Cookie': `session_id=${getCookie(event, 'session_id')}`,
      },
      body: JSON.stringify({ query: Queries[QueryName.LoadCartQuery] }),
    })

    if (!odooData?.data?.cart?.order) {
      console.log('have no odoo cart')
      return { success: true, cart: {} as Cart }
    }

    // 3. Transform
    const redisCart = transformCart(odooData.data.cart, session.id)
    useStorage('cart').setItem(keyName, { cart: redisCart })

    return { success: true, cart: redisCart }

  } catch (error) {
    console.error('Load cart error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to load cart',
    })
  }
});
