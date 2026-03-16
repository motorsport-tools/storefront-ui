<script setup lang="ts">
interface ClerkProduct {
    id: number
    name: string
    image: string
    price: number
    sku: string
    slug: string
}

interface ClerkCategory {
    id: number
    display_name: string
    url: string
}

const props = defineProps<{
    query: string
    results?: {
        suggestions?: string[]
        results: {
            pages?: {
                result: any[]
                estimated_total_count: number
            }
            products?: {
                result: ClerkProduct[]
                estimated_total_count: number
            }
            categories?: {
                result: ClerkCategory[]
                estimated_total_count: number
            }
        }
    }
}>()

const clickProduct = (e: Event, p: number,  n: number) => {  
  if (import.meta.client && typeof window !== 'undefined' && window.Clerk) {
      window.Clerk('call', 'log/click', {
        visitor: useCookie('clerk_visitor').value || 'auto',
        api: 'search/omni',
        n: n,
        labels: ['Search bar'],
        product: p
      })
  }
  return true
}
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
            v-for="p, i in results.results.products?.result"
            :key="p.id"
            class="flex gap-2"
          >
            <NuxtLink :to="p.slug"
                :data-clerk-product-id="p.id"
                @click="clickProduct($event, p.id, i)"
                class="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 w-full border-b border-neutral-200"
            >
                <img :src="p.image" :alt="p.name" class="w-12 h-12 object-cover rounded" />
                <div class="text-sm">
                  <h4 class="font-semibold">{{ p.name }}</h4>
                  <p class="text-gray-600 text-xs">{{ p.sku }}</p>
                </div>
                <p class="text-gray-600 text-base font-bold">{{ $currency(p.price) }}</p>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

</template>