<script lang="ts" setup>
import { SfIconChevronRight } from '@storefront-ui/vue';
const props = defineProps<{
  items: any[]
  level: number
  refine: Function
  createURL: Function
}>()

const { items } = toRefs(props)

</script>
<template>
  <ul
    v-if="items.length > 0"
    :class="[
      level > 0 ? `list lvl${level}`: 'list',
    ]"
  >
    <li
      v-for="item in items"
      :key="item.value"
      :class="[
        'overflow-hidden block',
        'item',
        item.isRefined ? 'selected' : '',
        item.data && item.data.length > 0 ? 'parent' : '',
      ]"
    >
        <a
          :href="createURL(item.value)"
          class="flex items-center justify-between w-full py-2 px-2 text-sm overflow-hidden"
          :class="[
            'link', 
            item.isRefined ? 'selected' : '',
          ]"
          @click.exact.left.prevent="refine(item.value)"
        >
          <SfIconChevronRight
            size="sm"
            :class="[item.isRefined ? 'rotate-90 text-primary-700' : '-rotate-90 text-neutral-300', 'transition-transform shrink-0 mr-1']"
          />
          <span 
            :class="[
              item.isRefined ? 'font-bold' : ''
            ]"
            class="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {{ item.label }}
          </span> 
          <span v-if="item.count" 
            class="shrink-0 ml-1 text-[0.8em] text-right"
          >
              ({{ item.count.toLocaleString() }})
          </span>
        </a>
      <SearchHierarchicalMenuList
        v-if="item.data"
        :items="item.data"
        :level="level + 1"
        :refine="refine"
        :createURL="createURL"
        :class="`pl-3`"
      />
    </li>
  </ul>
</template>