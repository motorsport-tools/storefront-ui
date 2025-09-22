interface ClerkFacetValue {
    v: string
    c: number
}

export type ClerkFacets = Record<string, ClerkFacetValue[]>

interface ClerkProductSearchResult {
    id: string
    name: string
    price: number
}

interface ClerkProductSearchResponse<T = any> {
    result?: T[]
    estimated_total_count?: number
    facets?: ClerkFacets
    facets_stats?: Record<string, any>
    no_exact_match?: boolean
    total_count?: number
    code?: number
    message?: string
}

export const useProductSearch = () => {
    const route = useRoute()
    const router = useRouter()

    const config = useRuntimeConfig()

    //State
    const query = ref<string>(route.query.search?.toString() || '')
    const sort = ref<string>(route.query.sort?.toString() || 'default')
    const page = ref<number>(parseInt(route.query.page?.toString() || '1'))
    const limit = ref<number>(20)

    const results = ref<ClerkProductSearchResult[]>([])
    const availableFacets = ref<ClerkFacets>({})
    const selectedFacets = ref<Record<string, string[]>>({})
    const filterCount = computed(() => Object.keys(selectedFacets.value).length || 0)
    const total = ref<number>(0)
    const loading = ref<boolean>(false)

    //Derived
    const offset = computed(() => (page.value - 1) * limit.value)
    const totalPages = computed(() => total.value ? Math.ceil(total.value / limit.value) : 0)

    //Static
    const nonFacetKeys = [
        'page',
        'search',
        'sort'
    ]

    const sortByOptions = [
        {
            id: 'list_price desc',
            value: 'price:desc',
            attrName: 'Price: High to Low',
        },
        {
            id: 'list_price asc',
            value: 'price:asc',
            attrName: 'Price: Low to High',
        },
        {
            id: 'name asc',
            value: 'name:asc',
            attrName: 'Name: A to Z',
        },
        {
            id: 'name desc',
            value: 'name:desc',
            attrName: 'Name: Z to A',
        },
        {
            id: 'popular desc',
            value: 'default',
            attrName: 'Most Popular',
        },
        {
            id: 'newest desc',
            value: 'created_at:desc',
            attrName: 'Newest',
        },
    ]

    const limitOptions = [4, 8, 12, 16, 20]

    //Functions
    const fetchSearch = async () => {
        const reqSort = sort.value == 'default' ? undefined : sort.value
        const reqFilters = buildQueryFilters()

        const res = await $fetch<ClerkProductSearchResponse>('/api/search/v3/search/products', {
            method: 'POST',
            body: {
                key: config.public.clerkApiKey,
                visitor: 'auto',
                labels: ['Search page'],
                attributes: ['id', 'name', 'brand', 'image', 'image_slug', 'image_filename', 'price', 'on_sale', 'list_price', 'rating', 'ratingCount', 'sku', 'slug', 'has_stock'],
                facets: ['price', 'brand', 'categories', 'on_sale', 'has_stock'],
                semantic: 0,
                query: query.value,
                sort: reqSort,
                limit: limit.value,
                offset: offset.value,
                filter: reqFilters,
            }
        })

        results.value = res?.result || []

        if (total.value === 0) {
            total.value = res.total_count || res.estimated_total_count || 0
        }

        if (Object.keys(availableFacets.value).length === 0) {
            availableFacets.value = res.facets || {}
        } else {
            availableFacets.value = mergeFacets(availableFacets.value, res.facets || {})
        }

        loading.value = false

    }

    const buildQueryFilters = () => {
        const filters: string[] = []

        for (const [facet, values] of Object.entries(selectedFacets.value)) {
            for (const v of values) {
                if (facet == 'categories') {
                    filters.push(`${facet} contains '${v}'`)
                } else {
                    filters.push(`${facet} = '${v}'`)
                }
            }
        }
        return filters
    }

    function mergeFacets(oldFacets: Record<string, ClerkFacetValue[]>, newFacets: Record<string, ClerkFacetValue[]>) {
        const merged: Record<string, ClerkFacetValue[]> = { ...oldFacets }

        for (const [facetName, newValues] of Object.entries(newFacets)) {
            const oldValues = merged[facetName] || []

            // map old values by v for quick lookup
            const map = new Map(oldValues.map(v => [v.v, v]))

            for (const newVal of newValues) {
                if (map.has(newVal.v)) {
                    // update count
                    map.get(newVal.v)!.c = newVal.c
                } else {
                    // add missing
                    map.set(newVal.v, newVal)
                }
            }

            merged[facetName] = Array.from(map.values())
        }

        return merged
    }

    const setQuery = (q: string) => {
        query.value = q
        page.value = 1
        total.value = 0
        fetchSearch()
        updateRoute()
    }

    const setSort = (s: string) => {
        sort.value = s
        page.value = 1
        fetchSearch()
        updateRoute()
    }

    const setFacet = (name: string, value: string | number | boolean) => {
        const current = selectedFacets.value[name] || []

        switch (typeof value) {
            case 'string':
            case 'number': {
                if (current.includes(value)) {
                    selectedFacets.value[name] = current.filter(v => v !== value)
                    if (selectedFacets.value[name].length === 0) {
                        delete selectedFacets.value[name]
                    }
                } else {
                    selectedFacets.value[name] = [...current, value]
                }
                break
            }

            case 'boolean': {
                if (value) {
                    selectedFacets.value[name] = [true]
                } else {
                    delete selectedFacets.value[name]
                }
                break
            }
        }
        page.value = 1
        total.value = 0
        fetchSearch()
        updateRoute()
    }

    /* Write A Clear Facet Func */

    const setPage = (p: number) => {
        if (p < 1 || p > totalPages.value) return
        page.value = p
        fetchSearch()
        updateRoute()
    }

    const setLimit = (l: number) => {
        const newPage = Math.floor(offset.value / l) + 1
        limit.value = l
        page.value = newPage
        fetchSearch()
        updateRoute()
    }

    //Update Router
    function updateRoute() {
        const queryObj: Record<string, string | undefined> = {
            search: query.value || undefined,
            page: page.value > 1 ? page.value.toString() : undefined,
        }

        if (sort.value && sort.value !== 'default') {
            queryObj['sort'] = sort.value
        }

        for (const [facet, values] of Object.entries(selectedFacets.value)) {
            if (values.length) {
                queryObj[facet] = values.join(',')
            }
        }

        router.replace({ query: queryObj })
    }

    //Watcher
    watch(
        () => route.query,
        newQuery => {
            query.value = newQuery.search?.toString() || ''
            sort.value = newQuery.sort?.toString() || 'default'
            page.value = parseInt(newQuery.page?.toString() || '1')

            selectedFacets.value = {}
            for (const [key, value] of Object.entries(newQuery)) {
                if (nonFacetKeys.includes(key)) continue
                if (typeof value === 'string') {
                    selectedFacets.value[key] = value.split(',')
                }
            }

            fetchSearch()
        },
        { immediate: true, deep: true }
    )

    //Init
    fetchSearch()

    return {
        query,
        sort,
        page,
        limit,
        results,
        availableFacets,
        selectedFacets,
        filterCount,
        total,
        totalPages,
        loading,
        sortByOptions,
        limitOptions,
        setQuery,
        setSort,
        setLimit,
        setFacet,
        setPage,
    }
}