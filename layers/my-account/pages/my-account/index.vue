<script setup lang="ts">
import { SfLoaderCircular } from '@storefront-ui/vue'
import { useOrders } from "~/layers/orders/composable/useOrders";
import type { Order, QueryOrdersArgs, Product } from '~~/graphql'
import { SortEnum } from '~~/graphql'
import { formatDate } from '~~/utils/date'
import { formatNumber } from '~~/utils/number'

definePageMeta({
  layout: 'account',
  middleware: ['auth-check'],
})

const { user, loadUser } = useAuth()
const { getOrders, orders, loading } = useOrders()
const NuxtLink = resolveComponent('NuxtLink')
const { getRecommendationsData, data: recommendedProducts, loading: recommendLoading } = useProductRecommendations()

const firstName = computed(() =>
  String((user.value as any)?.name ?? '').trim().split(' ')[0] || '',
)
const email = computed(() => String((user.value as any)?.email ?? ''))

// Most recent order (highest id) — the orders query order isn't guaranteed.
const latestOrder = computed<Order | null>(() => {
  const list = orders.value?.orders ?? []
  if (!list.length) return null
  return [...list].sort((a, b) => Number(b?.id) - Number(a?.id))[0] ?? null
})
const lines = computed<any[]>(() => latestOrder.value?.orderLines.filter(l => !l?.isDelivery) ?? []) 
const itemCount = computed(() =>
  lines.value.reduce((n, l) => n + (Number(l?.quantity) || 0), 0),
)

const loaded = ref(false)

onMounted(async () => {
  await loadUser(true)
  const params: QueryOrdersArgs = {
    currentPage: 1,
    pageSize: 1,
    sort: { dateOrder: SortEnum.Desc },
  }

  getOrders(params).finally(() => {
    loaded.value = true
  })

  getRecommendationsData(user.value?.email)

})

const clickProduct = (e: Event, p: number,  n: number) => {  
  if (typeof window !== 'undefined' && window.Clerk) {
    window.Clerk('call', 'log/click', {
      visitor: useCookie('clerk_visitor').value || 'auto',
      api: 'recommendations/visitor/complementary',
      n: n,
      labels: ['Customer Recommendations'],
      product: p
    })
  }
}
</script>

