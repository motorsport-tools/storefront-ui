<script setup lang="ts">
import Overlay  from './Overlay.vue'
import type { Category } from '~/graphql'
import type { Node as menuNode } from '#layers/header/types'
import { useDisclosure, useTrapFocus, SfListItem, SfCounter, SfButton, SfDrawer, SfIconChevronRight, SfIconClose, SfIconArrowBack } from '@storefront-ui/vue'

const route = useRoute()
watch(
  () => route.fullPath,
  () => {
    isOpen.value = false
  }
)

const siteGlobals = useNuxtApp().payload.data['site-data'].globals

const drawerRef = ref()
const { open, close, isOpen } = useDisclosure()

const categoriesForMegaMenu = inject<Category[]>('categoriesForMegaMenu')
let content: menuNode 

if( categoriesForMegaMenu ) {
  content = categoriesForMegaMenu.value
}

const activeNode = ref<string[]>([])
const activeMenu = computed(() => findMenuNode(activeNode.value, content))

useTrapFocus(drawerRef, {
    activeState: isOpen,
    arrowKeysUpDown: true,
    initialFocus: 'container'
})

const goBack = () => {
    activeNode.value = activeNode.value.slice(0, activeNode.value.length - 1)
}

const goNext = (key: string) => {
    activeNode.value = [...activeNode.value, key]
}

const openMenu = (menuType: string[]) => {
    activeNode.value = menuType
    open()
}

defineExpose({
  openMenu
})

watch(isOpen, (open) => {
    document.body.classList.toggle('overflow-hidden', open)
})

onUnmounted(() => {
    document.body.classList.remove('overflow-hidden')
})

const { isAuthenticated, user, logout } = useAuth()
const { resetCheckoutFromStep } = useCheckout()
const NuxtLink = resolveComponent("NuxtLink")
</script>
<template>
    <Overlay :isOpen="isOpen" class="lg:hidden !z-[100] !h-full"/>
    <transition
        enter-active-class="transition duration-500 ease-in-out delay-200"
        leave-active-class="transition duration-500 ease-in-out"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
    >
        <SfDrawer
            ref="drawerRef"
            v-model="isOpen"
            placement="left"
            class="lg:hidden right-[50px] max-w-[376px] bg-white z-100 h-full"
        >
            <nav class="text-white h-full">
                <div class="flex items-center justify-between p-4 border-b border-b-neutral-200 border-b-solid bg-neutral-900 relative">
                    <p class="typography-text-sm font-medium">{{ $t('menu.browse') }}<span class="block font-bold text-base uppercase font-headings">{{ siteGlobals.organization }}</span></p>
                    <SfButton 
                        variant="tertiary"
                        square 
                        aria-label="Close menu" 
                        class="absolute top-0 right-0 hover:!bg-transparent active:!bg-transparent z-20 pt-4 pr-4 cursor-pointer"
                        title="Close menu" 
                        @click="close()"
                    >
                        <SfIconClose class="text-white" size="lg" />
                    </SfButton>
                </div>
                <div class="h-full overflow-y-auto">
                    <ul class="mb-6 text-neutral-900">
                        <li
                            v-if="activeMenu.key == 'root'"
                            class="font-bold border-b p-4 text-lg"
                        >
                            {{ $t('categories.heading') }}
                        </li>
                        <li v-if="activeMenu.key !== 'root'">
                            <SfListItem
                                size="lg"
                                tag="button"
                                type="button"
                                class="border-b border-b-neutral-200 border-b-solid"
                                @click="goBack()"
                            >
                                <div class="flex items-center">
                                    <SfIconArrowBack />
                                    <p class="ml-5 font-medium">{{ activeMenu.value.label }}</p>
                                </div>
                            </SfListItem>
                            <SfListItem
                                size="lg"
                                tag="a"
                                class="font-medium"
                                :href="activeMenu.value.link"
                                :title="$t('menu.viewAllTitle', { category: activeMenu.value.label})"
                            >
                                <div class="flex items-center">
                                    <p class="text-left">{{ $t('menu.viewAll', { category: activeMenu.value.label}) }}</p>
                                </div>
                            </SfListItem>
                        </li>
                        <template v-for="node in activeMenu.children" :key="node.value.label">
                            <li v-if="!node.isLeaf">
                                <SfListItem size="lg" tag="a" :href="node.value.link" class="first-of-type:mt-2">
                                    <div class="flex items-center">
                                        <p class="text-left">{{ node.value.label }}</p>
                                    </div>
                                </SfListItem>
                            </li>
                            <li v-else>
                                <SfListItem 
                                    size="lg"
                                    tag="button"
                                    type="button"
                                    @click="goNext(node.key)"
                                    class="group"
                                >
                                    <div class="flex justify-between items-center">
                                        <div class="flex items-center">
                                            <p class="text-left">{{ node.value.label }}</p>
                                        </div>
                                        <SfIconChevronRight class="text-neutral-500 group-hover:text-primary-700" />
                                    </div>
                                </SfListItem>
                            </li>
                        </template>
                        <li
                            v-if="activeMenu.key == 'root'"
                            class="font-bold border-b p-4 text-lg"
                        >
                            {{ $t('account.navHeading') }}
                        </li>
                        <li
                            v-if="!isAuthenticated"
                        >
                            <SfListItem 
                                to="/login"
                                :tag="NuxtLink"
                            >
                                {{ $t('account.login') }}
                            </SfListItem>
                        </li>
                        <li 
                            v-else
                            class="px-4 py-4"
                        >
                            <p class="text-sm">
                                {{ $t('welcome') }}
                            </p>
                            <p class="font-bold text-primary-700 mb-0">
                                {{ user.name }}
                            </p>
                        </li>
                        <li
                            v-if="isAuthenticated"
                        >
                            <SfListItem
                                to="/my-account/my-orders"
                                class="px-4 py-4"
                                :tag="NuxtLink"
                                @click="close()"
                            >    
                                {{ $t('account.myOrders.myOrders') }}
                            </SfListItem>
                            <SfListItem
                                to="/my-account/personal-data"
                                class="px-4 py-4"
                                :tag="NuxtLink"
                                @click="close()"
                            >    
                                {{ $t('account.accountSettings.section.personalData') }}
                            </SfListItem>
                            <SfListItem
                                to="/my-account/billing-details"
                                class="px-4 py-4"
                                :tag="NuxtLink"
                                @click="close()"
                            >    
                                {{ $t('account.accountSettings.section.billingDetails') }}
                            </SfListItem>
                            <SfListItem
                                to="/my-account/shipping-details"
                                class="px-4 py-4"
                                :tag="NuxtLink"
                                @click="close()"
                            >    
                                {{ $t('account.accountSettings.section.shippingDetails') }}
                            </SfListItem>
                            <SfListItem
                                to="/"
                                class="px-4 py-4"
                                :tag="NuxtLink"
                                @click="() => { resetCheckoutFromStep('customer'); logout(); close() }"
                            >
                                {{ $t('account.logout') }}
                            </SfListItem>
                        </li>
                    </ul>
                </div>
            </nav>
        </SfDrawer>
    </transition>
</template>