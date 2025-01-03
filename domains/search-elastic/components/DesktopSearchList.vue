<script setup lang="ts">
type SearchHitEmit = (event: "select", parameter: ElasticHitType) => void;
type SearchClerkProps = {
  hits?: ElasticHitType[];
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

const displaySku = (text: string) => {
  return text
}

</script>
<template>
  <ul
    tabindex="-1"
    role="listbox"
    class="absolute top-12 bg-white shadow-md rounded-md w-full overflow-hidden"
  >
    <li
      v-for="(hit, index) in hits"
      :key="hit.id"
      class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      role="option"
      @click="$emit('select', hit)"
    >
      <div 
        class="flex"
      >
        <div
          class="flex flex-col w-14 h-14 pr-4 justify-center items-center"
        >
          <NuxtImg
            :src="$getImage(
              String(hit.image_ids[0].image_url),
              54,
              54,
              String(hit.image_ids[0].name)
            )"
            height="54"
            width="54"
            class="self-center"
            :placeholder="[54, 54]"
          />
        </div>
        <div class="flex flex-col pr-4">
        <span
          class="text-black text-sm font-medium capitalize"
          v-html="makeSearchBold(hit.name)"
        >
        </span>
        <span
          class="text-black text-sm font-normal"
          v-html="displaySku(hit.default_code)"
        ></span>
        </div>
        <span
          class="text-black text-lg font-medium capitalize self-center"
          v-html="`${hit.lst_price}`"
        ></span>
      </div>
    </li>
  </ul>
</template>
