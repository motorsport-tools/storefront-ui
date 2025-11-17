<template>
    <div>
      <div v-if="loading" class="flex justify-center my-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
      <div ref="expressCheckoutRef" class="mt-4" :class="{ 'opacity-0': loading }"></div>
      <div v-if="error" class="mt-2 text-red-500 text-sm">{{ error }}</div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import type { PaymentMethod } from '~/graphql';
  import { useCountryList } from '~/layers/core/composable/useCountryList';
  
  const props = defineProps({
    method: {
      required: true,
      type: Object as PropType<PaymentMethod>,
    },
    cart: {
      required: true,
      type: Object
    },
    layout: {
      type: Object,
      default: () => ({ maxColumns: 1, maxRows: 5 })
    }
  });
  
  const emit = defineEmits(['processing', 'completed', 'error']);
  
  interface StripeDropinType {
    on: (event: string, callback: (response: any) => void) => void;
    unmount: () => void;
    mount: (selector: string | HTMLElement) => void;
    submit: () => void;
  }
  
  const expressCheckoutRef = ref<HTMLElement | null>(null);
  const loading = ref<boolean>(true);
  const error = ref<string>('');
  const stripeElement = ref<any>(null);
  const stripeRef = ref<any>(null);
  const stripeDropin = ref<StripeDropinType | null>(null);
  const checkoutRates = ref<Array<any>>([]);
  
  const {
    acquirerInfo,
    getStripeAcquirerInfo,
    getStripeInlineFormValues,
    openStripeTransaction,
    transaction
  } = useStripeDirectPayment(
    props.method.providerId, 
    props.cart?.order?.id,  
    props.method?.code
  );
  
  const { updateCartAddress } = useCart();
  const { user } = useAuth()

  const {
    deliveryMethods,
    loadDeliveryMethods,
    setDeliveryMethod,
    loadRates,
    setRate,
    rates
  } = useDeliveryMethod();
  
  const { countries, loadCountries } = useCountryList();
  
  /**
   * Map Stripe address format to Odoo address format
   */
  const mapStripeAddressToOdoo = (stripeAddress: any, countriesList: any[]) => {
    if (!stripeAddress) return null;
    
    const stripeCountry = stripeAddress.country || stripeAddress.address?.country

    const country = countriesList.find(c => 
      c.code === stripeCountry || c.name === stripeCountry
    );
    let state

    const stripeState = stripeAddress.state || stripeAddress.address?.state

    if (country && stripeState) {
        state = country.states.find(s => s.code === stripeState ||
            s.name.toLowerCase() === stripeState?.toLowerCase()
        )
    } else {
        state = null
    }
    
    return {
        name: stripeAddress.name || 'Public user',
        street: stripeAddress.line1 || stripeAddress.address?.line1 || '',
        street2: stripeAddress.line2 || stripeAddress.address?.line2 || '',
        city: stripeAddress.city || stripeAddress.address?.city || '',
        stateId: state?.id || null,
        countryId: country.id || null,
        zip: stripeAddress.postal_code || stripeAddress.address?.postal_code || '',
        phone: stripeAddress.phone || '',
        email: stripeAddress.email || 'public.user@motorsport-tools.com'
    };
  };
  
  /**
   * Synchronize address from Stripe to cart
   */
  const syncAddressToCart = async (type: 'delivery' | 'billing', stripeAddress: any) => {
    try {
      console.log(`Syncing ${type} address from Stripe`, stripeAddress);
      
      if (!stripeAddress || !countries.value?.countries?.length) {
        console.warn('Missing address data or countries list');
        return false;
      }
      
      const odooAddress = mapStripeAddressToOdoo(stripeAddress, countries.value.countries);
      console.log('Mapped Odoo address:', odooAddress);
      
      if (odooAddress) {
        await updateCartAddress(type, odooAddress, false);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error(`Failed to sync ${type} address:`, err);
      error.value = `Failed to update ${type} address`;
      return false;
    }
  };
  
  /**
   * Prepare shipping rates in Stripe format
   */
  const prepareShippingRates = async () => {
    try {
      checkoutRates.value = [];
      
      if (!deliveryMethods.value?.length) {
        console.warn('No delivery methods available');
        return;
      }
      
      console.log('Preparing shipping rates from delivery methods:', 
      deliveryMethods.value.map(m => m.name));
      
      // Handle shipping methods with rates
      const shippingMethods = deliveryMethods.value.filter(
        method => !method.name?.toLowerCase().includes('collect')
      );
      
      for (const method of shippingMethods) {
        try {
          console.log(`Loading rates for: ${method.id} and cart ${props.cart.order.id}`);
          const x = await loadRates({ carrierId: method.id, orderId: props.cart.order.id });
          if(!x) {
            throw Error
          }
          if (rates.value?.length) {
            for (const rate of rates.value) {
              checkoutRates.value.push({
                id: `${method.id}_${rate.serviceId}`,
                displayName: `${rate.courierName || ''}`,
                amount: parseInt(rate.totalCharge * 100), // Convert to cents for Stripe
                deliveryEstimate: rate.minDeliveryTime ? {
                  minimum: { unit: 'day', value: rate.minDeliveryTime  },
                  maximum: { unit: 'day', value: rate.maxDeliveryTime }
                } : undefined
              });
            }
          }
        } catch (e) {
          console.error(`Failed to load rates for ${method.name}:`, e);
        }
      }

      // Handle pickup/collection methods
      const collectionMethods = deliveryMethods.value.filter(
        method => method.name?.toLowerCase().includes('collect')
      );
      
      for (const method of collectionMethods) {
        checkoutRates.value.push({
          id: String(method.id),
          displayName: method.name,
          amount: parseInt(method.price * 100), // Convert to cents for Stripe
          deliveryEstimate: {
            minimum: { unit: 'hour', value: 1 }
          },
        });
      }
      
      console.log('Prepared checkout rates:', checkoutRates.value);
    } catch (err) {
      console.error('Error preparing shipping rates:', err);
      error.value = 'Failed to load shipping options';
    }
  };
  
  /**
   * Handle shipping method selection
   */
  const handleShippingMethodSelection = async (shippingRate: any) => {
    try {
      console.log('Selected shipping rate:', shippingRate);
      
      if (!shippingRate?.id) return false;
      
      // Check if it's a collection method or shipping rate
      if (shippingRate.id.includes('_')) {
        // It's a shipping rate
        const [methodId, serviceId] = shippingRate.id.split('_');
        await setDeliveryMethod(parseInt(methodId));
        await setRate({serviceId});
      } else {
        // It's a collection method
        await setDeliveryMethod(parseInt(shippingRate.id));
      }
      
      return true;
    } catch (err) {
      console.error('Failed to set shipping method:', err);
      error.value = 'Failed to set shipping method';
      return false;
    }
  };
  
  /**
   * Initialize the Stripe Express Checkout element
   */
  const initStripeExpressCheckout = async () => {
    try {
      if (!window.Stripe) {
        throw new Error('Stripe.js not loaded');
      }
      
      loading.value = true;
      error.value = '';
      
      // Load initial data
      await Promise.all([
        loadCountries(),
        getStripeAcquirerInfo(),
        loadDeliveryMethods()
      ]);
      
      await prepareShippingRates();
      
      // Initialize Stripe
      if (!stripeRef.value) {
        stripeRef.value = window.Stripe(acquirerInfo.value?.publishable_key, {});
      }
      
      let inlineFormValues = await getStripeInlineFormValues();
      
      // Create Stripe Elements instance
      const elementsOptions = {
        appearance: { theme: 'stripe' },
        currency: inlineFormValues['currency_name'] || 'gbp',
        captureMethod: inlineFormValues['capture_method'] || 'automatic',
        paymentMethodTypes: [
          inlineFormValues['payment_methods_mapping']?.[props.method.code] || props.method.code
        ],
        mode: 'payment',
        amount: parseInt(inlineFormValues['minor_amount'] || '0')
      };
      
      if (inlineFormValues['is_tokenization_required']) {
        elementsOptions['setupFutureUsage'] = 'off_session';
      }
      
      stripeElement.value = stripeRef.value.elements(elementsOptions);
      
      // Configure Express Checkout options
      const expressCheckoutOptions = {
        emailRequired: true,
        phoneNumberRequired: true,
        billingAddressRequired: true,
        shippingAddressRequired: true,
        paymentMethods: {
          applePay: 'always',
          googlePay: 'always',
          paypal: 'auto',
          link: 'never',
        },
        buttonType: {
          googlePay: 'checkout',
          applePay: 'check-out',
          paypal: 'checkout'
        },
        layout: {
          maxColumns: props.layout?.maxColumns || 1,
          maxRows: props.layout?.maxRows || 5,
        },
      };
      
      // Create and mount the Express Checkout element
      stripeDropin.value = stripeElement.value.create('expressCheckout', expressCheckoutOptions);
      
      // Set up event listeners
      stripeDropin.value?.on('shippingaddresschange', async (event) => {
        console.log('Shipping address changed:', event.address);
        
        // Update cart address in Odoo
        const addressUpdated = await syncAddressToCart('delivery', event.address);
        
        if (addressUpdated) {
            try {
                // Refresh delivery methods after address change
                await loadDeliveryMethods();
                await prepareShippingRates();

                if(checkoutRates.value.length > 0) {
                    await handleShippingMethodSelection(checkoutRates.value[0])
                }

                let inlineFormValues = await getStripeInlineFormValues();
                stripeElement.value.update({amount: parseInt(inlineFormValues['minor_amount'] || '0') })

                // Provide shipping rates to Stripe
                event.resolve({ shippingRates: checkoutRates.value });
            } catch (err) {
                event.reject()
            }
        } else {
          event.reject({ error: { message: 'Failed to update shipping address' } });
        }
      });
      
      stripeDropin.value?.on('shippingratechange', async (event) => {
        console.log('Shipping rate chosen:', event.shippingRate);
        
        const success = await handleShippingMethodSelection(event.shippingRate);
        
        if (success) {
            let inlineFormValues = await getStripeInlineFormValues();
            stripeElement.value.update({amount: parseInt(inlineFormValues['minor_amount'] || '0') })
            event.resolve();
        } else {
          event.reject({ error: { message: 'Failed to set shipping method' } });
        }
      });
      
      stripeDropin.value?.on('click', async (event) => {
        try {
          emit('processing');
          error.value = '';
          event.resolve();
        } catch (err) {
          console.error('Failed to start transaction:', err);
          error.value = 'Failed to start payment process';
          event.reject({ error: { message: 'Failed to start payment process' } });
          emit('error', err);
        }
      });
      
      stripeDropin.value?.on('confirm', async (event) => {
        try {
            console.log('Submit Event: ', event)
            emit('processing');

            //Update order with full billingDetails + shippingAddress
            if(event.billingDetails.phone) {
                event.shippingAddress.phone = event.billingDetails.phone
            }
            if(event.billingDetails.email) {
                event.shippingAddress.email = event.billingDetails.email
            }

            const shippingAddressUpdated = await syncAddressToCart('delivery', event.shippingAddress)
            const billingAddressUpdated = await syncAddressToCart('billing', event.billingDetails)
            if(!shippingAddressUpdated && !billingAddressUpdated) {
                error.value = 'Invalid billing or shipping address'
                event.paymentFailed()
            }

            const success = await handleShippingMethodSelection(event.shippingRate);
            
            if(!success) {
                event.paymentFailed()
            }

            //Open Transaction in Odoo
            await openStripeTransaction(inlineFormValues['is_tokenization_required'], true);

            console.log('Transaction value:', transaction.value)

            //Confirm Stripe Payment
            const confirmOptions = {
                elements: stripeElement.value,
                clientSecret: transaction.value?.client_secret,
                confirmParams: {
                    return_url: transaction.value?.return_url,
                    shipping: {
                        phone: event.billingDetails.address.phone
                    }
                }
            }

            await stripeRef.value.confirmPayment(confirmOptions)
            
        } catch (err) {
          console.error('Payment failed:', err);
          error.value = err.message || 'Payment failed';
          event.paymentFailed({ error: { message: error.value } });
          emit('error', err);
        }
    });
      
    stripeDropin.value?.on('ready', ({ availablePaymentMethods }) => {
        // Check if any payment methods are available (at least one is true)
        const hasAvailableMethods = availablePaymentMethods && 
            Object.values(availablePaymentMethods).some(available => available === true);
        
        if (!hasAvailableMethods) {
            console.warn('No payment methods available');
            error.value = 'No express payment methods available on this device';
        } else {
            // Log which methods are available
            const methods = Object.entries(availablePaymentMethods)
            .filter(([_, available]) => available)
            .map(([method]) => method);
        }
        
        loading.value = false;
    });
      
      stripeDropin.value?.on('error', (event) => {
        console.error('Stripe error:', event.error);
        error.value = event.error?.message || 'An error occurred';
        emit('error', event.error);
      });
      
      // Mount the Express Checkout element
      if (expressCheckoutRef.value) {
        stripeDropin.value?.mount(expressCheckoutRef.value);
      }
    } catch (err) {
      console.error('Failed to initialize Stripe Express Checkout:', err);
      error.value = 'Failed to initialize payment options';
      loading.value = false;
      emit('error', err);
    }
  };
  
  // Initialize component
  onMounted( async () => {
    const { proxy, onLoaded } = useScript('https://js.stripe.com/v3/')
    onLoaded(() => {
      initStripeExpressCheckout()
    })
  })

  
  // Clean up on unmount
  onBeforeUnmount(() => {
    if (stripeDropin.value) {
      stripeDropin.value.unmount();
      stripeDropin.value = null;
    }
    stripeElement.value = null;
  });
  </script>