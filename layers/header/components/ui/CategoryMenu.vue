<script setup lang="ts">
import Overlay  from './Overlay.vue'
import type { Category } from '~/graphql'
import type { Node as menuNode } from '#layers/header/types'
import { useDisclosure, useDropdown, useTrapFocus, SfListItem, SfCounter, SfButton, SfDrawer, SfIconChevronRight, SfIconClose, SfIconArrowBack } from '@storefront-ui/vue'

const props = defineProps<{ 
    headerRef: HTMLElement ,
    isMobile: boolean
}>()

const router = useRouter()
//router.beforeEach(() => isOpen.value = false)
const siteGlobals = useNuxtApp().payload.data['site-data'].globals

const { headerRef, isMobile } = toRefs(props)

const drawerRef = ref()
const { open, close, isOpen } = useDisclosure()

if(!isMobile.value) {
     floatingRef.value, style.value = useDropdown({
        isOpen,
        onClose: close,
        placement: 'bottom-start',
        middleware: [],
        strategy: 'fixed',
        referenceRef: headerRef
    })
}

const triggerRefs = ref()

const categoriesForMegaMenu = inject<Category[]>('categoriesForMegaMenu')
let content: menuNode 

if( categoriesForMegaMenu ) {
  content = categoriesForMegaMenu.value
}

const activeNode = ref<string[]>([])
const activeMenu = computed(() => findMenuNode(activeNode.value, content))

const NuxtLink = resolveComponent("NuxtLink")

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

const focusTrigger = (index: number) => {
    unrefElement(triggerRefs.value[index]).focus();
}

const openMenu = (menuType: string[]) => {
    activeNode.value = menuType
    open()
}

defineExpose({
  openMenu
})

watch(isOpen, (open) => {
    if(!open) {
        console.trace('Closing menu')
    }
    if (isMobile.value) {
        document.body.classList.toggle('overflow-hidden', open)
    } else {
        document.body.classList.remove('overflow-hidden')
    }
})

onUnmounted(() => {
    document.body.classList.remove('overflow-hidden')
})
</script>

<template ref="headerRef">
    <nav ref="floatingRef" class="hidden lg:block h-full">
        <ul 
            class="h-full block flex align-center justify-center items-stretch"
            @blur="
                (event) => {
                    if (!(event.currentTarget as Element).contains(event.relatedTarget as Element)) {
                        close();
                    }
                }
            "
        >   
            <li
                v-for="(menuNode, index) in content.children"
                :key="menuNode?.key"
                class="group flex-grow flex items-center justify-center px-3 py-2 text-white font-bold uppercase lg:text-sm xl:text-base"
            >
                <SfButton
                    ref="triggerRefs"
                    variant="tertiary"
                    class="group mr-2 !text-white hover:!text-white  active:!text-white text-sm/3 bg-transparent !p-0 hover:!bg-transparent active:!bg-transparent"
                    :tag="NuxtLink"
                    :to="menuNode.value.link"
                    @mouseenter="openMenu([menuNode.key])"
                    
                >
                <span>{{ menuNode.value.label }}</span>
                <SfIconChevronRight v-if="menuNode.isLeaf"
                    class="rotate-90 text-primary-700 group-hover:text-neutral-700 group-active:text-neutral-900"
                />
                </SfButton>
                <Teleport to="body">
                <div
                    v-if="isOpen && activeNode.length === 1 && activeNode[0] === menuNode.key"
                    :key="activeMenu.key"
                    ref="megaMenuRef"
                    :style="style"
                    class="hidden bg-neutral-600 lg:grid gap-x-6 grid-cols-4 text-white shadow-lg p-6 left-0 right-0 outline-none lg:z-[9999]"
                    tabindex="0"
                    @mouseleave="close()"
                    @keydown.esc="focusTrigger(index)"
                >
                    <template v-for="node in activeMenu.children" :key="node.key"> 
                        <div>
                            {{ node.value }}
                        </div>
                    </template>
                </div>
                </Teleport>
            </li>

        </ul>
    </nav>
    <Teleport to="body">
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
                        </ul>
                    </div>
                </nav>
            </SfDrawer>
        </transition>
    </Teleport>
</template>