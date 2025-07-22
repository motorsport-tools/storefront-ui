<script lang="ts" setup>
import { SfButton } from '@storefront-ui/vue'

defineProps({
  page: Object,
})

const { isVisualEditingEnabled, setAttr } = useVisualEditing()
</script>
<template>
    <div
    v-if="isVisualEditingEnabled && page"
    class="fixed z-50 w-full bottom-4 left-0 right-0 p-4 flex justify-center items-center gap-2"
	>
        <SfButton
        id="visual-editing-button"
        variant="primary"
        :data-directus="
            setAttr({ collection: 'Pages', item: page.id, fields: ['sections'], mode: 'modal' })
        "
        >
			<Icon name="lucide:pencil" />
			Edit All Blocks
		</SfButton>
	</div>
</template>