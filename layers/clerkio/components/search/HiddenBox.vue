<script>
import { connectSearchBox } from 'instantsearch.js/es/connectors';
import { createWidgetMixin } from 'vue-instantsearch/vue3/es'

export default {
    name: 'HiddenBox', 
    mixins: [
        createWidgetMixin({ connector: connectSearchBox }) 
    ],
    watch: {
        '$route.query.q'(newQ) {
            if (this.state && typeof this.state.refine === 'function') {
                this.state.refine(newQ || '');
            }
        }
    },
    render() {
        return null;
    }
}
</script>