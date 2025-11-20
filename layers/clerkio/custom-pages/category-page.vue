<script setup lang="ts">
import { SfButton, SfIconTune, useDisclosure } from '@storefront-ui/vue'
import generateSeo, { type SeoEntity } from '~/utils/buildSEOHelper'
import type { Category } from "~/graphql";

definePageMeta({
  layout: 'category'
})
const emit = defineEmits(['category-loaded']);

const { $i18n } = useNuxtApp()
const { user } = useAuth()
const { open, close, isOpen } = useDisclosure()
const route = useRoute()
const { loadCategory } = useCategory()
const { category, setCategory } = useCategoryData()

const { data, refresh } = await useAsyncData(
  `category-${route.path}`,
  () => loadCategory({ slug: route.path }),
  { watch: [() => route.path] }
)

watch(() => data.value, (val:Category | null) => {
    setCategory(val)
    
},{ immediate: true })

watch(isTabletScreen, (value) => {
  if (value && isOpen.value) {
    close()
  }
})

if(category.value?.id) {
    useHead(generateSeo<SeoEntity>(category.value, 'Category'))
}

const searchTitle = computed( () => {
    return $i18n.t('category')+` `+`: ${category.value?.name || ''}`
})


const sortingOptions = [
    { value: "categories/sort/price:asc", label: "Price: Low to High" },
    { value: "categories/sort/price:desc", label: "Price: High to Low" },
    { value: "categories/sort/name:asc", label: "Name: A to Z" },
     { value: "categories/sort/name:desc", label: "Name: Z to A" },
    { value: "categories/sort/rating:desc", label: "Rating: High to Low" },
    { value: "categories", label: "Most Popular" },
    { value: "categories/sort/created_at:desc", label: "Newest" },
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
            :breadcrumbs="category?.breadcrumb"
            class="self-start mt-5 mb-5"
        />
        <h1
            class="font-bold typography-headline-3 md:typography-headline-2 mb-10"
        >
            {{ searchTitle }}
        </h1>
        <div class="grid grid-cols-12 lg:gap-x-6">
            
            <CategoryPageSidebar
                class="hidden lg:block col-span-12 lg:col-span-4 xl:col-span-3"
                :category="category"
            />

            <LazyCategoryMobileSidebar :is-open="isOpen" @close="close">
                <template #default>
                    <CategoryPageSidebar
                        class="px-3"
                        :category="category"
                    />
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