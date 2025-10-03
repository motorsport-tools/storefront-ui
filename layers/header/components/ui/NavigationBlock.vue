<script setup lang="ts">
const props = defineProps({
  headerNavigation: {
    type: Object
  },
  refresh: {
    type: Function,
    required: false,
  }
})
const navigationMenuRef = ref<HTMLElement>()
const { isVisualEditingEnabled, setAttr, apply } = useVisualEditing()

onMounted(async () => {
    if(!isVisualEditingEnabled) return
    apply({
        elements: [ navigationMenuRef.value as HTMLElement ],
        onSaved: async () => {
            if(props.refresh) {
                await props.refresh()
            }
        }
    })
})
</script>
<template>
    <nav
        ref="navigationMenuRef"
        v-if="headerNavigation?.items?.length > 0"
        :data-directus="
			setAttr({ collection: 'navigation', item: headerNavigation?.id, fields: ['items'], mode: 'modal' })
		"
    >
        <ul 
            class="flex items-center flex-row gap-2"
        >
            <li
                v-for="item in headerNavigation?.items"
                class="pr-2 border-r border-neutral-300 last:border-0 hover:text-neutral-200"
            >
                <NuxtLink
                    :title="item.title"
                    :to="item.type == 'url' ? item.url : item.page.slug"
                >
                    {{ item.title }}
                </NuxtLink>
            </li>
        </ul>
    </nav>
</template>