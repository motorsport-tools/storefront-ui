<script setup lang="ts">
const { setAttr } = useVisualEditing()

const menuItems = useNuxtApp().payload?.data['site-data']?.headerNavigation
</script>
<template>
    <nav
        v-if="menuItems?.items?.length > 0"
        :data-directus="
			setAttr({ collection: 'navigation', item: menuItems.id, fields: ['items'], mode: 'modal' })
		"
    >
        <ul 
            class="flex items-center flex-row gap-2"
        >
            <li
                v-for="item in menuItems.items"
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