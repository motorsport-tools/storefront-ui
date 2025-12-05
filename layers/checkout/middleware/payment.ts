export default defineNuxtRouteMiddleware(async (to, from) => {

    const { access_token, amount } = to.query
    const res_id = to.query.sale_order_id

    const { checkAccess } = useTokenAuth(Number(res_id), 4, 'sale.order', String(access_token))

    const access = await checkAccess()

    if (access) return true

    throw createError({
        statusCode: 500,
        statusMessage: 'Forbidden',
    })
})