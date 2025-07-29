import BlocksBlockSlider from '#layers/directus/components/Blocks/BlockSlider.vue'

export default function useBlockRegistry() {

    const blockComponentMap: Record<string, Component> = {
        block_slider: BlocksBlockSlider,
    }

    const getBlockComponent = (collection: string) => {
        return blockComponentMap[collection] || null
    }

    return {
        getBlockComponent
    }
}