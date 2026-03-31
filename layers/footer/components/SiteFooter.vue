<script setup lang="ts">
import {
  SfLink,
} from '@storefront-ui/vue'

interface SocialLink {
  service: string
  url: string
}

interface Globals {
  social_links: SocialLink[]
  organization: string
}

interface Props {
  navigation: Record<string, any>
  refresh?: () => void
  globals: Globals
}

const props = defineProps<Props>()


const socialLinks = computed(() => props.globals?.social_links || [])   
const org = computed(() => props.globals?.organization || {})

const { changeManageSettingsState } = useCookieBar()
const NuxtLink = resolveComponent('NuxtLink')

const openManageSettings = () => {
    changeManageSettingsState()
}
</script>
<template>
    <footer class="pt-10 bg-[#353535]">
        <div
            class="pb-4 grid md:justify-items-center grid-cols-[1fr_1fr] md:grid-cols-[repeat(4,1fr)] narrow-container"
        >
            <nav
                class="flex gap-4 items-center col-span-4 w-full"
            >
                <SfLink
                    v-for="item in navigation?.items"
                    :key="item.id"
                    :tag="NuxtLink"
                    :title="item.title"
                    :to="item.type == 'url' ? item.url : item.page.permalink"
                    class="cursor-pointer !text-gray-400 text-xs no-underline hover:!underline hover:!text-white"
                >
                    {{ item.title }}
                </SfLink>
                <SfLink
                    :tag="NuxtLink"
                    :title="$t('cookieBar.about.cookiePreferences')"
                    @click="openManageSettings()"
                    class="cursor-pointer !text-gray-400 text-xs no-underline hover:!underline hover:!text-white"
                >
                    {{ $t('cookieBar.about.cookiePreferences') }}
                </SfLink>
            </nav>
            <div class="col-span-4 w-full border-t border-neutral-400 mt-5 pt-4">
                <p
                    class="py-2 leading-5 text-left typography-text-xs text-white/50 font-body"
                >
                    Registered in England & Wales. Company registration number: 07387608. VAT no: GB998663927<br/>
                    Copyright &copy; {{ new Date().getFullYear() }} {{ org }} Ltd All rights reserved.
                    <br/>
                    <span class="text-[0.8em]">All Rights Reserved
                    Note: Motorsport Tools UK Ltd. / MST Cars Ltd. Are not authorized or otherwise affiliated with the Ford Motor Company.</span>
                </p>
            </div>
        </div>
        <div class="bg-neutral-900">
            <div
                class="px-4 md:px-6 xl:px-8 xxl:px-0 max-w-[1336px] md:justify-between py-6 md:flex md:py-4 mx-auto"
            >   
                <div class="flex items-center justify-center py-2 gap-x-4 order-2 md:order-1">
                    <NuxtImg
                        src="img/mst-cars-logo-red-white.svg"
                        loading="lazy"
                        width="100"
                        alt="MST Cars Logo"
                    />
                </div>
                
                <div class="flex items-center justify-center py-2 gap-x-4 order-1 md:order-3">
                    <UiSocialLink
                        v-for="{service, url} in socialLinks"
                        :key="service"
                        :url="url"
                        :service="service"
                    />
                </div>
            </div>
        </div>
    </footer>
</template>