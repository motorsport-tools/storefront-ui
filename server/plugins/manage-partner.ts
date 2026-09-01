import { MutationName } from '~/server/mutations'
import { QueryName } from '~/server/queries/'
/*
*
* This plugin is responsible for setting user session based info
*  on loadUserData and login
*/

export default defineNitroPlugin((nitro) => {
    nitro.hooks.hook('beforeResponse', async (event, { body }) => {
        if (event.method === "POST") {
            try {
                const requestBody = await readBody(event)
                let resBody = body
                if (typeof body === 'string') {
                    try {
                        resBody = JSON.parse(body)
                    } catch (e) {}
                }
                const sessionPwd = process.env.NUXT_SESSION_SECRET || ""
                // Login Mutation
                if (requestBody?.[0]?.mutationName === MutationName.LoginMutation) {
                    const pricelistId = (resBody as any)?.login?.user?.partner?.publicPricelist?.id

                    if (pricelistId) {
                        const session = await useSession(event, {
                            password: sessionPwd,
                        })

                        await session.update({
                            ...session.data,
                            pricelistId: pricelistId
                        })
                    }
                }
                // LoadUser query
                if (requestBody?.[0]?.queryName === QueryName.LoadUserQuery) {
                    const pricelistId = (resBody as any)?.partner?.publicPricelist?.id

                    if (pricelistId) {
                        const session = await useSession(event, {
                            password: sessionPwd,
                        })

                        await session.update({
                            ...session.data,
                            pricelistId: pricelistId
                        })
                    }

                }

                // Logout Mutation
                if (requestBody?.[0]?.mutationName === MutationName.LogoutMutation) {
                    const session = await useSession(event, {
                        password: sessionPwd,
                    })

                    await session.clear()
                }
            } catch (error) {
                console.error('Error in manage-partner nitro plugin:', error)
            }
        }
    })
})