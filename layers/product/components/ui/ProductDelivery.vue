<script setup lang="ts">
import {
    SfLink,
    SfIconPackage,
    SfIconWarehouse,
    SfIconSafetyCheck
} from '@storefront-ui/vue'

const { deliveryMethods, loadDeliveryMethods, loading } = useDeliveryMethod()

const tomorrow = useNextDeliveryDateUK()
const collection = useClickAndCollectTime()

const emit = defineEmits(['openReturnsPolicy'])

onMounted(async () => {
    //await loadDeliveryMethods()
})
</script>
<template>
    <div class="flex first:mt-4">
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
    <div class="flex mt-4">
        <SfIconWarehouse
            size="sm"
            class="flex-shrink-0 mr-1 text-neutral-500"
        />
        <p class="text-sm">
            <i18n-t
                keypath="additionalInfo.pickup"
                scope="global"
            >
                <template #collect>
                    {{ collection }}
                </template>
            </i18n-t>
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