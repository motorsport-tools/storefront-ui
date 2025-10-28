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
            const requestBody = await readBody(event)

            // Login Mutation
            if (requestBody[0]?.mutationName === MutationName.LoginMutation) {
                const pricelistId = (body as any)?.login?.user?.partner?.publicPricelist?.id

                if (pricelistId) {
                    const session = await useSession(event, {
                        password: 'b013b03ac2231e0b448e9a22ba488dcf',
                    })

                    await session.update({
                        ...session.data,
                        pricelistId: pricelistId
                    })

                    console.log('Stored pricelist from login:', pricelistId)
                }
            }
            // LoadUser query
            if (requestBody[0]?.queryName === QueryName.LoadUserQuery) {
                const pricelistId = (body as any)?.partner?.publicPricelist?.id

                if (pricelistId) {
                    const session = await useSession(event, {
                        password: 'b013b03ac2231e0b448e9a22ba488dcf',
                    })

                    await session.update({
                        ...session.data,
                        pricelistId: pricelistId
                    })

                    console.log('Stored pricelist from loadUser:', pricelistId)
                }

            }

            // Logout Mutation
            if (requestBody[0]?.mutationName === MutationName.LogoutMutation) {
                const session = await useSession(event, {
                    password: 'b013b03ac2231e0b448e9a22ba488dcf',
                })

                await session.clear()

                console.log('Logout - Session cleared')
            }
        }
    })
})