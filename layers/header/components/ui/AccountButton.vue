<script setup lang="ts">
import { SfButton, SfDropdown, SfListItem, SfLoaderCircular, useDisclosure } from "@storefront-ui/vue"
import Overlay from './Overlay.vue'
const { user, isAuthenticated, logout, loading } = useAuth()
const loginLink = ref<String>('/login')
const { isOpen, toggle } = useDisclosure()

const emit = defineEmits(['onMenuOpen', 'onMenuClose'])

const NuxtLink = resolveComponent("NuxtLink")

watch(isOpen, (val) => {
    if (val) {
        emit('onMenuOpen')
        console.log('Emit Open')
    } else { 
        emit('onMenuClose')
        console.log('Emit Close')
    }
})

onMounted( () => {
  loginLink.value = isAuthenticated.value ? '/my-account/personal-data' : '/login'
})
</script>
<template>
<!--
    <Teleport to="body">
        <Overlay
            :isOpen="isOpen"
            class="!z-[99]"
        />
    </Teleport>
-->
    <SfDropdown 
        v-model="isOpen"
        class="h-full mr-4 z-[110] pl-1 pr-2"
        :class="{
            'bg-primary-900': isOpen
        }"
    >
        <template #trigger>
            <NuxtLink
                variant="tertiary"
                class="h-full block flex items-center hover:bg-transparent !text-white hover:!text-neutral-200 transition cursor-pointer"
                @click="toggle()"
                to=""
            >
                <Icon
                    name="flowbite:user-solid"
                    size="20px"
                />

                <span v-if="!isAuthenticated" class="text-sm">
                    {{$t('account.login')}}
                </span>
                <span v-else class="text-sm">
                    {{$t('account.navHeading')}}
                </span>
            </NuxtLink>
        </template>
        <div class="p-2 rounded bg-white border relative top-[-4px] shadow-md text-black">
            <div v-if="!loading">
                <div v-if="!isAuthenticated"
                    class="flex flex-col text-black"
                >
                    <SfButton
                        :tag="NuxtLink"
                        :to="loginLink"
                        size="sm"
                        class="py-2"
                    >
                        Login
                    </SfButton>
                    <p class="text-xs text-center py-2">New customer? <NuxtLink to="/signup" class="underline text-blue-600 ">Create an account</NuxtLink></p>
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

                <SfListItem v-if="isAuthenticated" size="sm" to="/" @click="logout()" :tag="NuxtLink">
                    <div class="break-words font-bold font-heading uppercase">{{ $t('account.logout') }}</div>
                </SfListItem>
                
                </div>
            </div>
            <div v-else class="flex flex-col align-center justify-center">
                <SfLoaderCircular size="xl"/>
            </div>
        </div>
    </SfDropdown>
</template>