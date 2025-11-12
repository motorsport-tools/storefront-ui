<script setup lang="ts">
import { SfButton, SfLoaderCircular } from '@storefront-ui/vue';
import { useRoute } from 'vue-router'

const { loadCart } = useCart()
const { getPaymentConfirmation } = usePayment();

const route = useRoute()
const token = route.query?.token || '' as string || ''

const orderData = ref<any>(null)
const error = ref<Error | null>(null)
const loading = ref(true)

onMounted(async () => {
  if (!token) {
    router.replace('/')
    return
  }

  try {
    orderData.value = await getPaymentConfirmation(token)
  } catch (err) {
    error.value = err as Error
  } finally {
    loading.value = false
  }
  await loadCart()
})
</script>

<template>
    <div

      class="w-full min-h-[330px] flex flex-col gap-4 items-center justify-center"
    >
      <template v-if="loading">
        <SfLoaderCircular
          size="xl"
          class="my-32"
        />
        <p>Awaiting confirmation</p>
      </template>

      <template v-else-if="error">
        <Icon
          name="i-material-symbols-check-circle"
          class="size-20 text-green-700"
        />
        <h1 class="text-3xl font-bold">
          {{ $t('thankYou.normal') }}
        </h1>
        <p>{{ $t('thankYou.text1') }}</p>
        <p>{{ $t('thankYou.text2') }}</p>
        <SfButton @click="navigateTo('/')" size="lg" variant="secondary">
          {{ $t('continueShopping') }}
        </SfButton>
      </template>

      <template v-else>
        <Icon
          name="i-material-symbols-check-circle"
          class="size-20 text-green-700"
        />
        <h1 class="text-3xl font-bold">{{ $t('thankYou.thankYou',{ orderNumber: orderData.order?.name}) }}</h1>
        <p>{{ $t('thankYou.text1') }}</p>
        <p>{{ $t('thankYou.text2') }}</p>
        <SfButton @click="navigateTo('/')" size="lg" variant="secondary">
          {{ $t('continueShopping') }}
        </SfButton>
      </template>
    </div>
</template>

<style scoped></style>
