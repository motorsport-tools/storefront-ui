<script setup lang="ts">
import {
  SfButton,
  SfLink,
  SfCheckbox,
  SfInput,
  SfLoaderCircular,
} from "@storefront-ui/vue";

const { login, loading } = useAuth();
const email = ref("");
const password = ref("");
const rememberMe = ref<boolean>();

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
    await login({ email: email.value, password: password.value }, redirectUrl );
};

const NuxtLink = resolveComponent("NuxtLink");
</script>

<template>
    <form
      class="border-neutral-200 md:border flex flex-col gap-4 md:p-6 rounded-md"
      @submit.prevent="handleLogin"
    >
        <label>
            <UiFormLabel>{{ $t("form.emailLabel") }}</UiFormLabel>
            <SfInput
            v-model="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            />
        </label>

        <label>
            <UiFormLabel>{{ $t("form.passwordLabel") }}</UiFormLabel>
            <UiFormPasswordInput
            v-model="password"
            name="password"
            autocomplete="current-password"
            required
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