import { onClickOutside, useToggle } from "@vueuse/core";

/**
 * @Responsibilities
 *  1 - FETCH from server-side API (which in turn fetches from ElasticSearch)
 *  2 - Highlight the results
 *  3 - Handle modal state
 */
export const useSearch = (formSearchTemplateRef?: any) => {
  const route = useRoute();
  const router = useRouter();

  // search modal
  const searchModalClose = () => searchModalToggle(false);
  const searchModalOpen = useState("search-ref", () => false);
  const searchModalToggle = useToggle(searchModalOpen);
  const isSearchModalOpen = computed(() => searchModalOpen.value);

  // elastic search
  const loading = useState("elastic-search-loading", () => false);
  const searchInputValue = useState("elastic-search-input", () => "");
  const highlightedIndex = ref(-1);
  const showResultSearch = ref(false);

  const searchResults = ref<any[]>([]);

  const search = async () => {
    loading.value = true;

    if (searchInputValue.value.length < 3) {
      return;
    }

    try {
      // Using fetch to call the server-side API
      const { data, error } = await useFetch('/api/search', {
        params: {
          query: searchInputValue.value,
        },
      });

      if(error && !data?.value) {
        return
      }

      // Handle the search results returned from the server-side API
      searchResults.value = data?.value || [];

      if( searchResults.value.length <= 0 ) {
        showResultSearch.value = false;
        searchModalOpen.value = false;
        return
      }
      
      showResultSearch.value = true;
      searchModalOpen.value = true;
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      loading.value = false;
    }
  };

  // Handle query changes and reset results
  watch(
    () => route.query,
    () => {
      searchInputValue.value = "";
      searchResults.value = [];
    }
  );

  // Computed property for search hits
  const searchHits = computed(() => searchResults.value || []);

  const enterPress = () => {
    if (!searchInputValue.value || searchInputValue.value.length < 3) return;
    showResultSearch.value = false;
    searchModalOpen.value = false;
    router.push(`/search?search=${searchInputValue.value}`);
  };

  const selectHit = (hit: string) => {
    if (!searchInputValue.value) return;
    showResultSearch.value = false;
    searchModalOpen.value = false;
    router.push(String(`/product/${hit.slug}-${hit.id}`));
  };

  const highlightPrevious = () => {
    if (highlightedIndex.value === 0) {
      highlightedIndex.value = searchHits.value.length - 1;
    } else {
      highlightedIndex.value -= 1;
    }
  };

  const highlightNext = () => {
    if (highlightedIndex.value === searchHits.value.length - 1) {
      highlightedIndex.value = 0;
    } else {
      highlightedIndex.value += 1;
    }
  };

  onClickOutside(formSearchTemplateRef, () => {
    showResultSearch.value = false;
  });

  return {
    // search modal
    searchModalClose,
    isSearchModalOpen,
    searchModalOpen,
    searchModalToggle,

    // ElasticSearch search (via server API)
    loading,
    searchInputValue,
    highlightNext,
    highlightPrevious,
    highlightedIndex,
    search,
    selectHit,
    showResultSearch,
    searchHits,
    enterPress,
  };
};