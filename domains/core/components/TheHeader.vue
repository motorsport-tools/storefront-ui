<script lang="ts" setup>
import { useMegaMenuCategories } from '../composable/useMegaMenuCategories'

const { loadCategoriesForMegaMenu, categoriesForMegaMenu } = useMegaMenuCategories()

provide(
  "categoriesForMegaMenu",
  categoriesForMegaMenu
);

await loadCategoriesForMegaMenu({ filter: { parent: true }, pageSize: 4 })
</script>

<template>
  <HeaderDesktop v-if="$viewport.isGreaterOrEquals('lg')" />
  <HeaderMobile v-else />
</template>
