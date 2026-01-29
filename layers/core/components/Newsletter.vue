<script lang="ts" setup>
import { SfButton, SfLink } from "@storefront-ui/vue";
import { ref, type Ref } from "vue";
import { useCore } from "../composable/useCore";

const { newsletterSubscribe } = useCore();

const inputValue = ref("");
const emailValidation = ref();

const subscribeNewsletter = async () => {
  await newsletterSubscribe({ email: inputValue.value });
  inputValue.value = "";
};
</script>
<template>
  <div class="relative border-t border-b border-[#E5E7EB] bg-[#d9d9d9] newsletter">
    <div class="flex flex-wrap gap-4 items-center justify-center sm:justify-between narrow-container py-8 sm:py-14">
      <div class="text-center sm:text-left">
        <p class="text-[24px] sm:text-[28px] mb-[5px] font-bold break-words">
          Sign up for exclusive <span class="text-primary-700">special offers</span>. 
        </p>
        <p class="text-[18px] sm:text-[20px] mb-[5px] font-bold break-words">
          Latest news, updates and more. 
        </p>
      </div>
      <div 
        class="flex flex-col gap-4"
      >
        <form class="w-full sm:w-auto flex flex-col sm:flex-row gap-4 mb-4 sm:mb-0" @submit.prevent="subscribeNewsletter()">
          <UiFormEmailInput 
            v-model="inputValue" 
            @is-field-valid="(n) => (emailValidation = n)" 
            class="w-full sm:min-w-[300px]"
          />
          <SfButton :disabled="!emailValidation" type="submit" class="w-[325px] disabled:bg-neutral-100 disabled:text-neutral-600">
            {{ $t('subscribe') }}
          </SfButton>
        </form>
        <div class="typography-text-xs text-neutral-600">
          <p>We care about the protection of your data. Read our <SfLink href="#" class="!text-neutral-600">Privacy Policy</SfLink>.
          By subscribing you agree to our <SfLink href="#" class="!text-neutral-600">Terms of Service</SfLink>.</p>
        </div>
      </div>
      
    </div>
  </div>
</template>
<style lang="css" scoped>

</style>
