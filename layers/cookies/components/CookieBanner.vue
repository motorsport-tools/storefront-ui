<script setup lang="ts">
import { 
    SfButton
} from '@storefront-ui/vue'
const {
    manageSetting,
    visible,
    setAllCookiesState,
    changeManageSettingsState,
} = useCookieBar()

const openManageSettings = () => {
    changeManageSettingsState()
}

</script>

<template>
    <LazyUiOverlay
        :isOpen="manageSetting || visible"
        :class="manageSetting ? '!z-[96]' : '!z-[91] !bg-opacity-10 !backdrop-blur-sm'"
    />
    <CookieManagerSidebar
        class="!z-[98]"
    />
    <div v-if="visible" class="fixed bottom-0 left-0 right-0 z-[95]">
        <div class="bg-white p-4 border-t border-gray-200">
            <div class="flex flex-col md:flex-row justify-between lg:narrow-container">
                <div
                    class="pb-6 md:pb-0 md:pr-12"
                >
                    <h2 class="text-xl md:text-lg font-medium pb-2 md:pb-0">{{ $t('cookieBar.about.label') }}</h2>
                    <p class="text-sm text-gray-600 whitespace-pre-line">{{ $t('cookieBar.about.description') }}</p>
                    <SfButton
                        @click="openManageSettings()"
                        variant="tertiary"
                        size="sm"
                        class="!text-gray-600 hover:!bg-transparent hover:!text-gray-600"
                    >
                        {{ $t('cookieBar.about.manageLabel') }}
                    </SfButton>
                </div>
                <div class="flex-shrink-0 flex flex-col justify-around gap-6 md:gap-2 sm:py-2">
                    <SfButton @click="setAllCookiesState(true)"
                        variant="primary"
                        class="">
                        {{ $t('cookieBar.about.acceptLabel') }}
                    </SfButton>
                    <SfButton @click="setAllCookiesState(false)"
                        variant="secondary"
                        size="sm"
                        class="!text-gray-600 !border-gray-600">
                        {{ $t('cookieBar.about.rejectLabel') }}
                    </SfButton>
                    
                </div>
            </div>
        </div>
    </div>
</template>
