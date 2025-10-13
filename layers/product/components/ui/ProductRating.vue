<script setup lang="ts">
import {
    SfRating,
    SfCounter,
    SfLink
} from '@storefront-ui/vue'

interface Props {
    rating: number
    ratingCount: number,
}
const props = defineProps<Props>()

</script>
<template>
    <SfLink
        href="#customer-reviews"
        variant="secondary"
        class="inline-flex flex-row mt-auto items-end h-full text-xs text-neutral-500 no-underline"
        :title="$t('reviewsView')"
    >
        <SfRating
            size="sm"
            :value="rating"
            :max="5"
            :halfIncrement="true"
        />
        <SfCounter
            class=""
            size="xs"
        >
            {{ ratingCount }}
        </SfCounter>
        <span 
            v-show="ratingCount > 0"
            class="inline-block ml-2"
        >
            {{ $t('reviews.readAll') }}
        </span>
    </SfLink>
</template>