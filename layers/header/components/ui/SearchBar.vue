<script lang="ts" setup>
import {
    SfButton,
    SfLoaderCircular,
    SfInput,
    useDisclosure,
    useTrapFocus,
} from '@storefront-ui/vue'
import SearchList from '~/layers/clerkio/components/SearchList.vue'

const emit = defineEmits(['update-overlay'])
const formSearchTemplateRef = ref(null)
/*
const {
  searchInputValue,
  highlightedIndex,
  search,
  searchHits,
  selectHit,
  enterPress,
  showResultSearch,
} = useSearch(formSearchTemplateRef)
*/

const { 
    searchInputValue,
    results,
    loading,
    showInstantSearch,
    enterPress,
    search,
} = useClerkSearch(formSearchTemplateRef)

onClickOutside(formSearchTemplateRef, () => {
  //showResultSearch.value = false
  searchInputValue.value = ''
  showInstantSearch.value = false
})

const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    //showResultSearch.value = false
    searchInputValue.value = ''
    showInstantSearch.value = false
  }
}

watch(showInstantSearch, (val) => {
    emit('update-overlay', val)
})
</script>

<template>
    <form
        ref="formSearchTemplateRef"
        role="search"
        class="hidden md:flex flex-[100%] box-border mx-6 relative w-full max-w-lg z-[10]"
        @submit.prevent
    >
        <UiFormCustomSfInput
            id="header-search"
            v-model="searchInputValue"
            type="text"
            class="[&::-webkit-search-cancel-button]:appearance-none"
            :placeholder="$t('searchPlaceholder')"
            wrapper-class="flex-grow pr-0"
            size="sm"
            @input="search()"
            @keydown.enter.prevent="enterPress"
            @keydown="handleKeydown"
        >
            <template #suffix>
                <span class="flex items-center">
                    <SfButton
                        variant="tertiary"
                        square
                        aria-label="search"
                        :disabled="loading"
                        type="submit"
                        class="rounded-l-none hover:bg-transparent active:bg-transparent"
                        @click="enterPress"
                    >
                        <Icon
                            class="text-black"
                            name="weui:search-filled"
                            size="26px"
                            
                        />
                    </SfButton>
                </span>
            </template>
        </UiFormCustomSfInput>
        <!--
        <transition
            enter-active-class="transform transition duration-500 ease-in-out"
            leave-active-class="transform transition duration-500 ease-in-out"
            enter-from-class="-translate-x-full md:translate-x-0 md:opacity-0"
            enter-to-class="translate-x-0 md:translate-x-0 md:opacity-100"
            leave-from-class="translate-x-0 md:opacity-100"
            leave-to-class="-translate-x-full md:translate-x-0 md:opacity-0"
        >
        -->
            <SearchList 
                v-if="showInstantSearch"
                :query="searchInputValue"
                :results="results"
            />
            <!--            
            <DesktopSearchList
                v-if="showResultSearch"
                :hits="searchHits"
                :search-text="searchInputValue"
                @select="selectHit"
            />
            -->
        <!--
        </transition>
        -->
    
    </form>
</template>