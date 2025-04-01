<script setup lang="ts">
import {
  SfButton,
  SfLink,
  SfCheckbox,
  SfInput,
  SfLoaderCircular,
} from "@storefront-ui/vue";
import LoginForm from "../components/LoginForm.vue";

definePageMeta({
  layout: false,
});

const { login, loading } = useAuth();

const email = ref("");
const password = ref("");
const rememberMe = ref<boolean>();
const isLoading = ref<boolean>();

const handleLogin = async () => {
  await login({ email: email.value, password: password.value });
};

const NuxtLink = resolveComponent("NuxtLink");
</script>

<template>
  <NuxtLayout name="auth" :heading="$t('auth.login.heading')">
    
    <LoginForm/>

    <UiAlert
      class="mt-6 w-full p-4 md:p-6 !justify-start typography-text-base"
      variant="neutral"
    >
      <i18n-t tag="span" keypath="auth.login.createAccountBanner">
        <SfLink
          :tag="NuxtLink"
          to="signup"
          variant="primary"
          data-testid="login-page-signup-button"
        >
          {{ $t("auth.login.createAccountLinkLabel") }}
        </SfLink>
      </i18n-t>
    </UiAlert>
  </NuxtLayout>
</template>
