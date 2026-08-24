import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
    const prefix = '/api/search/'

    if (event.path.startsWith(prefix)) {
        const targetPath = event.path.replace(prefix, '/')
        const targetUrl = `https://api.clerk.io${targetPath}`

        if (event.method == 'POST') {
            // Get the request body
            const body = await readBody(event)

            const response = await $fetch(targetUrl, {
                method: event.method,
                headers: [['Cache-Control', 'no-cache, no-store']],
                body: JSON.stringify(body),
            })

            return response
        } else if (event.method == 'GET') {
            const config = useRuntimeConfig()

            const query = getQuery(event)

            query.private_key = config.clerkKey

            const response = await $fetch(targetUrl, {
                method: event.method,
                headers: [['Cache-Control', 'no-cache, no-store']],
                query: query
            })

            return response
        }
    }
})