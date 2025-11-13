<script>
import { connectSearchBox } from 'instantsearch.js/es/connectors';
import { createWidgetMixin } from 'vue-instantsearch/vue3/es'

export default { mixins: [
    createWidgetMixin({ connector: connectSearchBox }) 
], }
</script>