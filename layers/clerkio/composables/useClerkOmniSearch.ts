import { ref, watch } from 'vue'

interface ClerkSearchResult<T = any> {
    result: T[]
    estimated_total_count: number
}

interface ClerkOmniResults {
    pages?: ClerkSearchResult<{}>
    products?: ClerkSearchResult<{ id: number;[key: string]: any }>
    categories?: ClerkSearchResult<{}>
}

interface ClerkSearchResponse {
    query: string
    results: ClerkOmniResults
}
export const useClerkOmniSearch = (formSearchTemplateRef?: any, options = { limit: 6 }) => {
    const router = useRouter()

    const config = useRuntimeConfig()

    const searchInputValue = useState(`clerk-search-input-${formSearchTemplateRef}`, () => '')
    const omniResults = useState<ClerkSearchResponse[]>(`clerk-results-${formSearchTemplateRef}`, () => [])
    const showInstantSearch = ref(false)

    const loading = useState(`clerk-loading-omni`, () => false)

    watch(searchInputValue, async (val) => {
        if (!val || val.length < 3) {
            loading.value = false
            showInstantSearch.value = false
            omniResults.value = []
            return
        }
    })

    const enterPress = () => {
        if (!searchInputValue.value) return

        router.push({ path: '/search', query: { q: searchInputValue.value } }).then(() => { router.go(0) })
    }

    const omniSearch = async () => {
        loading.value = true

        if (searchInputValue.value.length < 3) {
            loading.value = false
            showInstantSearch.value = false
            return
        }

        const visitorId = useCookie('clerk_visitor').value || 'auto'

        try {
            const predictive = await $fetch<ClerkSearchResponse>('/api/search/v3/search/omni', {
                method: 'POST',
                body: {
                    key: config.public.clerkApiKey,
                    visitor: visitorId,
                    labels: ['Search bar'],
                    query: searchInputValue.value,
                    searches: {
                        products: {
                            index: 'products',
                            limit: 8,
                            attributes: ['id', 'name', 'image', 'image_slug', 'price', 'list_price', 'on_sale', 'sku', 'url', 'slug', 'pricelist_ids', 'pricelist_prices', 'pricelist_list_prices', 'pricelist_on_sale', 'pricelist_price_extra'],
                        },
                        categories: {
                            index: 'categories',
                            limit: 6,
                            attributes: ['id', 'name', 'url', 'display_name', 'slug'],
                        },
                        pages: {
                            index: 'pages',
                            limit: 6,
                        }
                    }
                },
            })

            omniResults.value = predictive || {}
            showInstantSearch.value = true

        } catch (err) {
            console.log(err)
            showInstantSearch.value = false
        } finally {
            loading.value = false
        }
    }

    return {
        omniResults,
        loading,
        showInstantSearch,
        searchInputValue,
        enterPress,
        omniSearch,
    }
}