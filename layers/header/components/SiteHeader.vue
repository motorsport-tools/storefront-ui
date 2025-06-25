<script lang="ts" setup>
import { useMegaMenuCategories } from '~/layers/core/composable/useMegaMenuCategories'
import { SfIconMenu } from '@storefront-ui/vue'

const { loadCategoriesForMegaMenu, categoriesForMegaMenu } = useMegaMenuCategories()

provide(
  "categoriesForMegaMenu",
  categoriesForMegaMenu
)

await loadCategoriesForMegaMenu({ filter: { parent: true }, pageSize: 4 })

const headerRef = ref()
const categoryMenuRef = ref()

onClickOutside(headerRef, () => {
  close()
})

const megaMenuClick = (menuType: string[]) => {
  if(categoryMenuRef.value) {
    categoryMenuRef.value.openMenu(menuType)
  }
}

</script>

<template>
    <header
        ref="headerRef"
        class="relative"
    >
        <!-- Top Dark Bar -->
        <div class="bg-[#222222] h-[36px] max-h-[36px] text-white hover:text-neutral-200 text-sm px-4 flex justify-between items-center">
            <div class="h-full flex items-center justify-center text-xs">
                FAQ | Contact | Order Status
            </div>
            <div class="h-full flex items-center justify-center">
                <NuxtLink
                    tag="a"
                    variant="tertiary"
                    class="h-full block flex items-center hover:bg-transparent !text-white hover:!text-neutral-200 transition cursor-pointer mr-4"
                >
                    <Icon
                        name="flowbite:user-solid"
                        size="20px"
                    />

                    <span class="text-sm">
                        Account
                    </span>
                </NuxtLink>
                <NuxtLink
                    tag="a"
                    variant="tertiary"
                    class="h-full flex items-center hover:bg-transparent !text-white hover:!text-neutral-200 flex align-center transition cursor-pointer"
                >
                    <span class="mr-1 cursor-pointer hover:text-neutral-200 transition">🇬🇧</span>
                    <span class="text-sm">EN</span>
                </NuxtLink>
            </div>
        </div>

        <div 
            class="h-[48px] max-h-[48px] bg-white border-black-500/50 border-b flex flex-row justify-between items-center flex-nowrap gap-4 px-2 lg:px-4"
        >
            <button
                class="lg:hidden h-full block flex justify-center items-center !text-black hover:bg-transparent cursor-pointer"
                @click="megaMenuClick([])"
            >
                <SfIconMenu class="text-black" size="md" />
            </button>
            <NuxtLink 
                to="/"
                aria-label="Motorsport-Tools Homepage"
                class="h-full block w-[250px] flex align-center"
            >
                <Logo />
            </NuxtLink>
            <div class="h-full flex-grow">
                
            </div>
            <div
                class="h-full flex items-center flex-nowrap"
            >
                <UiUserNav/>
            </div>    
        </div>

        <div class="bg-[#222222] text-white flex items-center justify-center flex-nowrap">
            <UiCategoryMenu
                :headerRef="headerRef" ref="categoryMenuRef"
            />
        </div>
    </header>
</template>