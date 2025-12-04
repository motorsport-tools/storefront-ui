<script setup lang="ts">
import { SfLoaderCircular } from '@storefront-ui/vue'

definePageMeta({
  layout: "default",
})

const route = useRoute()
const router = useRouter()

const { validatePaymentLink, loading, error } = usePaymentLink()

const accessToken = route.query.access_token as string
const saleOrderId = parseInt(route.query.sale_order_id as string)
const amount = parseFloat(route.query.amount as string)

const isValidated = ref(false)
const validationError = ref<string | null>(null)
const orderData = ref<any>(null)
const processing = ref(false)

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

async function processPayment() {
  processing.value = true

  try {
    // Call your payment processing with the validated data
    // Include accessToken for backend verification
    const result = await yourPaymentFunction({
      saleOrderId,
      amount,
      accessToken,
      // ... other payment data
    })

    if (result.success) {
      // Handle success (redirect to success page, etc)
    }
  } catch (err: any) {
    validationError.value = err.message
  } finally {
    processing.value = false
  }
}

onMounted(() => {
  validate()
})

</script>
<template>
  <main 
    class="narrow-container"
  >
  {{ saleOrderId }}<br/>
  {{ amount }}<br/>
  {{ accessToken }}<br/>
  <div v-if="loading">
    <SfLoaderCircular
      size="xl"
      class="my-32"
    />
    <p>One moment please.<br/>Validating payment link</p>
  </div>
  <div v-else-if="validationError" class="error-state">
      <h2>Payment Link Error</h2>
      <p>{{ validationError }}</p>
      <button @click="router.push('/')">Return to Home</button>
  </div>
  <div v-else-if="isValidated && orderData" class="payment-form">
    <h1>Complete Your Payment</h1>
      
    <div class="order-summary">
      <h2>Order Summary</h2>
      <p><strong>Order:</strong> {{ orderData.saleOrder.name }}</p>
      <p><strong>Customer:</strong> {{ orderData.saleOrder.partnerName }}</p>
      <p><strong>Amount:</strong> {{ $currency(orderData.saleOrder.amountTotal) }}</p>
    </div>

    <div class="providers">
      <h2>Select Payment Method</h2>
      
    </div>
  </div>
</main>
</template>