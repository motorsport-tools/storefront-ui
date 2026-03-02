import { useCookieConsent } from "../../cookies/composables/useCookieConsent"

interface ClerkProductsResponse<T = any> {
  status?: string
  products?: T[]
}

export const useRecentViews = () => {
  const { consent } = useCookieConsent("cookieBar.functional.cookies.recentlyViewed.name")

  const recentViewsVisitor = useCookie<string | null>('recent-view-visitor', {
    sameSite: 'strict',
    default: () => consent.value
      ? globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
      : null,
  })

  const list = useCookie<number[] | null>("recent-view-products", {
    default: () => consent.value ? [] : null,
    sameSite: 'strict',
  })

  const state = useState(`useRecentViews-${recentViewsVisitor.value}`, () => ({
    data: [],
    loading: false,
  }))

  const config = useRuntimeConfig()

  const setState = (data: any) => {
    state.value.data = data
  }

  const addProductToRecentViews = (id: number) => {
    if (!consent.value) return

    const currentList = list.value ?? []
    const filtered = currentList.filter((productId) => productId !== id)
    list.value = [id, ...filtered]
  }

  const removeProductFromRecentViews = (id: number) => {
    list.value = (list.value ?? []).filter((productId) => productId !== id)
  }

  const getRecentViewsData = async (limit: number = 10) => {
    if (!consent.value) return []

    state.value.loading = true
    const { data } = await useAsyncData(
      `useRecentViews-${recentViewsVisitor.value}-${JSON.stringify(list.value)}-${limit}`,
      () => $fetch<ClerkProductsResponse>('/api/search/v2/products', {
        method: 'GET',
        query: {
          products: (list.value ?? []).slice(0, limit).join(','),
          key: config.public.clerkApiKey,
          limie: limit,
        },
      })
    )

    if (data.value?.status == 'ok') {
      setState(data.value.products)
    }

    state.value.loading = false
    return state.value.data
  }

  return {
    addProductToRecentViews,
    removeProductFromRecentViews,
    getRecentViewsData,
    list: computed(() => list.value ?? []),
    ...toRefs(state.value)
  }
}
