<script setup lang="ts">
import { SfButton, SfIconArrowBack } from "@storefront-ui/vue";

const props = defineProps({
  title: {
    type: String,
    default: "Checkout",
  },
  backToCart: {
    type: Boolean,
    default: true,
  },
  backText: {
    type: String,
    default: "Back",
  },
  icon: {
    type: [Object, Function],
    default: null
  }
});

const localePath = useLocalePath();
const router = useRouter();
const historyState = router.options.history.state;
const backUrl = localePath(historyState?.back?.toString() ?? '/');
const backHref = backUrl === localePath(router.currentRoute.value.path) ? localePath('/') : backUrl;
const goToPreviousRoute = () => (props.backToCart ? navigateTo(localePath('/cart')) : navigateTo(localePath(backHref)));

</script>
<template>
  <div class="flex justify-between mt-8 mb-10 md:px-0" hydrate-on-visible>
    <div class="inline-block flex flex-row items-center md:pl-4">
      <component
        v-if="icon"
        :is="icon"
      />
      <h1 class="font-bold typography-headline-3 md:typography-headline-2 pl-2">{{ title }}</h1>
    </div>
    <SfButton 
        :class="[$viewport.isLessThan('lg') ? 'flex whitespace-nowrap' : 'lg:flex']"
        :size="$viewport.isLessThan('lg') ? 'sm' : 'base'"
        :aria-label="$t('prevAriaLabel')"
        variant="tertiary"
        @click="goToPreviousRoute"
    >
        <template #prefix>
            <SfIconArrowBack />
        </template>
        {{ backText }}
    </SfButton>
</div>
</template>
