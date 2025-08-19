<script setup lang="ts">
import {
  SfIconContactSupport,
  SfIconFacebook,
  SfIconHelp,
  SfIconInstagram,
  SfIconCall,
  SfIconTwitter,
  SfIconYoutube,
  SfButton,
  SfLink,
  SfListItem,
} from '@storefront-ui/vue'

interface Props {
    navigation:{
        type: Object,
    },
    globals: {
        type: Object,
        social_links: Array<{
            service: string,
            url: string
        }>,
        organization: string
    }
}

const props = defineProps<Props>()


const socialLinks = computed(() => props.globals?.social_links || [])   
const org = computed(() => props.globals?.organization || {})
</script>
<template>
    <footer class="pt-10 bg-neutral-100">
        <div
            class="grid md:justify-items-center grid-cols-[1fr_1fr] md:grid-cols-[repeat(4,1fr)] narrow-container"
        >

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
                    />
                </div>
                <p
                    class="flex items-center justify-center py-2 leading-5 text-center typography-text-sm text-white/50 font-body md:ml-6 order-3 md:order-2"
                >
                    &copy; {{ new Date().getFullYear() }} {{ org }}
                </p>
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