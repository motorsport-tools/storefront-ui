<script setup lang="ts">
import {
  SfButton,
  SfInput,
  SfCheckbox,
  SfLink,
  SfLoaderCircular,
} from "@storefront-ui/vue";

definePageMeta({
  layout: false,
});

const firstNameModel = ref("");
const lastNameModel = ref("");
const emailModel = ref("");
const passwordModel = ref("");
const termsAndConditionsModel = ref<boolean>();
const subscriptionsModel = ref<boolean>();

const NuxtLink = resolveComponent("NuxtLink");
const { signup, loading } = useAuth();
const { resetCheckoutFromStep } = useCheckout()
const fullName = computed(
  () => `${firstNameModel.value} ${lastNameModel.value}`
);

const handleSignup = async () => {
  resetCheckoutFromStep('customer')

  await signup({
    email: emailModel.value,
    name: fullName.value,
    password: passwordModel.value,
    subscribeNewsletter: subscriptionsModel.value === true,
  });
};
</script>

<template>
  <NuxtLayout name="auth" :heading="$t('auth.signup.heading')">
    <UiAlert
      class="w-full p-4 md:p-6 mb-6 !justify-start typography-text-base"
      variant="neutral"
    >
      <i18n-t keypath="auth.signup.bannerText">
        <template #login>
          <SfLink
            :tag="NuxtLink"
            to="/login"
            class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
            data-testid="signup-page-login-button"
          >
            {{ $t("auth.login.heading") }}
          </SfLink>
        </template>
      </i18n-t>
    </UiAlert>

    <form
      data-testid="signup-form"
      class="flex flex-col md:border md:border-neutral-200 rounded-md gap-4 md:p-6"
      @submit.prevent="handleSignup"
    >
      <label>
        <UiFormLabel>{{ $t("form.firstNameLabel") }} *</UiFormLabel>
        <SfInput
          v-model="firstNameModel"
          name="firstName"
          autocomplete="given-name"
          required
        />
      </label>
      <label>
        <UiFormLabel>{{ $t("form.lastNameLabel") }} *</UiFormLabel>
        <SfInput
          v-model="lastNameModel"
          name="lastName"
          autocomplete="family-name"
          required
        />
      </label>
      <label>
        <UiFormLabel>{{ $t("form.emailLabel") }} *</UiFormLabel>
        <SfInput
          v-model="emailModel"
          name="email"
          type="email"
          autocomplete="email"
          required
        />
      </label>
      <div>
        <label>
          <UiFormLabel>{{ $t("form.passwordLabel") }} *</UiFormLabel>
          <UiFormPasswordInput
            v-model="passwordModel"
            name="password"
            autocomplete="current-password"
            required
          />
          <UiFormHelperText class="mb-2">{{
            $t("form.passwordHint")
          }}</UiFormHelperText>
        </label>
      </div>

      <div class="flex items-center">
        <SfCheckbox
          id="terms"
          v-model="termsAndConditionsModel"
          value="value"
          class="peer"
          required
        />
        <label
          class="ml-3 text-base text-neutral-900 cursor-pointer font-body peer-disabled:text-disabled-900"
          for="terms"
        >
          *
          <i18n-t keypath="form.termsAndConditionsLabel">
            <template #terms>
              <SfLink
                href="#"
                class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
              >
                {{ $t("termsAndConditions") }}
              </SfLink>
            </template>
          </i18n-t>
        </label>
      </div>

      <div class="flex mb-2">
        <SfCheckbox
          id="subscription"
          v-model="subscriptionsModel"
          value="value"
          class="peer mt-0.5"
        />
        <label
          class="ml-3 text-base text-neutral-900 cursor-pointer font-body peer-disabled:text-disabled-900"
          for="subscription"
        >
          {{ $t("form.subscriptionLabel") }}
        </label>
      </div>

      <p class="text-sm text-neutral-500 mt-0.5 mb-2">
        {{ $t("form.asterixHint") }}
      </p>

      <SfButton type="submit" size="lg" class="w-full" :disabled="loading">
        <span v-if="loading">
          <SfLoaderCircular
            class="ml-2 text-white"
            size="sm"
          />
        </span>
        <span v-else>
          {{ $t("auth.signup.createButton") }}
        </span>
      </SfButton>
    </form>
  </NuxtLayout>
</template>
