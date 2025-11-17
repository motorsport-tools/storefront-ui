<script setup lang="ts">
import { SfButton, SfIconTune, useDisclosure } from '@storefront-ui/vue'
const { $i18n } = useNuxtApp()
const route = useRoute()
const { user } = useAuth()
const { open, close, isOpen } = useDisclosure()
const query = computed(() => route.query.q ? route.query.q : null)

const searchTitle = computed( () => {
    let title = null
    if(route.query.q) {
        title = '"'+route.query.q+'"'
    } else {
        title = $i18n.t('All Products')+' '
    }
    if(route.query) {
        title += $i18n.t('filters.brand')+': '

        const brands = Object.keys(route.query)
        .filter(key => key.startsWith('brands['))
        .map(key => route.query[key]);
        
        title += brands.join(', ')
    }
    return title
})

const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Search", link: "/search" },
    { name: `Results ${searchTitle.value}`}
]

watch(isTabletScreen, (value) => {
  if (value && isOpen.value) {
    close()
  }
})

definePageMeta({
    layout: 'search'
})

const sortingOptions = [
    { value: "products/sort/price:asc", label: "Price: Low to High" },
    { value: "products/sort/price:desc", label: "Price: High to Low" },
    { value: "products/sort/name:asc", label: "Name: A to Z" },
     { value: "products/sort/name:desc", label: "Name: Z to A" },
    { value: "products/sort/rating:desc", label: "Rating: High to Low" },
    { value: "products", label: "Most Popular" },
    { value: "products/sort/created_at:desc", label: "Newest" },
];

const limitOptions = [
    { value: 80, label: "80", default: true },
    { value: 60, label: "60" },
    { value: 40, label: "40" },
    { value: 20, label: "20" },
    { value: 16, label: "16" },
    { value: 12, label: "12" },
    { value: 8, label: "8" },
    { value: 4, label: "4" },
]
</script>
<template>
    <main 
        class="w-full narrow-container bg-white mb-20"
        data-testid="search-layout"
    >
        <UiBreadcrumb
            :breadcrumbs="breadcrumbs"
            class="self-start mt-5 mb-5"
        />
        <h1
            class="font-bold typography-headline-3 md:typography-headline-2 mb-10"
        >
            {{ $t('searchPage.showResults') }} {{ searchTitle }}
        </h1>
        <div class="grid grid-cols-12 lg:gap-x-6">
            <SearchPageSidebar
                class="hidden lg:block col-span-12 lg:col-span-4 xl:col-span-3"
            />

            <LazyCategoryMobileSidebar :is-open="isOpen" @close="close">
                <template #default>
                    <SearchPageSidebar class="px-3"/>
                </template>
            </LazyCategoryMobileSidebar>
            <div class="col-span-12 lg:col-span-8 xl:col-span-9">
                <div class="flex justify-start items-center mb-6">
                    <SearchSortBy 
                        :options="sortingOptions"
                        class="mr-4"
                    />
                    <SearchLimitPerPage 
                        :options="limitOptions"
                        class="mr-2 flex flex-row items-center"
                    />
                </div>
                <div class="flex justify-between items-center mb-6">
                    <SearchStats class="mb-0"/>
                    <SfButton
                        variant="tertiary"
                        class="lg:hidden whitespace-nowrap"
                        @click="open"
                    >
                        <template #prefix>
                            <SfIconTune />
                        </template>
                        {{ $t('filters.heading') }}
                    </SfButton>
                </div>
                <SearchLoadingProvider v-slot="{ isSearchStalled }">
                    <SearchProductsLoading
                        v-show="isSearchStalled"
                    />
                    <SearchResults
                        v-show="!isSearchStalled"
                        :pid="user?.publicPricelist?.id || 4"
                    />
                    
                </SearchLoadingProvider>
            </div>
        </div>
        <UiIconCheck/>
    </main>
</template>