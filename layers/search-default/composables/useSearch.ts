import { onClickOutside, useToggle, useDebounceFn } from '@vueuse/core'
import type { Product } from '~/graphql'

/**
 * @Responsabilities
 *  1 - FETCH from odoo
 *  2 - Higlighth the results
 *  3 - Handle modal state
 */
export const useSearch = (formSearchTemplateRef?: any) => {
  const route = useRoute()
  const router = useRouter()
  
  // search modal
  const searchModalClose = () => searchModalToggle(false)
  const searchModalOpen = useState(`search-ref-${formSearchTemplateRef}`, () => false)
  const searchModalToggle = useToggle(searchModalOpen)
  const isSearchModalOpen = computed(() => searchModalOpen.value)
  const searchInputValue = useState(`odoo-search-input-${formSearchTemplateRef}`, () => '')


  // odoo search
  const {
    loadProductTemplateList,
    productTemplateList,
    totalItems,
    organizedAttributes,
    loading
  } = useProductTemplateList(searchInputValue.value || '')
  
  const highlightedIndex = ref(-1)
  const showResultSearch = ref(false)

  watch(
    () => route.query,
    () => {
      searchInputValue.value = ''
    },
  )

  watch(searchInputValue,
    (newValue) => {
      if (!newValue) showResultSearch.value = false
    })
  const search = useDebounceFn(async () => {
    loading.value = true

    if (searchInputValue.value.length < 3) {
      loading.value = false
      return
    }

    await loadProductTemplateList(
      {
        search: searchInputValue.value,
        pageSize: 12,
      },
      true
    )

    showResultSearch.value = true
    searchModalOpen.value = true

    loading.value = false
  }, 1000)

  const searchHits = computed(() => productTemplateList.value || [])

  const enterPress = () => {
    if (!searchInputValue.value) return
    showResultSearch.value = false
    searchModalOpen.value = false
    router.push({ path: '/search', query: { search: searchInputValue.value } })
  }

  const selectHit = (selected: Product) => {
    if (!searchInputValue.value) return
    showResultSearch.value = false
    searchModalOpen.value = false
    router.push(`${mountUrlSlugForProductVariant((selected.firstVariant) as Product)}`)
  }

  const highlightPrevious = () => {
    if (highlightedIndex.value === 0) {
      highlightedIndex.value = productTemplateList.value?.length - 1
    }
    else {
      highlightedIndex.value -= 1
    }
  }

  const highlightNext = () => {
    if (highlightedIndex.value === searchHits.value.length - 1) {
      highlightedIndex.value = 0
    }
    else {
      highlightedIndex.value += 1
    }
  }


  return {
    // search modal
    searchModalClose,
    isSearchModalOpen,
    searchModalOpen,
    searchModalToggle,

    // odoo search
    searchInputValue,
    highlightNext,
    highlightPrevious,
    highlightedIndex,
    search,
    selectHit,
    showResultSearch,
    searchHits,
    totalItems,
    organizedAttributes,
    productTemplateList,
    enterPress,
    loading
  }
}