import { joinURL } from 'ufo'
import { Queries } from '~/server/queries'
import { QueryName } from "~/server/queries";
import type { Endpoints } from "@erpgap/odoo-sdk-api-client";
import type {
    GetOrderResponse,
    Order,
    QueryOrderArgs,
  } from "~/graphql";
export default defineEventHandler(async (event) => {

    const queryVars = getQuery(event)
    if(!queryVars.access_token || (!queryVars.report_type || queryVars.report_type !== 'pdf' )) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid URL',
        })
    }
    const id = parseInt(event.context.params.orderId) as number
    if (!Number.isInteger(id)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid Order ID',
        })
    }

    //Check Access to Order Id
    const api: Endpoints = event.context.apolloClient.api;
    const response = await api.query<QueryOrderArgs, GetOrderResponse>(
        { queryName: QueryName.GetOrderQuery },
        {id: id}
    );

    const order = (response?.data?.order as Order) || {}
    if (Object.keys(order).length === 0) {
        throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: You do not have access to this order',
        })
    }

    const proxyUrl: string = process.env.NUXT_PUBLIC_ODOO_BASE_URL || ''
    const path = event.path
    const target = joinURL(proxyUrl, path)


    return proxyRequest(event, target)
})