interface ClerkProductsResponse<T = any> {
    status?: string
    product_data?: T[]
}

export const useProductRecommendations = () => {

    const config = useRuntimeConfig()
    const state = useState(`useProductRecommendations`, () => ({
        data: [] as any[],
        loading: false,
    }))
    const setState = (data: any) => {
        state.value.data = data
    }

    const getRecommendationsData = async (email: string, limit: number = 8) => {
        state.value.loading = true

        const visitorId = useCookie('clerk_visitor').value || 'auto'

        try {
            const data = await $fetch<ClerkProductsResponse>('/api/search/v2/recommendations/visitor/complementary', {
                method: 'POST',
                body: {
                    visitor: visitorId,
                    key: config.public.clerkApiKey,
                    limit: limit,
                    email: email,
                    labels: ["Customer Recommendations"],
                    attributes: ['id', 'name', 'brand', 'image', 'image_slug', 'image_filename', 'price', 'on_sale', 'list_price', 'rating', 'ratingCount', 'sku', 'slug', 'has_stock', 'pricelist_ids', 'pricelist_names', 'pricelist_prices', 'pricelist_list_prices', 'pricelist_price_extra', 'pricelist_on_sale', 'pricelist_currencies', 'pricelist_discount_perc', 'ribbon_html', 'ribbon_text_color', 'ribbon_bg_color'],
                },
            })

            if (data?.status == 'ok') {
                setState(data.product_data)
            }
        } catch (error) {
            console.error('Failed to fetch recommendations:', error)
        } finally {
            state.value.loading = false
        }

        return state.value.data
    }

    return {
        getRecommendationsData,
        ...toRefs(state.value)
    }
}




