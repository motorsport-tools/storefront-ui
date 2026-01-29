import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {

    event.node.res.setHeader('x-nitro-no-cache', '1')

    const { access_token } = getQuery(event)

    if (!access_token) {
        //No access token = BS - Redirect to login
        return sendRedirect(event, '/login')
    }

    return sendRedirect(event, `/cart?access_token=${encodeURIComponent(access_token as string)}`)
})