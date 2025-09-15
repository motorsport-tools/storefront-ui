<script setup lang="ts">
import {
    SfButton
} from "@storefront-ui/vue"

const router = useRouter()
const emit = defineEmits(["close"]);

interface Props {
    selectedFacets: Ref<Record<string, string[]>>
    availableFacets: Ref<ClerkFacets>
    setFacet: (key: string, value: string | number | boolean) => void
}

const props = defineProps<Props>()

const isFacetSelected = (key: string, value: string) => {
    return props.selectedFacets.value[key]?.includes(value) ?? false
}

const clearFilters = () => {
    props.selectedFacets.value = {};
    router.push({ query: {} });
    emit("close");
}
</script>
<template>
    <aside class="hidden lg:block col-span-12 lg:col-span-4 xl:col-span-3">
        <h5
            class="py-2 px-4 mt-0 mb-4 bg-neutral-100 typography-headline-6 font-bold text-neutral-900 uppercase tracking-widest md:rounded-md"
        >
            {{ $t('filters.heading') }}
        </h5>
        <div
            v-if="Object.keys(selectedFacets).length > 0"
            class="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 lg:justify-between px-3 lg:px-0 mt-6 mb-3"
        >
            <SfButton
                variant="secondary"
                class="w-auto mr-3"
                size="sm"
                @click="clearFilters"
            >
                {{ $t("clearFilters") }}
            </SfButton>
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