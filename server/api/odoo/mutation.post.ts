import { Mutations } from '~/server/mutations'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)

  const requestHeaders = getRequestHeaders(event)
  const requestHost = getRequestHost(event)
  const secFetchSite = (requestHeaders['sec-fetch-site'] || '').toLowerCase()
  const origin = requestHeaders.origin
  const referer = requestHeaders.referer

  // Basic CSRF hardening for browser-initiated mutation requests.
  const isCrossSiteFetch =
    !!secFetchSite &&
    !['same-origin', 'same-site', 'none'].includes(secFetchSite)

  if (isCrossSiteFetch) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'Cross-site mutation blocked',
    })
  }

  const hasMismatchedOrigin = (() => {
    if (!origin) return false
    try {
      return new URL(origin).host !== requestHost
    } catch {
      return true
    }
  })()

  const hasMismatchedReferer = (() => {
    if (!referer) return false
    try {
      return new URL(referer).host !== requestHost
    } catch {
      return true
    }
  })()

  if (hasMismatchedOrigin || hasMismatchedReferer) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'Invalid mutation origin',
    })
  }

  try {
    const response: any = await $fetch.raw(`${config.public.odooBaseUrl}graphql/vsf`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'REAL-IP': getRequestIP(event, { xForwardedFor: true }) || '',
        'request-host': config.public.middlewareUrl || getRequestHost(event),
        'Cookie': `session_id=${getCookie(event, 'session_id')}`,
      },
      body: { query: Mutations[body?.[0]?.mutationName], variables: body?.[1] },
    })

    const cookies: string[] = response?.headers?.getSetCookie() || []

    cookies.forEach((cookie: string) => {
      if (!cookie?.startsWith('session_id=')) return
      appendResponseHeader(event, 'set-cookie', cookie)
    })

    if (body?.[0]?.mutationName === 'LogoutMutation') {
      deleteCookie(event, 'session_id')
    }

    if (response?._data?.errors?.length > 0) {
      throw createError({
        statusCode: 500,
        data: response?._data?.errors,
        message: response?._data?.errors?.[0]?.message,
      })
    }

    return response?._data?.data
  }
  catch (error: any) {
    if (error?.response?._data?.errors?.length > 0) {
      throw createError({
        statusCode: 500,
        data: error.response?._data?.errors,
        message: error.message,
      })
    }

    if (error?.graphQLErrors?.length > 0) {
      throw createError({
        statusCode: 500,
        data: error.graphQLErrors,
        message: error.message,
      })
    }
    if (error.protocolErrors?.length > 0) {
      throw createError({
        statusCode: 400,
        data: error.protocolErrors,
        message: error.message,
      })
    }
    if (error.clientErrors?.length > 0) {
      throw createError({
        statusCode: 400,
        data: error.clientErrors,
        message: error.message,
      })
    }
    if (error.networkError) {
      throw createError({
        statusCode: 500,
        data: (error.networkError as any)?.result?.errors,
        message: error.message,
      })
    }

    throw createError({
      statusCode: 500,
      data: error?.data,
      message: error.data?.[0]?.message,
    })
  }
})
