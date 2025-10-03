<script lang="ts" setup>
import { useMegaMenuCategories } from '~/layers/core/composable/useMegaMenuCategories'
import { SfIconMenu } from '@storefront-ui/vue'
import Overlay from './ui/Overlay.vue'

const { $viewport } = useNuxtApp()

const props = defineProps({
  headerNavigation: {
    type: Object
  },
  refresh: {
    type: Function,
    required: false,
  }
})

const { loadCategoriesForMegaMenu, categoriesForMegaMenu } = useMegaMenuCategories()

provide(
  "categoriesForMegaMenu",
  categoriesForMegaMenu
)

await loadCategoriesForMegaMenu({ filter: { parent: true }, pageSize: 100 })



const headerRef = ref(null)
const headerNavRef = ref<HTMLElement>()
const categoryMenuRef = ref(null)
const headerSticky = ref<HTMLElement>()
const isHidden = ref(false)
const isFixed = ref(false)
const isMobile = useState(() => $viewport.isLessThan('lg'))

const isOverlayVisible = ref(false)
const isSearchOverlayVisible = ref(false)
const isMenuOpen = ref(false)

const megaMenuClick = (menuType: string[]) => {
  if(categoryMenuRef.value) {
    categoryMenuRef.value.openMenu(menuType)
  }
}

const emit = defineEmits(['navigationReady'])

let lastScroll = 0
let SCROLL_THRESHOLD = 200
let ticking = false
let resizeTimeout: ReturnType<typeof setTimeout>

const handleResize = () => {
    isMobile.value = $viewport.isLessThan('lg')
    ticking = false
}

const handleScroll = () => {
    if(isMobile.value) {
        isFixed.value = false
        isHidden.value = false
        return
    }
    const currentScroll = window.scrollY

    if (currentScroll >= SCROLL_THRESHOLD) {
        isFixed.value = true

        if (currentScroll > lastScroll){
            // Scrolling down
            isHidden.value = true
        } else if (currentScroll < lastScroll) {
            // Scrolling up
            isHidden.value = false
        }

    } else {
        isFixed.value = false
        isHidden.value = false
    }

    lastScroll = currentScroll
    ticking = false
}

const onScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(handleScroll)
    ticking = true
  }
}

const onResize = () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
        handleResize()
    }, 200)
}

const onOpenLoginMenu = () => {
    isMenuOpen.value = true
}

const onCloseLoginMenu = () => {
    isMenuOpen.value = false
}

const onOpenMenu = () => {
    isOverlayVisible.value = true
}
const onCloseMenu = () => {
    isOverlayVisible.value = false
}   

onMounted(async () => {
    if(headerNavRef.value) {
        //emit('navigationReady', headerNavRef.value)
    }
    await nextTick() 
    if (headerSticky.value) {
        SCROLL_THRESHOLD = headerSticky.value.getBoundingClientRect().top + window.scrollY + 20
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onResize, { passive: true })
    }
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    clearTimeout(resizeTimeout)
})
</script>

<template>
    <Overlay :isOpen="isOverlayVisible || isSearchOverlayVisible || isMenuOpen"
        :class="{
            '!z-[91]': isMenuOpen
        }"
    />
    <header
        ref="headerRef"
    >
        <!-- Top Dark Bar -->
        <div class="hidden lg:flex bg-[#222222] h-[36px] max-h-[36px] text-white text-sm px-4 justify-between items-center relative"
        :class="{
            'z-[94]': isMenuOpen
        }"
        >

            <div class="h-full flex items-center justify-center text-xs">
                <UiNavigationBlock
                    ref="headerNavRef"
                    :refresh="refresh"
                    :headerNavigation="headerNavigation"
                />
            </div>
            <div class="h-full flex items-center justify-center">
                <UiAccountButton
                    @onMenuOpen="onOpenLoginMenu"
                    @onMenuClose="onCloseLoginMenu"
                />
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
            ref="headerSticky"
            class="shadow-md"
            :class="[
                'w-full z-[90]',
                isHidden ? '-translate-y-full pointer-events-none' : 'translate-y-0 pointer-events-auto',
                isFixed ? 'fixed top-0 left-0 transition-transform duration-300' : 'relative'
            ]"
        >
            <div 
                class="h-[48px] max-h-[48px] bg-white border-black-500/50 border-b flex flex-row justify-between items-center flex-nowrap px-2 lg:px-4 relative z-[20]"
                
            >
                <button
                    class="lg:hidden h-full block flex justify-center items-center !text-black hover:bg-transparent cursor-pointer pr-2"
                    aria-label="Open menu"
                    title="Open menu"
                    @click="megaMenuClick([])"
                >
                    <SfIconMenu class="text-black" size="base" />
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
                    <UiSearchBar @update-overlay="isSearchOverlayVisible = $event"/>
                </div>
                <div
                    class="h-full flex items-center flex-nowrap"
                >
                    <UiUserNav/>
                </div>    
            </div>

            <div 
                class="hidden lg:flex bg-[#222222] text-white items-center justify-center flex-nowrap relative"
            >
                <UiCategoryMenuDesktop
                    :headerRef="headerSticky"
                    @openMenu="onOpenMenu"
                    @closeMenu="onCloseMenu"
                />
            </div>
        </div>
    </header>
    <UiCategoryMenuMobile
        ref="categoryMenuRef"
    />
</template>