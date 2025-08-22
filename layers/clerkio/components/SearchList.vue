<script setup lang="ts">
defineProps<{
    query: string
    results?: {
        pages?: {
            result: any[]
            estimated_total_count: number
        }
        products?: {
            result: any[]
            estimated_total_count: number
        }
        categories?: {
            result: any[]
            estimated_total_count: number
        }
    }
}>()

</script>

<template>
    <div
      v-if="results"
      class="bg-white shadow-md rounded-md border border-neutral-200 w-full overflow-hidden z-10"
    >
      <div v-if="results.suggestions?.length">
        <h3 class="px-4 pt-2 text-gray-500 text-xs uppercase">Suggestions</h3>
        <ul>
          <li
            v-for="s in results.suggestions"
            :key="s"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer group"
          >
            <NuxtLink :to="`/search?query=${query}`">{{ query }}</NuxtLink>
          </li>
        </ul>
      </div>
      <div v-if="results.results.categories?.estimated_total_count > 0">
        <h3 class="px-4 pt-2 text-s text-black font-bold uppercase">Categories</h3>
        <ul>
          <li
            v-for="p in results.results.categories?.result"
            :key="p.id"
            class="flex gap-2 text-xs group"
          >
            <NuxtLink :to="p.url"
                class="flex gap-4 px-4 py-2 hover:bg-gray-100 w-full"
            >
              {{ p.display_name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div v-if="results.results.products?.estimated_total_count > 0">
        <h3 class="px-4 pt-2 text-s text-black font-bold uppercase">Products</h3>
        <ul>
          <li
            v-for="p in results.results.products?.result"
            :key="p.id"
            class="flex gap-2"
          >
            <NuxtLink :to="p.url"
                class="flex gap-4 px-4 py-2 hover:bg-gray-100 w-full"
            >
                <img :src="p.image" :alt="p.name" class="w-12 h-12 object-cover rounded" />
                <div class="text-sm">
                <h4 class="font-semibold">{{ p.name }}</h4>
                <p class="text-gray-600 text-xs">{{ $currency(p.price) }}</p>
                </div>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

</template>