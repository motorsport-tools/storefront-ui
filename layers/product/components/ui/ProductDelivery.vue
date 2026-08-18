<script setup lang="ts">
import {
    SfLink,
    SfIconPackage,
    SfIconWarehouse,
    SfIconSafetyCheck,
    SfIconWarning
} from '@storefront-ui/vue'
import type { CustomProductWithStockFromRedis } from '~/graphql';

interface Props {
    clickAndCollect: boolean,
    productVariant: CustomProductWithStockFromRedis
    oversized: boolean
}
const props = defineProps<Props>()
const { productVariant } = toRefs(props)

const { deliveryMethods, loadDeliveryMethods, loading } = useDeliveryMethod()

const deliveryLead = computed(() => {
    const variant = productVariant.value?.combinationInfoVariant
    const saleDelay = parseInt(productVariant.value?.saleDelay || 0, 10)

    if (productVariant.value?.stock <= 0 && variant?.allow_out_of_stock_order) {
        return saleDelay || 2
    }

    return 0
})

const tomorrow = useNextDeliveryDateUK(deliveryLead.value)
const collection = useClickAndCollectTime()
const isPreorder = computed(() => {
    return productVariant.value?.isPreorder
})

const emit = defineEmits(['openReturnsPolicy'])

onMounted(async () => {
    //await loadDeliveryMethods()
})
</script>
<template>
    <div 
        v-if="oversized"
        role="alert"
        class="flex mt-4 bg-warning-200 pr-2 pl-2 py-2 ring-1 ring-warning-200 rounded-md"
    >
        <SfIconWarning 
            size="sm"
            class="flex-shrink-0 mr-1 text-warning-700"
        />
        <p class="text-sm text-warning-700 font-medium">
            {{ $t("additionalInfo.oversized") }}
        </p>
    </div>
    <div 
        v-if="isPreorder"
        class="flex mt-4 items-center"
    >
        <Icon name="mdi:clock" class="flex-shrink-0 mr-1 text-neutral-500" />
        <p class="text-sm">
            <strong>{{ $t("additionalInfo.preorder") }}</strong>
        </p>
    </div>
    
    <div 
        v-else
        class="flex mt-4 items-center"
    >
        <SfIconPackage
            size="sm"
            class="flex-shrink-0 mr-1 text-neutral-500"
        />
        <p class="text-sm">
            <i18n-t
                keypath="additionalInfo.shipping"
                scope="global"
            >
                <template #date>
                    {{ tomorrow }}
                </template>
                <template #addAddress>
                    <SfLink
                        class="ml-1"
                        href="#"
                        variant="secondary"
                    >
                        {{ $t("additionalInfo.addAddress") }}
                    </SfLink>
                </template>
            </i18n-t>
        </p>
    </div>
    <div 
        class="flex mt-4 items-center"
    >
        <SfIconWarehouse
            size="sm"
            class="flex-shrink-0 mr-1 text-neutral-500"
        />
        <p 
            v-if="clickAndCollect"
            class="text-sm"
        >
            <i18n-t
                keypath="additionalInfo.pickup"
                scope="global"
            >
                <template #collect>
                    {{ collection }}
                </template>
            </i18n-t>
        </p>
        <p
            v-else
            class="text-sm"
        >
            {{ $t("additionalInfo.pickupUnavailable") }}
        </p>
    </div>
    <div class="flex mt-4 items-center">
        <SfIconSafetyCheck
            size="sm"
            class="flex-shrink-0 mr-1 text-neutral-500"
        />
        <i18n-t
            keypath="additionalInfo.returns"
            scope="global"
        >
            <template #details>
                <SfLink
                    class="ml-1 cursor-pointer"
                    @click="emit('openReturnsPolicy')"
                    variant="secondary"
                >
                    {{ $t("additionalInfo.details") }}
                </SfLink>
            </template>
        </i18n-t>
    </div>
    <!--
    <div class="flex mt-4">
        {{ loading }}<br/>
        {{ deliveryMethods }}
    </div>
    -->
</template>