import BlocksBlockSlider from '#layers/directus/components/Blocks/BlockSlider.vue'
import BlocksBlockProducts from '#layers/directus/components/Blocks/BlockProducts.vue'

export default function useBlockRegistry() {

    const blockComponentMap: Record<string, Component> = {
        block_slider: BlocksBlockSlider,
        block_products: BlocksBlockProducts,
    }

    const getBlockComponent = (collection: string) => {
        return blockComponentMap[collection] || null
    }

    return {
        getBlockComponent
    }
}