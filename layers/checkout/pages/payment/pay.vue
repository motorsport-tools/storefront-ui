<script setup lang="ts">
import { SfButton, SfLoaderCircular } from '@storefront-ui/vue'

definePageMeta({
  layout: "default",
})

const route = useRoute()
const router = useRouter()

const { validatePaymentLink, loading: paymentLinkLoading, error } = usePaymentLink()

const accessToken = route.query.access_token as string
const saleOrderId = parseInt(route.query.sale_order_id as string)
const amount = parseFloat(route.query.amount as string)

const isValidated = ref(false)
const validationError = ref<string | null>(null)
const orderData = ref<any>(null)
const processing = ref(false)
const isPaymentWithCardReady = ref(false)
const providerPaymentHandler = ref()
const loading = ref(false);

const readyToPay = computed(() => {
  if(isPaymentWithCardReady.value && isValidated.value && !processing.value) return true
  return false
})

//Payment stuff

async function validate() {
  // Basic parameter validation
  if (!accessToken || !saleOrderId || !amount) {
    validationError.value = 'Invalid payment link parameters'
    return
  }

  // Validate with backend
  const result = await validatePaymentLink(saleOrderId, amount, accessToken)

  if (!result.success) {
    if (result.requiresLogin) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(route.fullPath)
      await router.push(`/login?redirect=${returnUrl}`)
      return
    }
    
    validationError.value = error.value || 'Payment link validation failed'
    return
  }

  // Success - show payment form
  isValidated.value = true
  orderData.value = result.data
}

onMounted(async () => {
  await validate()
})

</script>
<template>
  <main 
    class="narrow-container"
  >
  <ClientOnly>
    <div v-if="loading" class="flex flex-col items-center justify-center">
      <UiMSTLoader 
        :size="60"
        class="mt-[160px] mb-[10px]"
      />
      <p>One moment please.<br/>Validating payment link</p>
    </div>
    <div v-else-if="validationError" class="error-state">
        <h2>Payment Link Error</h2>
        <p>{{ validationError }}</p>
        <button @click="router.push('/')">Return to Home</button>
    </div>
    <div v-else-if="isValidated && orderData" class="payment-form max-w-2xl mx-auto py-6">
      <h1 class="text-2xl font-semibold text-gray-900 mb-6">Complete Your Payment</h1>
        
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 w-full mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
        
        <div class="flex items-start gap-6">
          <!-- Left side - Amount -->
          <div class="flex-1">
            <div class="text-sm font-medium text-gray-500 mb-2">Amount</div>
            <div class="text-2xl font-bold text-gray-900">
              {{ $currency(orderData.saleOrder.amountTotal) }}
            </div>
          </div>
          
          <!-- Vertical divider -->
          <div class="h-16 w-px bg-gray-300"></div>
          
          <!-- Right side - Reference -->
          <div class="flex-1">
            <div class="text-sm font-medium text-gray-500 mb-2">Reference</div>
            <div class="text-lg font-semibold text-gray-900">
              {{ orderData.saleOrder.name }}
            </div>
          </div>
        </div>
        
        <!-- Customer info below -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="text-sm text-gray-600">
            <span class="font-medium">Customer:</span> {{ orderData.saleOrder.partnerName }}
          </div>
        </div>
      </div>

      <div class="providers">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Select Payment Method</h2>
        <PaymentStripe 
          :order-data="orderData"
          @is-payment-ready="($event: any) => (isPaymentWithCardReady = $event)"
          @provider-payment-handler="
            ($event: any) => (providerPaymentHandler = $event)
          "
          @payment-loading="($event: any) => (loading = $event)"
        />
        <div class="flex flex-row items-end">
          <SfButton
            size="lg"
            class="w-full mb-4 md:mb-0"
            :disabled="!readyToPay || loading"
            @click="providerPaymentHandler"
          >
            <span v-if="loading">
              <SfLoaderCircular
                class="ml-2 text-white"
                size="sm"
              />
            </span>
            <span v-else>
              {{ $t("placeOrder") }}
            </span>
          </SfButton>
        </div>
      </div>
    </div>
  </ClientOnly>
</main>
</template>