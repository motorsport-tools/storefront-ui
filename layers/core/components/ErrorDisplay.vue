<script setup lang="ts">
import { SfIconArrowBack, SfButton } from '@storefront-ui/vue'
defineProps({
    msg: String
})

const NuxtLink = resolveComponent("NuxtLink")
</script>
<template>
    <div class="py-5 flex flex-col justify-center items-center">
        <NuxtImg
            src="/img/something-went-wrong.png"
            :alt="$t('emptyStateAltText')"
            width="300"
            height="330"
        />
        <p class="text-xl mt-1 text-center font-medium">
        {{ msg }}
        </p>
        <div class="my-10 flex align-center justify-center">
            <SfButton
                to="/search"
                class="hidden md:flex"
                variant="secondary"
                :tag="NuxtLink"
            >
                <template #prefix>
                    <SfIconArrowBack />
                </template>
                {{ $t("backToShopping") }}
            </SfButton>
        </div>
    </div>
</template>