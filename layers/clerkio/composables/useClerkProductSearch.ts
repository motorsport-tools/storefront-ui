
interface ClerkProductSearchParams {
    query: string
    filter?: Record<string, any>
    sort?: string
    offset?: {
        type: number
        default: 0
    }
    limit?: {
        type: number
        default: 20
    }
    label?: {
        type: string
        default: 'Product Search'
    }
}

interface ClerkProductSearchResponse<T = any> {
    result?: T[]
    estimated_total_count?: number
    facets?: Record<string, any>
    facets_stats?: Record<string, any>
    no_exact_match?: boolean
    total_count?: number
    code?: number
    message?: string
}

export const useClerkProductSearch = (customIndex: string = '') => {
    const route = useRoute()
    const config = useRuntimeConfig()

    const slugIndex = computed(() => route.fullPath)
    const cleanFullSearchIndex = computed(() => getUniqueUrlFromRouteFilteringByAttributes(route.path, route))

    const loading = useState(`clerk-loading${customIndex}`, () => false)
    const searchResults = useState<ClerkProductSearchResponse[]>(`clerk-search-results${cleanFullSearchIndex.value}${customIndex}`, () => [])

    const stockCount = useState<number>(`stock-count${slugIndex.value}${customIndex}`, () => 0)
    const totalItems = useState<number>(`total-items${cleanFullSearchIndex.value}${customIndex}`, () => 0)
    const query = ref<ClerkProductSearchParams>({})

    const updateVariables = (data: ClerkProductSearchResponse | null) => {
        searchResults.value = []
        searchResults.value = [...(data?.result ?? [])]
        totalItems.value = data?.total_count ? data.total_count : data?.estimated_total_count || 0
    }

    const search = (params: ClerkProductSearchParams) => {
        query.value = params
        const { data, pending, error } = useAsyncData(
            `clerk-product-search${cleanFullSearchIndex.value}${customIndex}`,
            () =>
                $fetch<ClerkProductSearchResponse>('/api/search/v3/search/products', {
                    method: 'POST',
                    body: {
                        key: config.public.clerkApiKey,
                        visitor: 'auto',
                        attributes: ['id', 'name', 'image', 'image_slug', 'image_filename', 'price', 'on_sale', 'list_price', 'rating', 'ratingCount', 'sku', 'url'],
                        ...query.value
                    },
                }),
            { server: true, lazy: import.meta.client, watch: [query], default: () => [] },
        )

        watch(data, (newData) => {
            if (!newData) return
            updateVariables(newData)
        }, { immediate: true })

        watch(pending, (val) => {
            loading.value = val
        })
    }

    return {
        loading,
        searchResults,
        totalItems,
        stockCount,
        search
    }
}