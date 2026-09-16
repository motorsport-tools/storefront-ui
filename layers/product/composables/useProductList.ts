import type { Product, ProductTemplateListResponse, QueryProductsArgs } from '~/graphql'
import { QueryName } from '~/server/queries'

type ProductListItem = {
    id: number
    sku: string
}

type ProductListState = {
    list: ProductListItem[]
    data: Product[]
    loading: boolean
}

interface ClerkProductsResponse<T = any> {
    status?: string
    products?: T[]
}

export const useProductList = (customIndex: string = '') => {
    const { $sdk } = useNuxtApp()
    const config = useRuntimeConfig()
    const clerkVisitorCookie = useCookie<string | null>('clerk_visitor')
    const headers = useRequestHeaders()

    const state = useState<ProductListState>(`useProductList${customIndex}`, () => ({
        list: [],
        data: [],
        loading: false,
    }))

    const setState = <K extends keyof ProductListState>(
        key: K,
        value: ProductListState[K]
    ) => {
        state.value[key] = value
    }

    const loadProductList = async (params: QueryProductsArgs) => {
        try {
            state.value.loading = true

            const { data } = await useAsyncData(`product-list-data${customIndex}`,
                () =>
                    $sdk().odoo.query<QueryProductsArgs, ProductTemplateListResponse>(
                        { queryName: QueryName.GetProductListQuery },
                        params,
                        { headers },
                    ),
                { server: true, lazy: import.meta.client },
            )

            if (data.value?.products) {
                setState('list', data.value.products.products as ProductListItem[])
            }
        } catch (error: any) {
            console.error('Error in loadProductList:', error)
        } finally {
            state.value.loading = false
        }
    }

    const loadProductData = async (params: QueryProductsArgs) => {
        await loadProductList(params)
        const visitorId = clerkVisitorCookie.value || 'auto'

        if (state.value.list.length) {
            try {
                const productIds = state.value.list.map(item => item.firstVariant.id)
                const data = await $fetch<ClerkProductsResponse>('/api/search/v2/products', {
                    method: 'GET',
                    query: {
                        products: JSON.stringify(productIds),
                        visitor: visitorId,
                        key: config.public.clerkApiKey,
                    },
                })

                if (data?.status === 'ok' && data?.products) {
                    setState('data', data.products as Product[])
                }
            } catch (error: any) {
                console.error('Error fetching product blocks:', error)
            }
        }
    }

    return {
        loadProductData,
        ...toRefs(state.value)
    }

}