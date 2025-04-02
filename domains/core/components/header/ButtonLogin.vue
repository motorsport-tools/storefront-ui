<script lang="ts" setup>
import { SfButton } from "@storefront-ui/vue";

const NuxtLink = resolveComponent("NuxtLink");

const { isAuthenticated } = useAuth();

const loginLink = ref<String>('/login')
const loginButtonClass = ref<String>('ion:person-outline')
onMounted( () => {
  loginLink.value = isAuthenticated.value ? '/my-account/personal-data' : '/login'
  loginButtonClass.value = isAuthenticated.value ? 'ion:person' : 'ion:person-outline'
})

</script>

<template>
  
  <SfButton
    class="text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 mr-1 -ml-0.5 rounded-md"
    variant="tertiary"
    :to="loginLink"
    :tag="NuxtLink"
    square
  >
    <template #prefix>
      <Icon
        :name="loginButtonClass"
        size="22px"
      />
    </template>
  </SfButton>
  
</template>
