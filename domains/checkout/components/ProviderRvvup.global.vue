<template>
    <div>
      <div id="dropin-container" ref="dropinDivElement" class="mt-4" />
    </div>
  </template>
  
  <script lang="ts" setup>
  console.log('ProviderRvvupGlobal loaded...')

  import type { PaymentProvider } from '~/graphql';
  
  interface RvvupDropinType {
    handleAction: (action: any) => void;
    unmount: () => void;
    mount: (selector: string) => void;
    submit: () => void;
  }
  
  const props = defineProps({
    provider: {
      required: true,
      type: Object as PropType<PaymentProvider>,
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
  
  const {
    openRvvupTransaction,
    getRvvupAcquirerInfo,
    getRvvupPaymentMethods,
    paymentMethods,
    acquirerInfo,
    rvvupMakeDirectPayment,
    transaction,
    getRvvupPaymentDetails,
  } = useRvvupDirectPayment(props.provider.id, props.cart?.order?.id, props.cart?.order?.partner?.id);
  
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
    emit('isPaymentReady', true);
    loading.value = true;

    await openRvvupTransaction();
    await getRvvupAcquirerInfo();
    await getRvvupPaymentMethods();
    
    console.log('Acquierer Info:', acquirerInfo.value)

    const configuration = acquirerInfo.value?.api_key



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
  