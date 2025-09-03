import type { AttributeFacet } from "~/graphql"
import { generateFacet, generatePriceBuckets } from "../utils/index"


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
    const minPrice = useState<number | null>(`min-price-search-list${slugIndex.value}${customIndex}`, () => null)
    const maxPrice = useState<number | null>(`max-price-search-list${slugIndex.value}${customIndex}`, () => null)
    const organizedAttributes = useState<AttributeFacet[]>(`attributes${slugIndex.value}${customIndex}`, () => [])

    const limit = ref(20)
    const offset = computed(() => (route?.query?.page && Number(route?.query?.page) > 1 ? (Number(route.query.page) - 1) * limit.value : 0))

    const stockCount = useState<number>(`stock-count${slugIndex.value}${customIndex}`, () => 0)
    const totalItems = useState<number>(`total-items${cleanFullSearchIndex.value}${customIndex}`, () => 0)
    const query = ref<ClerkProductSearchParams>({})

    const updateVariables = (data: ClerkProductSearchResponse | null) => {
        searchResults.value = []
        searchResults.value = [...(data?.result ?? [])]
        totalItems.value = data?.total_count ? data.total_count : data?.estimated_total_count || 0
        minPrice.value = data?.facets_stats?.price?.min || null
        maxPrice.value = data?.facets_stats?.price?.max || null

        computeAttributes(data?.facets as any)
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
                        attributes: ['id', 'name', 'brand', 'image', 'image_slug', 'image_filename', 'price', 'on_sale', 'list_price', 'rating', 'ratingCount', 'sku', 'slug'],
                        limit: limit.value,
                        offset: offset.value,
                        semantic: 1.0,
                        facets: ['price', 'brand', '_category_name', 'on_sale', 'has_stock'],
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

    const computeAttributes = (attributes: any[]) => {
        const data: AttributeFacet[] = []

        if (!attributes) return
        Object.entries(attributes)?.forEach(([key, items]: [string, any]) => {
            let current = data.find((itemData: { attributeName: any }) =>
                itemData.attributeName === key
            )

            if (!current) {
                current = generateFacet(key)
                data.push(current)
            }
            if (key === "price") {
                current.options = generatePriceBuckets(items, minPrice.value, maxPrice.value, 5)
            } else {
                items.forEach((item: any) => {
                    current.options.push({
                        id: String(item.v),
                        value: item.v,
                        label: item.v,
                        htmlColor: item.htmlColor || false,
                        total: item.c || 0
                    })
                })
            }
        })


        const inStockFilterCount = data?.find(filter => filter.type === 'in-stock')
        if (inStockFilterCount) {
            stockCount.value = inStockFilterCount.options?.find(option => option.id === 'true')?.total || 0
        }

        const queryParamsKeys = Object.keys(route.query)

        organizedAttributes.value = data.filter((item) => {
            if (item.options.length === 1) {
                return false
            }
            if (queryParamsKeys?.filter(item => item !== 'sort' && item !== 'list-view').length > 0) {
                return true
            }

            return item.options.length > 1
        })

        organizedAttributes.value = organizedAttributes.value.sort(
            (a, b) => Number(a.id) - Number(b.id),
        )

        organizedAttributes.value.forEach((item) => {
            if (item.type !== 'price') {
                item.options = item.options.sort((a, b) =>
                    a.label.localeCompare(b.label),
                )
            }
        })

        console.log('Final Attributes: ', organizedAttributes.value)
    }

    return {
        loading,
        searchResults,
        totalItems,
        stockCount,
        minPrice,
        maxPrice,
        organizedAttributes,
        search
    }
}