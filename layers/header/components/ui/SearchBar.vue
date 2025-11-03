<script lang="ts" setup>
import {
    SfButton,
    SfLoaderCircular,
    useDisclosure,
    useDropdown
} from '@storefront-ui/vue'
import SearchList from '~/layers/clerkio/components/SearchList.vue'
import { offset } from '@floating-ui/vue'

const emit = defineEmits(['update-overlay'])
const route = useRoute()
const formSearchTemplateRef = ref(null)
const searchInputRef = ref<HTMLElement>()
const isTrapper = ref(false)

const { 
    searchInputValue,
    omniResults,
    loading,
    showInstantSearch,
    enterPress,
    omniSearch,
} = useClerkOmniSearch(formSearchTemplateRef)

const { close, open } = useDisclosure()

const { floatingRef, style } = useDropdown({
    isOpen: showInstantSearch,
    onClose: close,
    placement: 'bottom-start',
    referenceRef: formSearchTemplateRef,
    middleware: [offset(4)],
})

const focusInput = () => {
    const inputEl = unrefElement(searchInputRef)?.querySelector('input');
    inputEl?.focus();
}

const reset = () => {
    searchInputValue.value = ''
    showInstantSearch.value = false
    close()
    focusInput()
}

onClickOutside(formSearchTemplateRef, () => {
  //reset()
})

const engageTrap = () => {
    if(showInstantSearch.value) isTrapper.value = true
}

const handleInputKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        reset()
    }
    if(e.key === 'ArrowDown') {
        open()
        if (showInstantSearch.value) {
            const el = unrefElement(floatingRef)?.querySelector('a')
            el?.focus()
            engageTrap()
        }
    }
    if (e.key === 'Tab') {
        if(!e.shiftKey) {
            const el = unrefElement(floatingRef)?.querySelector<HTMLElement>(
                'a, button, [tabindex]:not([tabindex="-1"])'
            )
            el?.focus()
            engageTrap()
        } else if (e.shiftKey) {
            reset()
        }
    }
}   

const handleKeydown = (e: KeyboardEvent) => {
    if(!isTrapper.value || !floatingRef.value || !showInstantSearch.value) return

    const focusable =  unrefElement(floatingRef)?.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable?.length === 0) return

    const first = focusable?.[0]
    const last = focusable?.[focusable.length - 1]
    const currentIndex = Array.from(focusable ?? []).indexOf(document.activeElement as HTMLElement)

    if (e.key === 'Escape') {
        reset()
    }
    if(e.key ==='ArrowUp') {
        open()
        e.preventDefault()
        const prev = focusable?.[currentIndex - 1] || last
        prev?.focus()
    }
    if(e.key === 'ArrowDown') {
        open()
        e.preventDefault()
        const next = focusable?.[currentIndex + 1] || first
        next?.focus()
    }
    if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault()
            last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault()
            first?.focus()
        }
    }
}

const handleInputEnter = () => {
    enterPress()
    showInstantSearch.value = false
}

watch(showInstantSearch, (val) => {
    document.body.classList.toggle('overflow-hidden', val)
    emit('update-overlay', val)
})

watch(searchInputValue, () => {
    if(searchInputValue.value === '') {
        reset()
        return
    }
})


watch(() => ({ ...route.query }),
    async (query) => {
        searchInputValue.value = query.search ? String(query.search) : ''
    },
    { immediate: true }
)

const {
  isSupported: canVoiceSearch,
  isListening,
  isFinal,
  result,
  start,
  stop,
} = useSpeechRecognition({
    lang: 'en-GB',
    interimResults: true,
    continuous: false,
})


const startVoiceSearch = () => {
    result.value = ''
    start()
}

watch(isListening, isListening => {
    if(!isListening){
        searchInputValue.value = result.value
        omniSearch()
    }
})
watch(result, result => {
    searchInputValue.value = result
    omniSearch()
})
</script>

<template>
    <form
        ref="formSearchTemplateRef"
        role="search"
        class="hidden md:flex flex-[100%] box-border mx-6 relative w-full max-w-lg z-[10]"
        @submit.prevent
    >
        <UiFormCustomSfInput
            id="header-search"
            v-model="searchInputValue"
            type="text"
            class="[&::-webkit-search-cancel-button]:appearance-none"
            :placeholder="$t('searchPlaceholder')"
            wrapper-class="flex-grow pr-0"
            size="sm"
            @input="omniSearch()"
            @keydown.enter.prevent="handleInputEnter"
            @keydown="handleInputKeydown"
            ref="searchInputRef"
            aria-label="Search"
        >
            <template #suffix>
                <span class="flex items-center">
                    <SfButton
                        v-show="canVoiceSearch && !isListening"
                        variant="tertiary"
                        square
                        aria-label="search"
                        :disabled="loading"
                        type="button"
                        class="rounded-l-none hover:bg-transparent active:bg-transparent"
                        @click="startVoiceSearch"
                    >
                        <Icon
                            class="text-black"
                            name="bxs:microphone"
                            size="26px"
                        />
                    </SfButton>
                    <SfButton
                        v-show="canVoiceSearch && isListening"
                        variant="tertiary"
                        square
                        aria-label="search"
                        :disabled="loading"
                        type="button"
                        class="rounded-l-none hover:bg-transparent active:bg-transparent"
                        @click="stop"
                    >
                        <Icon
                            class="text-black"
                            name="bxs:microphone-off"
                            size="26px"
                        />
                    </SfButton>
                    <SfButton
                        variant="tertiary"
                        square
                        aria-label="search"
                        :disabled="loading"
                        type="submit"
                        class="rounded-l-none hover:bg-transparent active:bg-transparent"
                        @click="enterPress"
                    >
                        <Icon
                            class="text-black"
                            name="weui:search-filled"
                            size="26px"
                            
                        />
                    </SfButton>
                </span>
            </template>
        </UiFormCustomSfInput>
        <SearchList 
            v-if="showInstantSearch"
            :query="searchInputValue"
            :results="omniResults"
            ref="floatingRef"
            :style="style"
            @keydown="handleKeydown"
        />
    
    </form>
</template>