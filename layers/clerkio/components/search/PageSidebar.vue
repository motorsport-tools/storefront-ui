<script setup lang="ts">
</script>
<template>
    <aside>
    <SearchSidebarHeading>
        {{ $t('categories.heading') }}
    </SearchSidebarHeading>
    <SearchHierarchicalFilter
        :attributes="['_category_lvl0','_category_lvl1','_category_lvl2','_category_lvl3','_category_lvl4', '_category_lvl5', '_category_lvl6']" 
        initial-sort-by="count" 
        separator="  >  "
        :limit="12"
        class="mb-5" 
        label="Category"
        :showParentLevel="true"
    />
    <SearchSidebarHeading>
        {{ $t('filters.heading') }}
        <template #affix>
            <SearchSidebarClearFiltersButton/>
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