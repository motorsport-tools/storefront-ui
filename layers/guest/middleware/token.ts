export default defineNuxtRouteMiddleware(async (to, from) => {

    const { access_token, model, pid } = to.query
    const res_id = Number(to.params?.id)

    const { checkAccess } = useTokenAuth(Number(res_id), Number(pid), String(model), String(access_token))

    const access = await checkAccess()

    if (access) return true

    throw createError({
        statusCode: 500,
        statusMessage: 'Forbidden',
    })

})