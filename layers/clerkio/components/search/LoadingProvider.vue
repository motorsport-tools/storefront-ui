<script setup lang="ts">
import { type PropType, type ConcreteComponent, computed, toRefs } from 'vue'
const props = defineProps({
    tag: {
        type: [String, Object] as PropType<string | ConcreteComponent>,
        default: undefined,
    }
})

const { tag } = toRefs(props)

const tagWithDefaults = computed(() => tag?.value || 'div')
</script>
<script lang="ts">
import { createWidgetMixin } from 'vue-instantsearch/vue3/es'

const connectSearchMetaData =
  (renderFn: Function, unmountFn: Function) =>
    (widgetParams = {}) => ({
      init () {
        renderFn({ searchMetadata: {} }, true)
      },

      render ({ searchMetadata }) {
        renderFn({ searchMetadata }, false)
      },

      dispose () {
        unmountFn()
      }
    })

export default {
    name: 'LoadingProvider',
    mixins: [
        createWidgetMixin({ connector: connectSearchMetaData }),
    ],
}
</script>
<template>
    <component
        v-if="state"
        :is="tagWithDefaults"
        :class="$attrs.class"
    >
        <slot name="default" :is-search-stalled="state.searchMetadata.isSearchStalled" />
    </component>
</template>