import BlocksBlockSlider from '#layers/directus/components/Blocks/BlockSlider.vue'
import BlocksBlockProducts from '#layers/directus/components/Blocks/BlockProducts.vue'
import BlocksBlockLunchbox from '#layers/directus/components/Blocks/BlockLunchbox.vue'
import BlocksBlockGrid from '#layers/directus/components/Blocks/BlockGrid.vue'
import BlocksBlockRichText from '#layers/directus/components/Blocks/BlockRichText.vue'
import BlocksBlockImage from '#layers/directus/components/Blocks/BlockImage.vue'
import BlocksBlockButton from '#layers/directus/components/Blocks/BlockButton.vue'

export default function useBlockRegistry() {

    const blockComponentMap: Record<string, Component> = {
        block_slider: BlocksBlockSlider,
        block_products: BlocksBlockProducts,
        block_lunchbox: BlocksBlockLunchbox,
        block_grid: BlocksBlockGrid,
        block_richtext: BlocksBlockRichText,
        block_image: BlocksBlockImage,
        block_button: BlocksBlockButton
    }

    const getBlockComponent = (collection: string) => {
        return blockComponentMap[collection] || null
    }

    return {
        getBlockComponent
    }
}