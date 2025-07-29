<script lang="ts" setup>
import { SfButton } from '@storefront-ui/vue'
import type { Page } from '../shared/types/schema'

interface Props {
  page: Page | null
}
defineProps<Props>()

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

<style>
:global(.directus-visual-editing-overlay.visual-editing-button-class .directus-visual-editing-edit-button) {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	transform: none;
	background: transparent;
}
</style>