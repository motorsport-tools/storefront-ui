<script setup lang="ts">
import { SfButton, SfIconArrowBack } from "@storefront-ui/vue";
const NuxtLink = resolveComponent("NuxtLink");
const error = useError();
if (error) {
  console.error("Error:", error);
}
</script>
<template>
  <NuxtLayout>
    <main 
      class="w-full narrow-container bg-white mb-20"
      data-testid="error-page"
    >
      <div
        v-if="error?.message === 'Product not found' || error?.statusCode === 404"
        class="flex flex-col justify-center items-center"
      >
        <ErrorDisplay :msg="$t('error.404')"/>
      </div>
      <div v-else>
        <p class="mt-8 text-center font-medium text-xl">{{ $t('error.wentWrong') }}</p>
        <pre class="mt-6 p-4 bg-red-100 text-sm rounded text-red-800 overflow-x-auto">
          Error Message: {{ error?.message }}
          Status Code: {{ error?.statusCode }}
          Error Name: {{ error?.name }}
          Cause: {{ error?.cause }}
          Stack: {{ error?.stack }}
        </pre>
        <div class="my-10">
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
    </main>
  </NuxtLayout>
</template>
