import { joinURL } from 'ufo'
import { QueryName } from "~/server/queries";
import type { Endpoints } from "@erpgap/odoo-sdk-api-client";
import type {
    GetInvoiceResponse,
    Invoice,
    QueryInvoiceArgs,
  } from "~/graphql";
  
export default defineEventHandler(async (event) => {

    const queryVars = getQuery(event)
    if(!queryVars.access_token || (!queryVars.report_type || queryVars.report_type !== 'pdf' )) {
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

    //Check Access to Invoice Id
    const api: Endpoints = event.context.apolloClient.api;
    const response = await api.query<QueryInvoiceArgs, GetInvoiceResponse>(
        { queryName: QueryName.GetInvoiceQuery },
        {id: id}
    );

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


    return proxyRequest(event, target)
})