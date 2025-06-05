<script setup lang="ts">
import type { Category } from '~/graphql'
import type { Node as menuNode } from '../../types'
import { SfButton, SfIconChevronRight, useDisclosure, useDropdown, SfListItem, useTrapFocus, SfLink, SfIconClose, SfIconArrowBack, SfCounter, SfDrawer } from '@storefront-ui/vue';

const props = defineProps<{ referenceRef: HTMLElement }>();

const { referenceRef } = toRefs(props)

const categoriesForMegaMenu = inject<Category[]>('categoriesForMegaMenu')
const { close, open, isOpen } = useDisclosure();
const content: menuNode = categoriesForMegaMenu.value

const { floatingRef, style } = useDropdown({
    isOpen,
    onClose: close,
    placement: 'bottom-start',
    middleware: [],
    referenceRef: referenceRef
});

const drawerRef = ref();
const megaMenuRef = ref();
const triggerRefs = ref();
const activeNode = ref<string[]>([]);

const activeMenu = computed(() => findMenuNode(activeNode.value, content));

const trapFocusOptions = {
    activeState: isOpen,
    arrowKeysUpDown: true,
    initialFocus: 'container',
} as const;
useTrapFocus(
    computed(() => megaMenuRef.value?.[0]),
    trapFocusOptions,
)
useTrapFocus(drawerRef, trapFocusOptions);

const openMenu = (menuType: string[]) => {
    activeNode.value = menuType;
    open();
}

defineExpose({
  openMenu
})

const NuxtLink = resolveComponent("NuxtLink");

const goBack = () => {
    activeNode.value = activeNode.value.slice(0, activeNode.value.length - 1);
};

const goNext = (key: string) => {
    activeNode.value = [...activeNode.value, key];
};

const focusTrigger = (index: number) => {
    unrefElement(triggerRefs.value[index]).focus();
};



</script>

<template ref="referenceRef">
    <!-- Desktop dropdown -->
    <nav ref="floatingRef" style="background: #161616;">
        <ul
          class="hidden lg:flex align-center justify-start px-2 text-white border-b border-b-neutral-200 border-b-solid text-sm/3"
          @blur="
            (event) => {
              if (!(event.currentTarget as Element).contains(event.relatedTarget as Element)) {
                close();
              }
            }
          "
        >
            <li
                class=""
            >
                <SfButton
                    class="text-white hover:text-white active:text-white mx-1"
                    variant="tertiary"
                    square
                    style="background: #161616; padding:8px 9px;"
                    aria-label="Open All Categories Menu"
                    aria-expanded="false"
                >
                    <Icon
                        :name="'ion:menu'"
                        size="22px"
                    />
                    <template #suffix>
                        <p class="text-[14px] font-bold">All</p>
                    </template>
                </SfButton>
            </li>
            <li
                v-for="(menuNode, index) in content.children"
                :key="menuNode?.key"
                class="flex flex-col align-center justify-center"
            >
                <SfButton
                    ref="triggerRefs"
                    variant="tertiary"
                    class="group mr-2 !text-white hover:!text-white  active:!text-white text-sm/3"
                    style="background: none; padding:8px 9px;"
                    :tag="NuxtLink"
                    :to="menuNode.value.link"
                    @mouseenter="openMenu([menuNode.key])"
                    
                >
                    <span>{{ menuNode.value.label }}</span>
                    <SfIconChevronRight
                        class="rotate-90 text-neutral-500 group-hover:text-neutral-700 group-active:text-neutral-900"
                    />
                </SfButton>

                <div
                    v-if="isOpen && activeNode.length === 1 && activeNode[0] === menuNode.key"
                    :key="activeMenu.key"
                    ref="megaMenuRef"
                    :style="style"
                    class="hidden bg-neutral-600 lg:grid gap-x-6 grid-cols-4 text-white shadow-lg p-6 left-0 right-0 outline-none lg:z-10"
                    tabindex="0"
                    @mouseleave="close()"
                    @keydown.esc="focusTrigger(index)"
                >
                    <template v-for="node in activeMenu.children" :key="node.key"> 
                        
                        <div>
                            <SfLink
                                class="typography-text-base font-bold text-white whitespace-nowrap px-4 py-1.5 border-b border-b-neutral-200 border-b-solid cursor-pointer"
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
    <!-- Mobile -->
    <div v-if="isOpen" class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[9]" />
    <SfDrawer
        ref="drawerRef"
        v-model="isOpen"
        placement="left"
        class="lg:hidden right-[50px] max-w-[376px] bg-white overflow-y-auto z-10"
    >
        <nav class="text-white">
            <div class="flex items-center justify-between p-4 border-b border-b-neutral-200 border-b-solid bg-neutral-900 relative overflow-x-visible">
                <p class="typography-text-base font-medium">Browse <span class="block font-bold font-headings">Motorsport-Tools</span></p>
                <SfButton 
                    variant="tertiary"
                    square 
                    aria-label="Close menu" 
                    class="fixed top-0 left-[376px] hover:!bg-transparent active:!bg-transparent z-20" 
                    @click="close()"
                >
                <SfIconClose class="text-white" />
                </SfButton>
            </div>
            <ul class="mt-2 mb-6 text-neutral-900">
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
                        <SfCounter class="ml-2">{{ node.value.counter }}</SfCounter>
                    </div>
                    </SfListItem>
                </li>
                <li v-else>
                    <SfListItem size="lg" tag="button" type="button" @click="goNext(node.key)">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center">
                        <p class="text-left">{{ node.value.label }}</p>
                        <SfCounter class="ml-2">{{ node.value.counter }}</SfCounter>
                        </div>
                        <SfIconChevronRight class="text-neutral-500" />
                    </div>
                    </SfListItem>
                </li>
                </template>
            </ul>
        </nav>
    </SfDrawer>

</template>