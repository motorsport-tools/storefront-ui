<script setup lang="ts">
import Overlay  from './Overlay.vue'
import type { Category } from '~/graphql'
import { useDisclosure, useDropdown, useTrapFocus, SfListItem, SfCounter, SfButton, SfDrawer, SfIconChevronRight, SfIconClose, SfIconArrowBack } from '@storefront-ui/vue'


const props = defineProps<{ 
    headerRef: HTMLElement 
}>()

const { headerRef } = toRefs(props)
const drawerRef = ref()
const { open, close, isOpen } = useDisclosure()

const categoriesForMegaMenu = inject<Category[]>('categoriesForMegaMenu')
const content: menuNode = categoriesForMegaMenu.value

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
</script>

<template ref="headerRef">
    <nav class="hidden lg:block h-full">
        <ul 
            class="h-full block flex align-center justify-center"
        >   
            <li
                v-for="(menuNode, index) in content.children"
                :key="menuNode?.key"
                class="group h-full flex items-center justify-center px-3 py-2 text-white font-bold uppercase"
            >
                <span>{{ menuNode.value.label }}</span>
                <SfIconChevronRight
                    class="rotate-90 text-primary-700 group-hover:text-neutral-700 group-active:text-neutral-900"
                />
            </li>

        </ul>
    </nav>
    
    <Overlay :isOpen="isOpen"/>
    
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
            class="lg:hidden right-[50px] max-w-[376px] bg-white z-10 h-full"
        >
            <nav class="text-white h-full">
                <div class="flex items-center justify-between p-4 border-b border-b-neutral-200 border-b-solid bg-neutral-900 relative">
                    <p class="typography-text-sm font-medium">Browse <span class="block font-bold text-base uppercase font-headings">Motorsport-Tools</span></p>
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
                                <SfListItem size="lg" tag="button" type="button" @click="goNext(node.key)" class="group">
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
</template>