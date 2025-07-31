import type { ProviderGetImage } from '@nuxt/image';

export const getImage: ProviderGetImage = (src: string, { modifiers }, ctx) => {
    const baseURL = useRuntimeConfig().public.directusUrl

    const url = new URL(src, baseURL)
    
    if(modifiers?.width) {
        url.searchParams.set('width', String(modifiers.width))
    }
    if(modifiers?.height) {
        url.searchParams.set('height', String(modifiers.height))
    }
    if(modifiers?.quality) {
        url.searchParams.set('quality', String(modifiers.quality))
    }
    if(modifiers?.format) {
        url.searchParams.set('format', String(modifiers.format))
    }
  
    return {
        url: url.toString()
    }
}