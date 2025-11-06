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

        router.replace({ path: '/search', query: { search: searchInputValue.value } })
    }

    const omniSearch = async () => {
        loading.value = true

        if (searchInputValue.value.length < 3) {
            loading.value = false
            showInstantSearch.value = false
            return
        }

        try {
            const predictive = await $fetch<ClerkSearchResponse>('/api/search/v3/search/omni', {
                method: 'POST',
                body: {
                    key: config.public.clerkApiKey,
                    visitor: 'auto',
                    labels: ['Search bar'],
                    query: searchInputValue.value,
                    searches: {
                        products: {
                            index: 'products',
                            limit: 8,
                            attributes: ['id', 'name', 'image', 'price', 'on_sale', 'sku', 'url'],
                        },
                        categories: {
                            index: 'categories',
                            limit: 6,
                            attributes: ['id', 'name', 'url', 'display_name'],
                        },
                        pages: {
                            index: 'pages',
                            limit: 6
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