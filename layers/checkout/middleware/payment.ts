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
    /*
    amount=17.1
    access_token=7aff2035b71708c1552461b7ea2ee77683627893d089c6a5339d1c0fe8a4792c
    sale_order_id=471612
    */
})