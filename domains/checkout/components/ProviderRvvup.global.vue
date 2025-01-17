<template>
    <div>
      <div id="dropin-container" ref="dropinDivElement" class="mt-4" />
    </div>
  </template>
  
  <script lang="ts" setup>
  import type { PaymentMethod } from '~/graphql';
  
  interface RvvupDropinType {
    handleAction: (action: any) => void;
    unmount: () => void;
    mount: (selector: string) => void;
    submit: () => void;
  }
  
  const props = defineProps({
    method: {
      required: true,
      type: Object as PropType<PaymentMethod>,
    },
    cart: {
      required: true,
      type: Object,
    },
  });
  const emit = defineEmits([
    'isPaymentReady',
    'providerPaymentHandler',
    'paymentLoading',
  ]);
  const rvvupDropin = ref<RvvupDropinType | null>(null);
  const router = useRouter();
  const dropinDivElement = ref(null);
  const loading = ref(false);
  const { getPaymentConfirmation } = usePayment();
  
  console.log('Props', props.cart)

  const {
    openRvvupTransaction,
    
    getRvvupPaymentMethods,
    paymentMethods,
 
    rvvupMakeDirectPayment,
    transaction,
    getRvvupPaymentDetails,
  } = useRvvupDirectPayment(props.method.providerId, props.cart?.order?.id, props.cart?.order?.partner?.id,props.cart?.order?.amountTotal, props.method.code);

  onMounted(async () => {
    console.log('Rvvup Provider Mounted')
    useHead({
      script: [
        {
          src: 'https://checkout.dev.rvvuptech.com/sdk/v1.js',
          type: 'text/javascript', // Optional, if required
          async: true,  // It's better to load it asynchronously
        },
      ],
    })
    loading.value = true;

    //await getRvvupAcquirerInfo();
    await getRvvupPaymentMethods();
    
    const fetchCheckoutUrl = () => {
      console.log('Payment Method Response', paymentMethods.value)
      return paymentMethods.value.url
    }
    const rvvup = Rvvup();
    const checkout = await rvvup.createEmbeddedCheckout({
                    fetchCheckoutUrl,
                    options:{hideHeader:!0}
                })
    checkout.mount({
      type: 'inline',
      selector: '#dropin-container'
    })

    checkout.on('payment-started', async (event) => {
      console.log('Payment Started: ', event.detail);
      //Initiate Payment
      await openRvvupTransaction(paymentMethods.value.id);
      console.log('Transaction Started: ', transaction)
    })
    checkout.on('payment-complete', async (event) => {
      console.log('Payment Complete Event:', event.detail);
      //Payment Status
    })

    loading.value = false;
    emit('isPaymentReady', true);



    //const checkout = new RvvupClient(configuration);
    /*
    rvvupDropin.value = checkout
      .create('dropin', {
        openFirstPaymentMethod: true,
        openFirstStoredPaymentMethod: false,
        showStoredPaymentMethods: false,
        showPaymentMethods: true,
        showPayButton: false,
        setStatusAutomatically: true,
        onSelect: (component) => {
          if (component.isValid) {
            emit('isPaymentReady', true);
            return;
          }
          emit('isPaymentReady', false);
        },
      })
      .mount('#dropin-container');
  
    loading.value = false;
  
    emit('providerPaymentHandler', rvvupDropin.value.submit);
  */
  });
  
  onBeforeUnmount(() => {
    rvvupDropin.value?.unmount();
    rvvupDropin.value = null;
  });
  
  </script>
  