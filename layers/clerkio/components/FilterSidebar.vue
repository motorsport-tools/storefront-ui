<script setup lang="ts">
const router = useRouter()
const emit = defineEmits(["close"]);

interface Props {
    selectedFacets: Ref<Record<string, string[]>>
    availableFacets: Ref<ClerkFacets>
    setFacet: (key: string, value: string | number | boolean) => void
    filterCount: number
}

const props = defineProps<Props>()

const clearFilters = () => {
    props.selectedFacets.value = {};
    router.push({ query: {} });
    emit("close");
}
</script>
<template>
    <aside >
        <div class="flex flex-row py-2 px-4 mt-0 mb-4 bg-neutral-100 md:rounded-md items-center justify-between">
            <h5
                class="typography-headline-6 font-bold text-neutral-900 uppercase tracking-widest"
            >
                {{ $t('filters.heading') }}
            </h5>
            <UiUserNavButton
                v-if="filterCount > 0"
                class="w-auto mr-3 text-sm"
                @click="clearFilters"
            >
                <span class="underline mr-1">{{ $t("filters.clearFilters" ) }}</span> ({{ filterCount }})
            </UiUserNavButton>
        </div>
        <div v-for="(facet, index) in availableFacets" :key="index">
            <h4>{{ $t(`filters.${index}`) }}</h4>
            <div v-for="val in facet" :key="val.v">
                <label>
                    <input
                        type="checkbox"
                        :checked="selectedFacets[index]?.includes(val.v)"
                        @change="setFacet(index, val.v)"
                    />
                    {{ val.v }} ({{ val.c }})
                </label>
            </div>
        </div>
    </aside>
</template>