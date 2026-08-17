<script lang="ts" setup>
import generateSeo, { type SeoEntity } from '~/utils/buildSEOHelper'

const props = defineProps<{ category: any }>()

const hits = inject<Ref<any[]>>('ais-hits', ref([]))

const { url: siteUrl } = useSiteConfig()
const { href } = useRequestURL()

useHead(computed(() => {
    if (!props.category?.id) return {}

    const jsonLd = 
        typeof props.category.jsonLd === 'string' 
        ? JSON.parse(props.category.jsonLd)
        : props.category.jsonLd

    const jsonLdMainEntity = {
        "@type": "ItemList",
        "numberOfItems": hits.value.length,
        "itemListElement": hits.value.map((hit: any, i: number) => ({
            "@type": "ListItem",
            "position": i + 1,
            "item": {
                "@type": "Product",
                "name": hit.name,
                "url": `${siteUrl}${hit.slug}`,
                ...(hit.image_slug ? { "image": hit.image_slug } : {}),
                ...(hit.brand ? { "brand": { "@type": "Brand", "name": hit.brand } } : {}),
                ...(hit.sku ? { "sku": hit.sku } : {}),
                "offers": {
                    "@type": "Offer",
                    "priceCurrency": "GBP",
                    "price": hit.pricelist_list_prices[0] ?? hit.list_price,
                    "availability": hit.has_stock
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock"
                }
            }
        }))
    }

    jsonLd.mainEntity = jsonLdMainEntity

    return generateSeo<SeoEntity>(
        { ...props.category, jsonLd },
        'Category'
    )
}))
</script>

<template>
    <slot />
</template>
