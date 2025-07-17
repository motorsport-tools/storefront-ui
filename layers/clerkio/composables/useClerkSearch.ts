import { ref, watch } from 'vue'

interface ClerkSearchResult<T = any> {
    result: T[]
    estimated_total_count: number
}

interface ClerkResults {
    pages?: ClerkSearchResult<{  }>
    products?: ClerkSearchResult<{ id: number; [key: string]: any }>
    categories?: ClerkSearchResult<{  }>
}
  
interface ClerkSearchResponse {
    query: string
    results: ClerkResults
}

export const useClerkSearch = (formSearchTemplateRef?: any, options = { limit: 6 }) => {
    const route = useRoute()
    const router = useRouter()

    const config = useRuntimeConfig()
    const loading = ref(false)
    const searchInputValue = useState(`odoo-search-input-${formSearchTemplateRef}`, () => '')
    const suggestions = ref<string[]>([])
    const results = useState<ClerkSearchResponse[]>(`clerk-results-${formSearchTemplateRef}`, () => [])
    const showInstantSearch = ref(false)

    watch(searchInputValue, async (val) => {
        if (!val || val.length < 3) {
            loading.value = false
            showInstantSearch.value = false
            suggestions.value = []
            return
        }
    })

    const enterPress = () => {
        if (!searchInputValue.value) return
        showInstantSearch.value = false
        router.push({ path: '/search', query: { search: searchInputValue.value } })
    }

    const search = async () => {
        loading.value = true

        if (searchInputValue.value.length < 3) {
            loading.value = false
            showInstantSearch.value = false
        }

        try {
            const predictive = await $fetch<ClerkSearchResponse>('https://api.clerk.io/v3/search/omni', {
                method: 'POST',
                body: {
                    key: config.public.clerkApiKey,
                    visitor: 'auto',
                    labels: ['search bar'],
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
                        },
                        pages: {
                            index: 'pages',
                            limit: 6
                        }
                    }
                },
            })

            results.value = predictive || {}
            showInstantSearch.value = true

        } catch (err) {
            console.log(err)
            showInstantSearch.value = false
        } finally {
            loading.value = false
        }
    }

    return {
        results,
        loading,
        showInstantSearch,
        searchInputValue,
        enterPress,
        search
    }
}