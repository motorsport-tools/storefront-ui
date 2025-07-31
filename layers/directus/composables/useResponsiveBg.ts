export function useResponsiveBg(src: string) {
    const img = useImage()
    const { breakpoint } = useViewport() 

    // Nuxt image screens from runtime config
    const screens = {
        'xs': 376,
        'sm': 640,
        'md': 768,
        'lg': 1024,
        'xl': 1280,
        'xxl': 1440,
        '2xl': 1536,
    }

    // Find matching width for current breakpoint
    const getWidthForBreakpoint = (bp: string) => {
        const keys = Object.keys(screens)
        const currentIndex = keys.indexOf(bp)
        if (currentIndex === -1) return 1024
        const nextKey = keys[currentIndex + 1]
        return nextKey ? screens[nextKey] : screens[bp]
    }

    // reactive width
    const width = ref(getWidthForBreakpoint(breakpoint.value))

    // computed url for current viewport width
    const responsiveUrl = computed(() => 
        img.getImage(`/assets/${src}?format=webp&width=${width.value}&quality=70`, {
            provider: 'directus'
        })
    )

    // reactive inline style string
    const bgStyle = computed(() => `background-image: url('${responsiveUrl.value.url}'); background-size: cover; background-position: center;`)

    return { bgStyle, url: responsiveUrl.value.url, width: width.value }
}