<script setup lang="ts">
import {
  SfButton,
  SfLink,
  SfCheckbox,
  SfInput,
  SfLoaderCircular,
} from "@storefront-ui/vue";
import { isValidEmail } from '~~/utils/validation'

const { login, loading, authError } = useAuth();
const { resetCheckoutFromStep } = useCheckout();
const email = ref("");
const password = ref("");
const rememberMe = ref<boolean>();

const showErrors = ref(false)
const emailValid = computed(() => isValidEmail(email.value))

const props = defineProps({
    redirectTo: String
})

const route = useRoute()
const queryRedirect = route.query?.redirect || false

let redirectUrl: String | Boolean  = false

if(props.redirectTo) {
    redirectUrl = props.redirectTo
}

if(!props.redirectTo && queryRedirect) {
    redirectUrl = queryRedirect
}

const handleLogin = async () => {
    showErrors.value = true
    if (!emailValid.value || !password.value.trim()) return
    resetCheckoutFromStep('customer')
    await login({ email: email.value, password: password.value }, redirectUrl );
};

const NuxtLink = resolveComponent("NuxtLink");

onMounted(() => {
  authError.value = ''
})
</script>

<template>
    <form
      class="border-neutral-200 md:border flex flex-col gap-4 md:p-6 rounded-md"
      @submit.prevent="handleLogin"
    >
        <UiFormError v-if="authError">
            {{ authError }}
        </UiFormError>
        
        <label>
            <UiFormLabel>{{ $t("form.emailLabel") }}</UiFormLabel>
            <SfInput
            v-model="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            :invalid="showErrors && !emailValid"
            />
        </label>

        <label>
            <UiFormLabel>{{ $t("form.passwordLabel") }}</UiFormLabel>
            <UiFormPasswordInput
            v-model="password"
            name="password"
            autocomplete="current-password"
            required
            :invalid="showErrors && !password.trim()"
            />
        </label>

        <label class="mt-2 flex items-center gap-2">
            <SfCheckbox v-model="rememberMe" name="rememberMe" />
            {{ $t("auth.login.rememberMeLabel") }}
        </label>

        <SfButton type="submit" class="mt-2" :disabled="loading">
            <SfLoaderCircular
            v-if="loading"
            class="flex justify-center items-center"
            size="base"
            />
            <span v-else>
            {{ $t("auth.login.submitLabel") }}
            </span>
        </SfButton>
        <SfButton
            :tag="NuxtLink"
            to="/reset-password"
            variant="tertiary"
            data-testid="login-page-reset-button"
        >
            {{ $t("auth.login.forgotPasswordLabel") }}
        </SfButton>
    </form>
</template>