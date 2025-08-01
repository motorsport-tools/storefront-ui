export function useResponsiveBg(src: string) {
    const img = useImage()
    const { breakpoint } = useViewport() 

    // Find matching width for current breakpoint
    const getWidthForBreakpoint = (bp: string) => {
        const screens = {
            'xs': 376,
            'sm': 640,
            'md': 768,
            'lg': 1024,
            'xl': 1280,
            'xxl': 1440,
            '2xl': 1536,
        }

        const entries = Object.entries(screens)
        const index = entries.findIndex(([key]) => key === bp)
        if (index === -1) {
            console.warn(`Breakpoint "${bp}" not found`)
            return 1024
        }
        const next = entries[index + 1]
        return next ? next[1] : entries[index][1]
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