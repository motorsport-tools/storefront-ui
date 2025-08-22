export default defineEventHandler(async (event) => {
    const prefix = '/api/search/'
    if (event.path.startsWith(prefix)) {

        const targetPath = event.path.replace(prefix, '/')

        const targetUrl = `https://api.clerk.io${targetPath}`

        return proxyRequest(event, targetUrl)
    }
})