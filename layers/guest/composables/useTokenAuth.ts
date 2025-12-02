import { QueryName } from "~/server/queries";

export const useTokenAuth = (res_id: number | null = null, pid: number | null = null, model: string | null = null, access_token: string | null = null) => {
    const { $sdk } = useNuxtApp()

    const checkAccess = async () => {
        const data = await $sdk().odoo.query(
            { queryName: QueryName.AccessQuery },
            {
                res_id: Number(res_id),
                pid: Number(pid),
                model,
                access_token: access_token
            }
        )
        if (!data || !data.access?.access) return false

        return data.access.access
    }

    return {
        checkAccess,
    }

}