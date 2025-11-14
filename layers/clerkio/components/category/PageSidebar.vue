<script setup lang="ts">
import { SfIconChevronLeft } from "@storefront-ui/vue";
import type { Category} from "~/graphql";
const props = defineProps<{
    category: Category;
}>();
</script>
<template>
    <aside>
        <SearchSidebarHeading>
            {{ $t('categories.heading') }}
        </SearchSidebarHeading>
        <div 
            class="flex flex-col flex-wrap gap-2 mb-4"
        >
            <NuxtLink
                v-if="category?.parent"
                :to="category.parent.slug"
                class="px-2 flex items-center"
                :title="$t('categories.parentLinkTitle', {category: category.parent.name})"
            >   
                <SfIconChevronLeft
                    size="sm"
                />
                <span>{{ category.parent.name }}</span>
            </NuxtLink>

            <ul 
                v-if="category?.childs && category?.childs?.length > 0"
                :class="[{ 'pl-6': category.parent }]"
            >
                <li 
                    v-for="item in category.childs"
                    :key="item.id"
                    class="mx-1 my-1 py-1 px-2 text-sm"
                >
                    <NuxtLink
                        :to="item.slug"
                    >
                        {{ item.name }}
                    </NuxtLink>
                </li>
            </ul>
        </div>
        <SearchSidebarHeading>
            {{ $t('filters.heading') }}
            <template #affix>
                <!--<SearchSidebarClearFiltersButton/>-->
            </template>
        </SearchSidebarHeading>
        <SearchFacetFilter 
            attribute="brand" 
            :label="$t('filters.brand')" 
            initial-sort-by="name"
            class="mb-5"
            :searchable="true"
            :showMore="true"
            :showMoreLimit="200"
        />
        <SearchFacetFilter 
            attribute="fits" 
            :label="$t('filters.fits')" 
            initial-sort-by="name"
            class="mb-5"
            :searchable="false"
        />
        <SearchToggleFilter
            :label="$t('filters.has_stock')"
            attribute="has_stock" 
            class="mb-5"
        />
        <SearchToggleFilter
            :label="$t('filters.on_sale')"
            attribute="on_sale" 
            class="mb-5"
        />
        <SearchRangeFilter
            attribute="price"
            :label="$t('filters.price')"
            class="mb-5" 
        />
        <slot></slot>
    </aside>
</template>