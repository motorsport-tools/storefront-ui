

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
        const q = router.currentRoute.value.query

        const read = () => ({
            q: toStr(q.q),
            categories: toArray(q.categories),
            brands: toArray(q.brands),
            fits: toArray(q.fits),
            has_stock: toStr(q.has_stock),
            on_sale: toStr(q.on_sale),
            price: toStr(q.price),
            page: toStr(q.page),
            limit: toStr(q.limit),
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
                stop?.()
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