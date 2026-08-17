<script>
import { connectHits } from 'instantsearch.js/es/connectors'
import { createWidgetMixin } from 'vue-instantsearch/vue3/es'

export default {
  name: 'HitsProvider',
  mixins: [
    createWidgetMixin({ connector: connectHits }),
  ],
  provide() {
    return {
      'ais-hits': computed(() => this.state?.hits ?? [])
    }
  },
}
</script>

<template>
  <slot />
</template>