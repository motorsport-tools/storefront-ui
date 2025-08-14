import BlocksBlockSlider from '#layers/directus/components/Blocks/BlockSlider.vue'
import BlocksBlockProducts from '#layers/directus/components/Blocks/BlockProducts.vue'
import BlocksBlockLunchbox from '#layers/directus/components/Blocks/BlockLunchbox.vue'

export default function useBlockRegistry() {

    const blockComponentMap: Record<string, Component> = {
        block_slider: BlocksBlockSlider,
        block_products: BlocksBlockProducts,
        block_lunchbox: BlocksBlockLunchbox,
    }

    const getBlockComponent = (collection: string) => {
        return blockComponentMap[collection] || null
    }

    return {
        getBlockComponent
    }
}