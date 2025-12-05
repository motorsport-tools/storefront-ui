interface ClerkProductsResponse<T = any> {
  status?: string
  products?: T[]
}

export const useRecentViews = () => {
  const list = useCookie<Number[]>("recent-view-products")
  const sid = useCookie('session_id')
  const state = useState(`useRecentViews-${sid.value}`, () => ({
    data: [],
    loading: false,
  }
  ))
  const config = useRuntimeConfig()

  const setState = (data: any) => {
    state.value.data = data
  }

  const addProductToRecentViews = (id: number) => {
    if (list.value?.includes(id)) {
      removeProductFromRecentViews(id)
    }
    list.value?.unshift(id) || (list.value = [id])
  }

  const removeProductFromRecentViews = (id: number) => {
    list.value = list.value.filter((productId) => productId !== id)
  }

  const getRecentViewsData = async (limit: number = 10) => {
    state.value.loading = true;
    const { data } = await useAsyncData(`useRecentViews-${sid.value}-${JSON.stringify(list.value)}-${limit}`, () => $fetch<ClerkProductsResponse>('/api/search/v2/products', {
      method: 'GET',
      query: {
        products: list.value.slice(0, limit).join(','),
        key: config.public.clerkApiKey,
        limie: limit
      }
    }))

    if (data.value?.status == 'ok') {
      setState(data.value.products)
    }

    state.value.loading = false;
    return state.value.data
  }

  return {
    addProductToRecentViews,
    removeProductFromRecentViews,
    getRecentViewsData,
    list: computed(() => list.value),
    ...toRefs(state.value)
  }
}