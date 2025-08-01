export default async function useSiteGlobals() {

    const {
        data: siteData,
        error: siteError,
        refresh,
    } = await useFetch('/api/site-data', {
        key: 'site-data',
    })
    return {
        siteData,
        siteError,
        refresh
    }
}