import type { Cart } from '~/graphql'
import { reduceCart } from '../../utils/cartHelpers'
import { QueryName } from '~/server/queries'
import { Queries } from '~/server/queries'
export default defineEventHandler(async (event: any) => {
  const config = useRuntimeConfig(event)
  const sessionId = getCookie(event, 'session_id');

  const body = await readBody<{ forceSync?: boolean, fullSync?: boolean }>(event).catch(() => ({} as { forceSync?: boolean, fullSync?: boolean }));
  const forceSync = body?.forceSync || false;
  const fullSync = body?.fullSync || false;

  try {
    // 1. Redis lookup (only if we have a sessionId and not force/full sync)
    if (sessionId && !forceSync && !fullSync) {
      const keyName = `cache:cart:session:${sessionId}`
      const cacheCart = await useStorage('cart').getItem(keyName) as any

      if (cacheCart && cacheCart.cart) {
        return { success: true, cart: cacheCart.cart }
      }
    }

    // 2. Odoo Sync
    const response: any = await $fetch.raw(`${config.public.odooBaseUrl}graphql/vsf`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'REAL-IP': getRequestIP(event, { xForwardedFor: true }) || '',
        'request-host': (config.public.middlewareUrl || getRequestHost(event)) as string,
        'Cookie': sessionId ? `session_id=${sessionId}` : '',
      },
      body: JSON.stringify({ query: Queries[fullSync ? QueryName.LoadCartQuery : QueryName.LoadCartLiteQuery] }),
    })

    const odooData = response?._data;

    // Proxy cookies back to client and extract session_id
    const cookies: string[] = response?.headers?.getSetCookie()
    let odooSessionId = sessionId;

    cookies?.forEach((cookie: string) => {
      appendResponseHeader(event, 'set-cookie', cookie)
      if (cookie.includes('session_id=')) {
        const match = cookie.match(/session_id=([^;]+)/);
        if (match) odooSessionId = match[1];
      }
    })

    if (!odooData?.data?.cart?.order) {
      return { success: true, cart: {} as Cart }
    }

    // 3. Transform & Cache
    const redisCart = reduceCart(odooData.data.cart)
    if (odooSessionId && !fullSync) {
      await useStorage('cart').setItem(`cache:cart:session:${odooSessionId}`, { cart: redisCart })
    }

    // Return full data if requested, otherwise reduced
    return {
      success: true,
      cart: fullSync ? odooData.data.cart : redisCart
    }

  } catch (error) {
    console.error('Load cart error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to load cart',
    })
  }
});
