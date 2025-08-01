<script lang="ts" setup>
import { useMegaMenuCategories } from '~/layers/core/composable/useMegaMenuCategories'
import { SfIconMenu } from '@storefront-ui/vue'
import Overlay from './ui/Overlay.vue'

const props = defineProps({
  navigationRef: {
    type: Object,
    default: () => ref(),
  },
})

const { loadCategoriesForMegaMenu, categoriesForMegaMenu } = useMegaMenuCategories()

provide(
  "categoriesForMegaMenu",
  categoriesForMegaMenu
)

await loadCategoriesForMegaMenu({ filter: { parent: true }, pageSize: 5 })

const headerRef = ref(null)
const headerNavRef = ref<HTMLElement>()
const categoryMenuRef = ref(null)

onClickOutside(headerRef, () => {
  close()
})

const megaMenuClick = (menuType: string[]) => {
  if(categoryMenuRef.value) {
    categoryMenuRef.value.openMenu(menuType)
  }
}

const emit = defineEmits(['navigationReady'])

onMounted(() => {
    if(headerNavRef.value) {
        props.navigationRef.value = headerNavRef.value
        emit('navigationReady', headerNavRef.value)
    }
})

const isOverlayVisible = ref(false)
</script>

<template>
    <Overlay :isOpen="isOverlayVisible"/>
    <header
        ref="headerRef"
        class="relative"
    >
        <!-- Top Dark Bar -->
        <div class="bg-[#222222] h-[36px] max-h-[36px] text-white hover:text-neutral-200 text-sm px-4 flex justify-between items-center relative z-[20]">
            <div class="h-full flex items-center justify-center text-xs">
                <nav
                    ref="headerNavRef"
                >
                FAQ | Contact | Order Status
                </nav>
            </div>
            <div class="h-full flex items-center justify-center">
                <NuxtLink
                    variant="tertiary"
                    class="h-full block flex items-center hover:bg-transparent !text-white hover:!text-neutral-200 transition cursor-pointer mr-4"
                    to="/login"
                >
                    <Icon
                        name="flowbite:user-solid"
                        size="20px"
                    />

                    <span class="text-sm">
                        Account
                    </span>
                </NuxtLink>
                <button
                    variant="tertiary"
                    class="h-full flex items-center hover:bg-transparent !text-white hover:!text-neutral-200 flex align-center transition cursor-pointer"
                >
                    <span class="mr-1 cursor-pointer hover:text-neutral-200 transition">                        
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30" class="w-5 h-auto">
                            <clipPath id="t">
                                <path d="M25,15h25v15zv15h-25zh-25v-15zv-15h25z"/>
                            </clipPath>
                            <path d="M0,0v30h50v-30z" fill="#012169"/>
                            <path d="M0,0 50,30M50,0 0,30" stroke="#fff" stroke-width="6"/>
                            <path d="M0,0 50,30M50,0 0,30" clip-path="url(#t)" stroke="#C8102E" stroke-width="4"/>
                            <path d="M-1 11h22v-12h8v12h22v8h-22v12h-8v-12h-22z" fill="#C8102E" stroke="#FFF" stroke-width="2"/>
                        </svg>
                    </span>
                    <span class="text-sm">EN</span>
                </button>
            </div>
        </div>

        <div 
            class="h-[48px] max-h-[48px] bg-white border-black-500/50 border-b flex flex-row justify-between items-center flex-nowrap px-2 lg:px-4 relative z-[20]"
        >
            <button
                class="lg:hidden h-full block flex justify-center items-center !text-black hover:bg-transparent cursor-pointer pr-2"
                aria-label="Open menu"
                title="Open menu"
                @click="megaMenuClick([])"
            >
                <SfIconMenu class="text-black" size="md" />
            </button>
            <NuxtLink 
                to="/"
                aria-label="Motorsport-Tools Homepage"
                class="h-full block w-[250px] flex align-center pr-2"
            >
                <Logo />
            </NuxtLink>
            <div class="h-full flex-grow flex justify-end md:items-center md:justify-center">
                <UiUserNavButton
                    title="Search"
                    class="md:hidden"
                >
                    <Icon
                        name="weui:search-filled"
                        size="26px"
                    />
                </UiUserNavButton>
                <UiSearchBar @update-overlay="isOverlayVisible = $event"/>
            </div>
            <div
                class="h-full flex items-center flex-nowrap"
            >
                <UiUserNav/>
            </div>    
        </div>

        <div class="bg-[#222222] text-white flex items-center justify-center flex-nowrap relative">
            <UiCategoryMenu
                :headerRef="headerRef" ref="categoryMenuRef"
            />
        </div>
    </header>
</template>