import { h, defineComponent } from 'vue'
import { SfButton } from '@storefront-ui/vue'


export default defineComponent({
  name: 'SfButtonErrorWrapper',
  props: SfButton.props,
  setup(props, { slots, emit, attrs }) {
    return () => {
      try {
        return h(SfButton, { ...props, ...attrs }, slots)
      } catch (err) {
        // Log the error and props that caused it
        console.error('SfButton render error:', err)
        console.error('Props causing error:', props)
        return h('div', { style: { color: 'red' } }, 'SfButton render error, check console')
      }
    }
  }
})