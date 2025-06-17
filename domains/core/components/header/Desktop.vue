<script lang="ts" setup>
import {
  SfButton,
  SfDrawer,
  SfInput,
  SfListItem,
  useDisclosure,
  useTrapFocus,
} from '@storefront-ui/vue'
import { onClickOutside } from '@vueuse/core'
import type { Category } from '~/graphql'

const { isOpen, toggle, close } = useDisclosure()

const menuRef = ref()
const drawerRef = ref()
const formSearchTemplateRef = ref(null)

const {
  searchInputValue,
  highlightedIndex,
  search,
  searchHits,
  selectHit,
  enterPress,
  showResultSearch,
} = useSearch(formSearchTemplateRef)

const router = useRouter()
const NuxtLink = resolveComponent("NuxtLink")

const goTo = (slug: string) => {
  close()
  router.push(slug)
};

useTrapFocus(drawerRef, {
  activeState: isOpen,
  arrowKeysUpDown: true,
  initialFocus: 'container',
});

/*
onClickOutside(menuRef, () => {
  close()
})
*/

onClickOutside(formSearchTemplateRef, () => {
  showResultSearch.value = false
})
</script>

<template>
  <div>
    <div
      v-if="isOpen || showResultSearch"
      class="fixed !w-screen !h-screen inset-0 bg-neutral-500 bg-opacity-50 transition-opacity duration-1000 top-index"
    />
    <header
      ref="menuRef"
      class="relative"
    >
      <div
        class="text-white h-15 md:h-15 flex z-50 md:sticky md:top-0 md-shadow-md border-0 bg-neutral-800 border-neutral-200 md:z-10  items-center jfustify-between lg:justify-start h-full w-full"
      >
        <div 
          class="flex items-center justify-center bg-primary-700 h-[60px] py-2.5 pr-5 pl-8 skew-x-[-20deg] translate-x-[-20px] border-neutral-300 border-r-[2px] ring-neutral-600 logo-wrapper anti-aliasing"
        >
          <NuxtLink 
            to="/"
            aria-label="Sf Homepage"
            class="skew-x-[20deg] anti-aliasing"
          >
            <VsfLogo />
          </NuxtLink>
        </div>
        
        <form
           ref="formSearchTemplateRef"
           role="search"
           class="hidden lg:flex flex-[100%] mt-2 md:mt-0 md:ml-10 pb-2 md:pb-0 relative w-full"
           @submit.prevent
         >
           <SfInput
             v-model="searchInputValue"
             type="text"
             class="[&::-webkit-search-cancel-button]:appearance-none"
             placeholder="Search"
             wrapper-class="flex-1 h-10 pr-0"
             size="base"
             @input="search()"
             @keydown.enter.prevent="enterPress"
           >
            <template #suffix>
              <span class="flex items-center">
                <SfButton
                  variant="tertiary"
                  square
                  aria-label="search"
                  type="submit"
                  class="rounded-l-none hover:bg-transparent active:bg-transparent"
                  @click="enterPress"
                >
                  <Icon 
                    name="ion:search"
                    size="20px"
                  />
                </SfButton>
              </span>
            </template>
          </SfInput>

          <transition
            enter-active-class="transform transition duration-500 ease-in-out"
            leave-active-class="transform transition duration-500 ease-in-out"
            enter-from-class="-translate-x-full md:translate-x-0 md:opacity-0"
            enter-to-class="translate-x-0 md:translate-x-0 md:opacity-100"
            leave-from-class="translate-x-0 md:opacity-100"
            leave-to-class="-translate-x-full md:translate-x-0 md:opacity-0"
          >
            <DesktopSearchList
              v-if="showResultSearch"
              :hits="searchHits"
              :search-text="searchInputValue"
              @select="selectHit"
            />
          </transition>
        </form>
        <nav
          class="hidden lg:flex flex-nowrap justify-end items-center md:ml-10 gap-x-1"
          aria-label="SF Navigation"
        >
          <HeaderButtonLogin />
          <HeaderButtonCart />
          <HeaderButtonWishlist />
          
        </nav>
      </div>
      <!--
      <HeaderCategoryMenu :referenceRef="menuRef"/>
      -->
    </header>
  </div>
</template>
