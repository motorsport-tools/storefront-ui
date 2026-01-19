import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {

    event.node.res.setHeader('x-nitro-no-cache', '1')

    const { access_token, revive } = getQuery(event)

    if (!access_token) {
        //No access token = BS - Redirect to login
        return sendRedirect(event, '/login')
    }
    if (!revive) {
        return sendRedirect(event, `/cart?access_token=${encodeURIComponent(access_token)}`)
    } else if (revive === 'squash') {

    } else if (revive === 'merge') {

    }
    return sendRedirect(event, `/cart`)
})