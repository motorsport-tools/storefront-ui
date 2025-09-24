export default defineNuxtRouteMiddleware(async (to) => {
    // Skip middleware if route exists in the static route tree
    if (to.matched.length > 0 || to.path.startsWith('/api/') || to.path.startsWith('/~partytown')) {
        return
    }

    // Get the slug from the current route
    const router = useRouter()
    const slug = to.path

    try {
        const { data: routeData } = await useFetch(`/api/route-resolver`, {
            params: {
                slug,
            },
        })

        if (!routeData?.value?.data) {
            console.warn('[dynamic-routes] Route does not exist or invalid:', slug)
            return
        }

        const routeComponents = {
            category: () => import('~/layers/clerkio/custom-pages/category-page.vue'),
            product: () => import('~/layers/product/custom-pages/product-page.vue'),
            page: () => import('~/layers/directus/custom-pages/page-builder-page.vue')
        }


        const routeType = routeData.value.data as keyof typeof routeComponents
        const component = routeComponents[routeType]

        if (!component) {
            console.warn('[dynamic-routes] Invalid route type:', routeType)
            return
        }

        router.addRoute({
            path: to.path,
            name: slug.replace(/^\//, '').replace(/\//g, '-'),
            component: component,
        })

        // Trigger the route replacement
        return to.fullPath
    } catch (error) {
        console.error('[dynamic-routes] Error in dynamic route middleware:', error)
        return
    }
})