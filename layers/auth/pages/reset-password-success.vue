<template>
  <NuxtLayout name="auth">
    <div
      class="mx-auto text-center rounded-md border border-neutral-200 p-4 md:p-6 mt-2"
    >
      <div
        class="w-full min-h-[330px] flex flex-col gap-4 items-center justify-center"
      >
        <Icon
          name="i-material-symbols-check-circle"
          class="size-20 text-primary-700"
        />
        <h1 class="text-3xl font-bold">{{ $t("auth.resetPassword.emailSent") }}</h1>
        <p>{{ $t("auth.resetPassword.thankYou") }}</p>
        <SfButton @click="navigateTo('/login')" size="lg" variant="secondary">
          {{ $t("auth.resetPassword.backToLogin") }}
        </SfButton> 
      </div>
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
import { SfButton } from "@storefront-ui/vue";

definePageMeta({
  layout: false,
});
</script>