<template>
  <div class="w-full col-span-3">
    <p class="font-light">
      Welcome back<template v-if="firstName">, {{ firstName }}</template>.
    </p>
    <p v-if="email" class="mt-1 text-[13px]">
      Signed in as <span class="text-primary-700">{{ email }}</span>
    </p>
  </div>
  <div class="w-full col-span-2">
    <!-- Latest order -->
    <div class="mt-8">
      <div class="flex items-baseline justify-between mb-3">
        <h2 class="uppercase font-medium">
          Latest order
        </h2>
        <NuxtLink
          to="/my-account/my-orders"
          class="text-[13px] underline underline-offset-4 decoration-primary-700 hover:decoration-black transition-colors"
        >
          View all orders
        </NuxtLink>
      </div>
    </div>
  </div>

  <div class="w-full col-span-3 md:col-span-2">
    <div v-if="!loaded" class="flex justify-center py-10">
      <SfLoaderCircular size="lg" />
    </div>

    <NuxtLink
      v-else-if="latestOrder"
      :to="`/my-account/my-orders/${latestOrder.id}`"
      class="group block border border-grey-100 rounded-[3px] p-5 transition-colors hover:border-black"
    >
      <span class="block text-[15px] font-medium text-primary-700">{{ latestOrder.name }}</span>
      <div class="text-sm">
        <span class="font-medium">Delivery Status:</span> <span class="text-xs">{{ latestOrder.deliveryOrders.length > 0 ? latestOrder.deliveryOrders[0].state : 'Nothing' }}</span><br/>
        <p v-if="latestOrder.deliveryOrders[0]?.dateDone" class="text-xs text-neutral-500">
            {{ latestOrder.deliveryOrders[0]?.isClickAndCollectOrder ? $t('deliveries.section.collectedOn') : $t('deliveries.section.doneDate') }}: {{ formatDate(latestOrder.deliveryOrders[0]?.dateDone) }}
        </p>
      </div>
      <div class="flex items-center justify-between gap-3 mt-4">
        <span class="text-[13px]  font-light">
          {{ formatDate(latestOrder.dateOrder) }}
          <span class="text-primary-300">·</span> {{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }}
          <span class="text-primary-300">·</span> <span class="text-primary-700 font-medium">{{ $currency(latestOrder.amountTotal || 0) }}</span>
        </span>
        <span class="inline-flex items-center gap-1.5 text-[13px] group-hover:text-black transition-colors whitespace-nowrap">
          View order
          <svg width="16" height="12" viewBox="0 0 18 14" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M1 7h15M11 1l5 6-5 6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </div>
    </NuxtLink>

    <div v-else class="border border-primary-100 rounded-[3px] p-6 text-center">
      <p class=" font-light mb-4">
        You haven't placed any orders yet.
      </p>
      <NuxtLink
        to="/search"
        class="inline-flex items-center gap-2 text-[13px] tracking-[0.1em] uppercase font-medium border-b border-black pb-1 hover:text-primary-600 transition-colors"
      >
        Start shopping
      </NuxtLink>
    </div>
  </div>
  <div class="w-full col-span-3 md:col-span-1 order-2 md:order-4">
    <div
        class="relative overflow-hidden rounded-md bg-[linear-gradient(135deg,#222222_0%,#2b2020_35%,#7b1719_68%,#CD1619_100%)] px-6 py-5"
    >
        <!-- 4 × 4 racing flag -->
        <div
            class="pointer-events-none absolute -left-8 -top-10 h-48 w-48 rotate-[-18deg] opacity-30"
            style="
                background-image:
                    linear-gradient(45deg, #CD1619 25%, transparent 25%),
                    linear-gradient(-45deg, #CD1619 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #CD1619 75%),
                    linear-gradient(-45deg, transparent 75%, #CD1619 75%);
                background-size: 48px 48px;
                background-position: 0 0, 0 24px, 24px -24px, -24px 0;
            "
        ></div>

        <!-- Fade the flag into the background -->
        <div
            class="pointer-events-none absolute inset-0"
            style="
                background:
                    linear-gradient(
                        135deg,
                        transparent 0%,
                        transparent 18%,
                        rgba(34,34,34,.35) 30%,
                        rgba(34,34,34,.85) 40%,
                        transparent 70%
                    );
            "
        ></div>
        <!-- Content -->
        <div class="relative z-10 flex items-center justify-between">
            <div>
                <div class="text-sm font-semibold uppercase tracking-wide text-white">
                    Loyalty Points
                </div>

                <div class="mt-1 text-4xl font-bold leading-none text-white">
                    {{ formatNumber(user.loyaltyPoints) }}
                </div>
                <p class="text-xs mt-2 text-white">* Coming Soon</p>
            </div>
        </div>
    </div>
    <p class="text-[10px] mt-2">* We are in the process of restarting our Loyalty and Rewards Program, and will be crediting all qualifying customer accounts with points for previous purchases and migrating all existing loyalty accounts in the coming weeks. More details to follow shortly.</p>
  </div>
  <div class="w-full col-span-3 order-5">
    <div v-if="recommendLoading" class="flex justify-center py-10">
      <SfLoaderCircular size="lg" />
    </div>
    <div v-else-if="recommendedProducts.length > 0">
      <h2 class="uppercase font-medium">We think you might like</h2>
      <section 
          class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-8"
      >
          <LazyUiProductCard
              v-for="product, i in recommendedProducts"
              @click="clickProduct($event, product.id, i)"
              :data-clerk-product-id="product.id"
              :key="product?.id"
              :pid="Pid"
              :isSearch="true"
              :slug=" mountUrlSlugForProductVariant(product.firstVariant as Product || product as Product) || '' "
              :name="product?.name || ''"
              :sku="product?.sku || ''"
              :brand="product?.brand"
              :regular-price="product.on_sale ? product.list_price : 0"
              :special-price="product.price"
              :rating-count="product.ratingCount || 0"
              :rating="product.rating || 0"
              :first-variant="product as unknown as CustomProductWithStockFromRedis"
              :image-alt="product?.name || ''"
              :image-url="product.image_slug"
              :ribbon-id="product.ribbon_id"
              :ribbon-html="product.ribbon_html"
              :ribbon-bg-color="product.ribbon_bg_color"
              :ribbon-text-color="product.ribbon_text_color"
          />
      </section>
    </div>
    <div v-else>

    </div>
  </div>
</template>