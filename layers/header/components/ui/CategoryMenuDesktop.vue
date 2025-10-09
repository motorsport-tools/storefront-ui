<script setup lang="ts">
import type { Category } from '~/graphql'
import type { Node as menuNode } from '#layers/header/types'
import { useDisclosure, useDropdown, useTrapFocus, SfLink, SfListItem, SfCounter, SfButton, SfIconChevronRight } from '@storefront-ui/vue'

const props = defineProps<{ 
    headerRef: HTMLElement,
}>()

const emit = defineEmits(['openMenu', 'closeMenu'])

const { headerRef } = toRefs(props)
const triggerRefs = ref()

const { open, close, isOpen } = useDisclosure()


const categoriesForMegaMenu = inject<Category[]>('categoriesForMegaMenu')
let content: menuNode 

if( categoriesForMegaMenu ) {
  content = categoriesForMegaMenu.value
}

const activeNode = ref<string[]>([])
const activeMenu = computed(() => findMenuNode(activeNode.value, content))

const NuxtLink = resolveComponent("NuxtLink")

const focusTrigger = (index: number) => {
    unrefElement(triggerRefs.value[index]).focus();
}

let hoverTimer:ReturnType<typeof setTimeout> | undefined = undefined

const startHover = (menuType: string[]) => {
    hoverTimer = setTimeout(() => {
        openMenu(menuType)
    }, 500)
}
const endHover = () => {
    clearTimeout(hoverTimer)
    closeMenu()
}
const openMenu = (menuType: string[]) => {
    activeNode.value = menuType
    if (activeMenu.value.isLeaf) {
        emit('openMenu')
    } else {
        emit('closeMenu')
    }
    open()
}

const closeMenu = () => {
    setTimeout(() => {
        if (!isOpen.value) {
            emit('closeMenu')
        }
    }, 100)
    
    close()
}

const { floatingRef, style } = useDropdown({
    isOpen,
    onClose: closeMenu,
    placement: 'bottom-start',
    middleware: [],
    strategy: 'absolute',
    referenceRef: headerRef
})

defineExpose({
  openMenu
})
</script>
<template ref="headerRef">
    <nav ref="floatingRef" class="hidden lg:block h-full">
        <ul 
            class="h-full block flex align-center justify-center items-stretch"
            @blur="
                (event) => {
                    if (!(event.currentTarget as Element).contains(event.relatedTarget as Element)) {
                        closeMenu
                    }
                }
            "
        >   
            <li
                v-for="(menuNode, index) in content.children"
                :key="menuNode?.key"
                class="group flex-grow flex items-center justify-center px-3 text-white font-bold uppercase lg:text-sm xl:text-base"
                @mouseleave="endHover()">
                <SfButton
                    ref="triggerRefs"
                    variant="tertiary"
                    class="group hover:!text-black  active:!text-black !font-bold text-sm/3 bg-transparent hover:!bg-white active:!bg-white py-2 !px-2 !rounded-none"
                    :class="[
                        isOpen && menuNode.isLeaf && activeNode.length === 1 && activeNode[0] === menuNode.key
                            ? '!text-black !bg-white'
                            : '!text-white bg-transparent'
                    ]"
                    :tag="NuxtLink"
                    :to="menuNode.value.link"
                    @mouseenter="startHover([menuNode.key])"
                >
                <span>{{ menuNode.value.label }}</span>
                <SfIconChevronRight v-if="menuNode.isLeaf"
                    class="rotate-90 text-primary-700 group-hover:text-neutral-700 group-active:text-neutral-900"
                />
                </SfButton>
                <div
                    v-if="isOpen && menuNode.isLeaf && activeNode.length === 1 && activeNode[0] === menuNode.key"
                    :key="activeMenu.key"
                    ref="megaMenuRef"
                    :style="style"
                    class="hidden bg-white lg:grid gap-x-6 gap-y-4
                    lg:grid-cols-6 text-black normal-case shadow-lg p-4 left-0 right-0 outline-none lg:z-[9999] rounded-bl-[30px] rounded-br-[30px] border-b border-neutral-200 left-0 right-0 mx-auto max-w-[98vw]"
                    tabindex="0"
                    @keydown.esc="focusTrigger(index)"
                >
                    <div class="lg:col-span-6 row-span-1">
                        <NuxtLink
                            tag="a"
                            :href="menuNode.value.link"
                            class="text-black whitespace-nowrap cursor-pointer !px-0 hover:text-primary-700"
                        >
                            <span class="text-left font-bold text-lg">
                                {{ $t('menu.viewAll', { category: menuNode.value.label}) }}
                            </span>
                            <SfIconChevronRight/>
                        </NuxtLink>
                    </div>
                    <template v-for="node in activeMenu.children" :key="node.key">
                        <div>
                            <SfLink
                                class="text-sm font-bold text-black whitespace-nowrap cursor-pointer"
                                :to="node.value.link"
                                :tag="NuxtLink"
                                size="sm"
                            >
                                {{ node.value.label }}
                            </SfLink>
                            <ul class="mt-2">
                                <li v-for="child in node.children" :key="child.key">
                                <SfListItem tag="a" size="sm" :href="child.value.link" class="typography-text-sm py-1.5">
                                    {{ child.value.label }}
                                </SfListItem>
                                </li>
                            </ul>
                        </div>
                    </template>
                </div>
            </li>

        </ul>
    </nav>
</template>