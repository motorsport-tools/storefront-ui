<script setup lang="ts">
import { IconsLinkedIn, IconsTikTok } from '#components';
import { 
    SfButton,
    SfIconFacebook,
    SfIconInstagram,
    SfIconTwitter,
    SfIconYoutube,
} from '@storefront-ui/vue'

interface Props {
  url: string
  service: string
}

const props = defineProps<Props>()
const { url, service } = props

const icon = computed(() => {
  switch (service) {
    case 'facebook':
        return SfIconFacebook
    case 'instagram':
        return SfIconInstagram
    case 'linkedin':
        return IconsLinkedIn
    case 'x':
        return SfIconTwitter
    case 'youtube':
        return SfIconYoutube
    case 'tiktok':
        return IconsTikTok
  }
})  
</script>
<template>
    <SfButton
        :key="service"
        tag="a"
        square
        variant="tertiary"
        class="text-white active:text-white hover:text-white hover:!bg-neutral-500 active:!bg-transparent"
        :href="url"
        :aria-label="`Go to ${service} page`"
        target="_blank"
        rel="nofollow"
    >
        <component
            :is="icon"
            loading="lazy"
            size="20px"
        />
    </SfButton>
</template>