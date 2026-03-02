<script setup lang="ts">
import {
    SfCheckbox,
    SfDrawer,
    SfLink,
    SfButton,
    useTrapFocus, 
} from '@storefront-ui/vue'

const {
    cookieGroups,
    manageSetting,
    setConsent,
    setAllCookiesState,
} = useCookieBar()

const essentialIndex = useRuntimeConfig().public.essentialCookiesIndex

const cookieDrawerRef = ref<HTMLElement | undefined>(undefined)
useTrapFocus(cookieDrawerRef, { activeState: manageSetting })


const NuxtLink = resolveComponent('NuxtLink')
const localePath = useLocalePath()

const privacyPolicy = computed(() => localePath('/privacy-policy'))

const triggerGroupConsent = (group: CookieGroup) => {
    group.cookies.forEach((cookie: Cookie) => {
        cookie.accepted = group.accepted;
    })
}

const triggerCookieConsent = (group: CookieGroup) => {
    group.accepted = group.cookies.some((cookie: Cookie) => cookie.accepted)
}

const getCookiePropertyValue = (cookie: Cookie, propertyKey: string) => {
    return cookie[propertyKey as keyof Cookie]?.toString() || '';
}
</script>

<template>
    <transition
        enter-active-class="transition duration-500 ease-in-out"
        leave-active-class="transition duration-500 ease-in-out"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
    >
        <SfDrawer
            v-model="manageSetting"
            :open-direction="'left'"
            :disableEsc="true"
            :disableClickAway="true"
            class="shadow-none z-[100] w-full max-w-[500px] bg-white"
        >
            <div ref="cookieDrawerRef" class="flex flex-col h-full">
                <div class="bg-[#353535] text-white p-4 mb-4 flex justify-between items-center">
                    <span class="font-bold text-lg">{{ $t('cookieBar.manageSettings.label') }}</span>
                </div>
                <div class="px-4">
                    <p class="text-sm whitespace-pre-line">{{ $t('cookieBar.manageSettings.description') }}</p>
                </div>
                <div v-if="cookieGroups" class="flex gap-0 flex-col mt-2 p-4 overflow-y-scroll">
                    <template v-for="(cookieGroup, groupIndex) in cookieGroups" :key="groupIndex">
                        <div 
                            v-if="cookieGroup?.cookies?.length"
                        >
                            <div class="bg-gray-100 p-4 mb-4 rounded-md">
                                <div class="flex items-center space-x-2">
                                    <SfCheckbox
                                        :id="$t(cookieGroup.name)"
                                        v-model="cookieGroup.accepted"
                                        :disabled="groupIndex === essentialIndex"
                                        @update:model-value="triggerGroupConsent(cookieGroup)"
                                    />
                                    <label 
                                        :for="$t(cookieGroup.name)" class="text-gray-800 cursor-pointer peer-disabled:text-disabled-900">
                                        {{ $t(cookieGroup.name) }}
                                    </label>
                                </div>
                                <div class="leading-4 mt-2 text-xs">
                                    {{ $t(cookieGroup.description) }}
                                </div>
                                <div v-if="Boolean(cookieGroup.showMore)">
                                    <div v-for="(cookie, cookieIndex) in cookieGroup.cookies" :key="cookieIndex" class="mb-4">
                                        <div class="flex items-center p-2 my-1 bg-white">
                                            <SfCheckbox
                                                :id="cookie.name"
                                                v-model="cookie.accepted"
                                                class="ml-1"
                                                :disabled="groupIndex === essentialIndex"
                                                @update:model-value="triggerCookieConsent(cookieGroup)"
                                            />
                                            <label 
                                                :for="cookie.name" 
                                                class="ml-2 font-medium cursor-pointer peer-disabled:text-disabled-900"
                                            >
                                                {{ $t(cookie.name) }}
                                            </label>
                                        </div>
                                        <div v-for="propKey in Object.keys(cookie)" :key="propKey">
                                            <div
                                                v-if="propKey !== 'name' && propKey !== 'accepted' && propKey !== 'cookieNames'"
                                                class="flex p-2 mb-1 bg-white"
                                            >
                                                <div class="w-1/4 break-words mr-2">
                                                    {{ $t(`cookieBar.keys.${propKey}`) }}
                                                </div>
                                                <div class="w-3/4 break-words text-sm">
                                                    <template v-if="propKey === 'privacyPolicy'">
                                                        <SfLink
                                                            v-if="(cookie[propKey] as string).startsWith('http')"
                                                            :tag="NuxtLink"
                                                            target="_blank"
                                                            :to="cookie[propKey]"
                                                        >
                                                            {{ $t('cookieBar.privacyPolicy') }}
                                                        </SfLink>
                                                        <SfLink v-else  
                                                            :tag="NuxtLink" 
                                                            :to="privacyPolicy"
                                                        >
                                                            {{ $t('cookieBar.privacyPolicy') }}
                                                        </SfLink>
                                                    </template>
                                                    <template
                                                        v-else-if="getCookiePropertyValue(cookie, propKey)"
                                                    >
                                                        {{
                                                            getCookiePropertyValue(cookie, propKey).startsWith('cookieBar.')
                                                            ? $t(getCookiePropertyValue(cookie, propKey))
                                                            : getCookiePropertyValue(cookie, propKey)
                                                        }}
                                                    </template>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <SfLink
                                    tag="button"
                                    size="sm"
                                    class="text-primary hover:underline cursor-pointer text-xs text-blue-700"
                                    @click="cookieGroup.showMore = !cookieGroup.showMore"
                                >
                                    {{ cookieGroup.showMore ? $t('cookieBar.manageSettings.showLess') : $t('cookieBar.manageSettings.showMore') }}
                                </SfLink>
                            </div>
                        </div>
                    </template>
                </div>
                <div class="flex flex-col gap-4 p-4">
                    <SfButton
                        class="w-full h-10 md:h-12"
                        :aria-disabled="false"
                        type="button"
                        :aria-label="$t('cookieBar.about.acceptLabel')"
                        data-testid="cookie-bar-accept-all"
                        @click="setAllCookiesState(true)"
                    >
                        {{ $t('cookieBar.about.acceptLabel') }}
                    </SfButton>
                    <SfButton
                        class="w-full h-10 md:h-12"
                        :aria-disabled="false"
                        type="button"
                        variant="secondary"
                        :aria-label="$t('cookieBar.about.rejectLabel')"
                        @click="setAllCookiesState(false)"
                    >
                        {{ $t('cookieBar.about.rejectLabel') }}
                    </SfButton>
                    <SfButton
                        variant="tertiary"
                        class="w-full h-10 md:h-12"
                        :aria-disabled="false"
                        type="button"
                        :aria-label="$t('cookieBar.about.acceptSelectionLabel')"
                        @click="setConsent()"
                    >
                        {{ $t('cookieBar.about.acceptSelectionLabel') }}
                    </SfButton>
                </div>
            </div>
        </SfDrawer>
    </transition>
</template>