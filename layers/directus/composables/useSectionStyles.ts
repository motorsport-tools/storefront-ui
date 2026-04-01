export const useSectionStyles = (sectionData: any) => {
  const { $viewport } = useNuxtApp()
  const img = useImage()

  const resolveUrl = (data: any) => {
    if (!data) return ''
    const filename = typeof data === 'string' ? data : data?.filename_disk
    if (!filename) return ''

    try {
      return img(filename, {}, { provider: 'directus' })
    } catch (e) {
      console.warn('Failed to resolve image URL:', filename, e)
      return ''
    }
  }

  const backgroundImage = computed(() => {
    if (!sectionData) return ''

    const bg = $viewport.isLessThan('lg') && sectionData.backgroundSmall
      ? sectionData.backgroundSmall
      : (sectionData.background || sectionData.background_image)

    return resolveUrl(bg)
  })

  const styleObject = computed(() => {
    if (!sectionData) return {}

    return {
      color: sectionData.color,
      backgroundColor: sectionData.background_color,
      backgroundSize: sectionData.background_size,
      alignItems: sectionData.align_items,
      minHeight: sectionData.min_height,
      justifyContent: sectionData.justify_content,
      borderWidth: sectionData.border_width !== undefined ? `${sectionData.border_width}px` : undefined,
      borderColor: sectionData.border_color,
      borderRadius: sectionData.border_radius !== undefined ? `${sectionData.border_radius}px` : undefined,
      ...(sectionData.full_width ? {} : { marginTop: '2rem', marginBottom: '2rem' }),
      ...(backgroundImage.value ? { backgroundImage: `url('${backgroundImage.value}')` } : {})
    }
  })

  return {
    styleObject,
    backgroundImage
  }
}
