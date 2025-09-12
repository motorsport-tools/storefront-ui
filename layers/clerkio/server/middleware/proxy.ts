export default defineEventHandler(async (event) => {
    const { res } = event.node
    const prefix = '/api/search/'
    if (event.path.startsWith(prefix)) {

        res.setHeader('Cache-Control', 'no-store')

        const targetPath = event.path.replace(prefix, '/')

        const targetUrl = `https://api.clerk.io${targetPath}`

        return proxyRequest(event, targetUrl)
    }
})