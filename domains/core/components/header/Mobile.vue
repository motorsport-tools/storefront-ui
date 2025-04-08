<script lang="ts" setup>
import {
  SfButton,
  SfIconMenu,
  useDisclosure,
  useTrapFocus,
} from '@storefront-ui/vue'
import { onClickOutside } from '@vueuse/core'
import { HeaderButtonSearch } from '#components'
import type { Category } from '~/graphql'

const { isOpen, toggle, close } = useDisclosure()

const NuxtLink = resolveComponent('NuxtLink')

const menuRef = ref()
const categoryMenuRef = ref(null)
const drawerRef = ref()
const searchRef = ref()
const showSearchClerkRef = ref()

useTrapFocus(drawerRef, {
  activeState: isOpen,
  arrowKeysUpDown: true,
  initialFocus: 'container',
})

onClickOutside(menuRef, () => {
  close()
})

onClickOutside(searchRef, () => {
  showSearchClerkRef.value = false
})

const megaMenuClick = (menuType: string[]) => {
  if(categoryMenuRef.value) {
    categoryMenuRef.value.openMenu(menuType)
  }
}

</script>

<template>
  <header
    ref="menuRef"
    :class="[
      'text-white h-15 md:h-15 flex z-50 md:sticky md:top-0 md:shadow-md flex-wrap md:flex-nowrap w-full border-0 bg-neutral-800 border-neutral-200 md:z-10',
    ]"
  >
    <div
      class="flex items-center justify-between h-full w-full narrow-container"
      :class="{'justify-start' : $viewport.isGreaterOrEquals('lg')}"
    >
      <div 
        class="flex items-center justify-center bg-primary-700 h-full py-2.5 pr-5 pl-8 skew-x-[-20deg] translate-x-[-40px] border-neutral-300 border-r-[2px] ring-neutral-600 logo-wrapper anti-aliasing"
      >
        <NuxtLink
          to="/"
          aria-label="Sf Homepage"
          class="skew-x-[20deg] anti-aliasing max-w-sm"
        >
          <VsfLogo />
        </NuxtLink>
      </div>
      

      <div class="flex justify-end">
        <HeaderButtonSearch />
        <SfButton
          class="block text-white font-body bg-transparent hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white self-end"
          type="button"
          :aria-haspopup="true"
          :aria-expanded="isOpen"
          variant="tertiary"
          square
          @click="megaMenuClick([])"
        >
          <SfIconMenu class="text-white" />
        </SfButton>
      </div>
    </div>
    <HeaderCategoryMenu :referenceRef="menuRef" ref="categoryMenuRef"/>
  </header>
</template>