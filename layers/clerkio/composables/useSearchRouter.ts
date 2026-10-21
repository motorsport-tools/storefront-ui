

export const useSearchRouter = () => {
    const route = useRoute()
    const router = useRouter()

    const toArray = (v: unknown): string[] | undefined => {
        if (v == null || v === '') return undefined
        return (Array.isArray(v) ? v : [v]).map(String)
    }
    const toStr = (v: unknown): string | undefined => {
        const s = Array.isArray(v) ? v[0] : v
        return s == null || s === '' ? undefined : String(s)
    }

    const cleanQuery = (state: Record<string, any>) =>
        Object.fromEntries(
            Object.entries(state)
                .filter(([, v]) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && !v.length))
                .map(([k, v]) => [k, Array.isArray(v) ? v.map(String) : String(v)])
        )

    const createNuxtRouter = () => {
        const basePath = route.path
        let stop: (() => void) | undefined
        let disposed = false
        const isHere = () => !disposed && router.currentRoute.value.path === basePath


        const read = () => ({
            q: toStr(route.query.q),
            categories: toArray(route.query.categories),
            brands: toArray(route.query.brands),
            fits: toArray(route.query.fits),
            has_stock: toStr(route.query.has_stock),
            on_sale: toStr(route.query.on_sale),
            price: toStr(route.query.price),
            page: toStr(route.query.page),
            limit: toStr(route.query.limit),
        })

        let lastWritten: string | null = null

        return {
            read,
            write(routeState: Record<string, any>) {
                if (import.meta.server || !isHere()) return
                const target = router.resolve({ path: basePath, query: cleanQuery(routeState) })
                if (target.fullPath === router.currentRoute.value.fullPath) return
                lastWritten = target.fullPath
                router.replace(target.fullPath)
            },
            onUpdate(cb: (state: any) => void) {
                if (import.meta.server) return
                disposed = false
                stop = watch(() => router.currentRoute.value.fullPath, (fp) => {
                    if (!isHere()) return
                    if (fp === lastWritten) { lastWritten = null; return }
                    cb(read())
                })
            },
            createURL(routeState: Record<string, any>) {
                return router.resolve({ path: basePath, query: cleanQuery(routeState) }).href
            },
            start() { disposed = false },
            dispose() {
                disposed = true
                stop?.()
            },
        }
    }

    return {
        createNuxtRouter,
        toArray,
        toStr,
        cleanQuery,
    }
}