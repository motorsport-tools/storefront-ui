import { joinURL } from 'ufo'
import { QueryName } from "~/server/queries";
import { Queries } from '~/server/queries'
import type {
    Order,
} from "~/graphql";
import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
    const config = useRuntimeConfig(event)
    const { access_token, res_id, model, pid } = getQuery(event)
    console.log('Query:', getQuery(event))
    /*
    {
        access_token: '49e47c04be28d18dd16a7ff354a863726dee209e3857468ac41e048c0610242f',
        auth_signup_token: 'NPoQElhpHGf00AykA5pn',
        hash: 'eac4d875f12012b39c8041cba8b5e14e29be8d98010e26e797df88aa5de013dd',
        model: 'sale.order',
        pid: '1461959',
        res_id: '471203' 

        471203 = Order
        1461959 = partner res_partner

    }
    */
    let resId = res_id

    if (resId && typeof resId === 'string') {
        const parsed = parseInt(resId, 10);
        if (!isNaN(parsed)) {
            resId = parsed;
        } else {
            resId = false;
        }
    }

    console.log('res Id: ', resId)

    if (!resId || !model) {
        //No res - no model = BS - Redirect to login
        return sendRedirect(event, '/login')
    }

    if (model == 'sale.order') {
        //If sale order - handle it
        if (!access_token && typeof access_token != 'string') {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid URl',
            })
        }
        if (!Number.isInteger(resId) || !resId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid Order ID',
            })
        }

        const response = await $fetch(`${config.public.odooBaseUrl}graphql/vsf`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'REAL-IP': getRequestIP(event) || '',
                'request-host': config.public.middlewareUrl || getRequestHost(event),
                'Cookie': `session_id=${getCookie(event, 'session_id')}`,
            },
            body: JSON.stringify({ query: Queries[QueryName.GetOrderQuery], variables: { id } }),
        })

        const order = (response?.data?.order as Order) || {}
        if (Object.keys(order).length === 0) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Forbidden: You do not have access to this order',
            })
        }
    }

})