<script setup lang="ts">
type SearchHitEmit = (event: "select", parameter: any) => void;
type SearchClerkProps = {
  hits?: any[];
  searchText: string;
};

const props = defineProps<SearchClerkProps>();
defineEmits<SearchHitEmit>();

const makeSearchBold = (text: string) => {
  return text
    .toLocaleLowerCase()
    .replace(
      props.searchText,
      `<b class='font-extrabold text-[16px] capitalize'>${props.searchText}</b>`
    );
};
</script>
<template>
  <ul v-if="hits?.length > 0"
    tabindex="-1"
    role="listbox"
    class="absolute top-12 bg-white shadow-md rounded-md w-full overflow-hidden z-10"
  >
    <li
      v-for="(product, index) in hits"
      :key="product.id"
      class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      role="option"
      @click="$emit('select', product)"
    >
      <span
        class="text-black text-sm font-medium capitalize"
        v-html="makeSearchBold(product.name)"
      >
      </span>
    </li>
  </ul>
  <LazySearchNoResult v-else :search-text="searchText" />
</template>
