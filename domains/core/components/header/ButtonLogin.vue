<script lang="ts" setup>
import { SfButton, SfDropdown, SfListItem, useDisclosure } from "@storefront-ui/vue";

const NuxtLink = resolveComponent("NuxtLink");

const { user, isAuthenticated, logout, loading } = useAuth();

const loginLink = ref<String>('/login')
const loginButtonClass = ref<String>('ion:person-outline')

const { isOpen, toggle, open, close } = useDisclosure();


onMounted( () => {
  loginLink.value = isAuthenticated.value ? '/my-account/personal-data' : '/login'
  loginButtonClass.value = isAuthenticated.value ? 'ion:person' : 'ion:person-outline'
})

</script>

<template>
  <SfDropdown v-model="isOpen">
    <template #trigger>
      <SfButton
        class="text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 rounded-md"
        :class="{
          'bg-primary-900': isOpen
        }"
        variant="tertiary"
        square
        @click="toggle()"
      >
        <template #prefix>
          <Icon
            :name="loginButtonClass"
            size="22px"
          />
        </template>
        <div v-if="!isAuthenticated" class="flex flex-col justify-bottom text-left">
          <p class="text-xs ">Hello, Guest</p>
          <p class="text-sm font-bold">Your Account</p>
        </div>
        <div v-else class="flex flex-col justify-bottom text-left">
          <p class="text-xs ">{{ user.name }}</p>
          <p class="text-sm font-bold">Your Account</p>
        </div>
      </SfButton>
    </template>
    <div class="p-2 rounded bg-white top-[-20px] shadow-md">
      <div v-if="!isAuthenticated"
        class="flex flex-col text-black"
      >
        <SfButton
          :tag="NuxtLink"
          :to="loginLink"
          size="sm"
        >
          Sign in
        </SfButton>
        <p class="text-xs py-2">New customer? <NuxtLink to="/signup" class="underline text-blue">Create an account</NuxtLink></p>
      </div>
      <div class="flex flex-col text-black max-w-sm gap-4">
        <SfListItem size="sm" to="/my-account/my-orders" :tag="NuxtLink">
          <div class="break-words font-bold font-heading uppercase">{{ $t('account.myOrders.myOrders') }}</div>
          <span class="text-xs text-neutral-500 break-words truncate">
            {{ $t('account.myOrders.menuDescription') }}  
          </span>
        </SfListItem>
        <SfListItem size="sm" to="/my-account/personal-data" :tag="NuxtLink">
          <div class="break-words font-bold font-heading uppercase">{{ $t('account.accountSettings.section.personalData') }}</div>
          <span class="text-xs text-neutral-500 break-words truncate">
            {{ $t('account.accountSettings.personalData.menuDescription') }}  
          </span>
        </SfListItem>
        <SfListItem size="sm" to="/my-account/billing-details" :tag="NuxtLink">
          <div class="break-words font-bold font-heading uppercase">{{ $t('account.accountSettings.section.billingDetails') }}</div>
          <span class="text-xs text-neutral-500 break-words truncate">
            {{ $t('account.accountSettings.billingDetails.menuDescription') }}  
          </span>
        </SfListItem>
        
        <SfListItem size="sm" to="/my-account/shipping-details" :tag="NuxtLink">
          <div class="break-words font-bold font-heading uppercase">{{ $t('account.accountSettings.section.shippingDetails') }}</div>
          <span class="text-xs text-neutral-500 break-words truncate">
            {{ $t('account.accountSettings.shippingDetails.menuDescription') }}  
          </span>
        </SfListItem>

        <SfListItem size="sm" to="/" @click="logout()" :tag="NuxtLink">
          <div class="break-words font-bold font-heading uppercase">{{ $t('account.logout') }}</div>
        </SfListItem>
        
      </div>
    </div>
  </SfDropdown>
</template>
