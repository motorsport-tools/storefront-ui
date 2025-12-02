import { joinURL } from 'ufo'
import { QueryName } from "~/server/queries";
import { Queries } from '~/server/queries'
import type {
    Order,
} from "~/graphql";
import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {

    event.node.res.setHeader('x-nitro-no-cache', '1')

    const { access_token, res_id, model, pid } = getQuery(event)

    if (!res_id || !model) {
        //No res - no model = BS - Redirect to login
        return sendRedirect(event, '/login')
    }

    if (model == 'sale.order') {
        //If sale order - handle it

        return sendRedirect(event, `/order/${Number(res_id)}?access_token=${encodeURIComponent(access_token)}&model=${encodeURIComponent(model)}&pid=${Number(pid)}`)

    }

})