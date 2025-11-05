import { joinURL } from 'ufo'
import { QueryName } from "~/server/queries";
import { Queries } from '~/server/queries'
import type {
    Order,
} from "~/graphql";
import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
    const config = useRuntimeConfig(event)

    const queryVars = getQuery(event)
    if (!queryVars.access_token || (!queryVars.report_type || queryVars.report_type !== 'pdf')) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid URL',
        })
    }
    const id = parseInt(event.context.params.orderId) as number || null
    if (!Number.isInteger(id) || !id) {
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

    const fileName = `${order.dateOrder}_Order_${order.id}_${order.partner?.name || 'Details'}.pdf`;

    const proxyUrl: string = process.env.NUXT_PUBLIC_ODOO_BASE_URL || ''
    const path = event.path
    const target = joinURL(proxyUrl, path)

    setResponseHeaders(event, {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${fileName}"`
    })

    const pdfRes = await $fetch(target, {
        method: event.node.req.method,
        headers: {
            'REAL-IP': getRequestIP(event) || '',
            'request-host': config.public.middlewareUrl || getRequestHost(event),
            'Cookie': `session_id=${getCookie(event, 'session_id')}`
        }
    })

    if (pdfRes.status !== 200) {
        throw createError({ statusCode: pdfRes.status, statusMessage: 'Failed to fetch PDF' })
    }

    console.log('PDF: ', pdfRes)

    return pdfRes


})