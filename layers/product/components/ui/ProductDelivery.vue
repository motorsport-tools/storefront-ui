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
    return productVariant.value?.combinationInfoVariant?.stock <= 0 && productVariant.value?.combinationInfoVariant?.allow_out_of_stock_order ? 2 : 0
})

const tomorrow = useNextDeliveryDateUK(deliveryLead.value)
const collection = useClickAndCollectTime()

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
    <div class="flex mt-4">
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
        class="flex mt-4"
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
    <div class="flex mt-4">
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