import { joinURL } from 'ufo'
import { QueryName } from "~/server/queries";
import { Queries } from '~/server/queries'
import type { Endpoints } from "@erpgap/odoo-sdk-api-client";
import type {
    GetInvoiceResponse,
    Invoice,
    QueryInvoiceArgs,
} from "~/graphql";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)

    const queryVars = getQuery(event)
    if (!queryVars.access_token || (!queryVars.report_type || queryVars.report_type !== 'pdf')) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid URL',
        })
    }
    const id = parseInt(event.context.params.invoiceId) as number
    if (!Number.isInteger(id)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid Invoice ID',
        })
    }
    const token = queryVars.access_token as string

    //Check Access to Invoice Id
    const response = await $fetch<any>(`${config.public.odooBaseUrl}graphql/vsf`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'REAL-IP': getRequestIP(event) || '',
            'Cookie': `session_id=${getCookie(event, 'session_id')}`,

        },
        body: {
            query: Queries[QueryName.GetInvoiceQuery],
            variables: {
                id: id,
                token: token
            }
        },
        credentials: 'include',
    })

    const invoice = (response?.data?.invoice as Invoice) || {}
    if (Object.keys(invoice).length === 0) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Forbidden: You do not have access to this invoice',
        })
    }


    const fileName = `${invoice.name}_${invoice.id}_${invoice.invoiceDate}.pdf`;
    event.node.res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

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

    if (pdfRes.size <= 0) {
        throw createError({ statusCode: pdfRes.status, statusMessage: 'Failed to fetch PDF' })
    }

    return pdfRes
})