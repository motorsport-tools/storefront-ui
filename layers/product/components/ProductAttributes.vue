<script setup lang="ts">
import {
  SfChip,
  SfLoaderCircular,
} from '@storefront-ui/vue'
import type { LocationQueryRaw } from 'vue-router'

const selectedSize = computed(() =>
  route.query.Size ? Number(route.query.Size) : getAllSizes?.value?.[0]?.value,
)

const selectedColor = computed(() =>
  route.query.Color
    ? Number(route.query.Color)
    : getAllColors?.value?.[0]?.value,
)

const selectedMaterial = computed(() =>
  route.query.Material
    ? Number(route.query.Material)
    : getAllMaterials?.value?.[0]?.value,
)

const updateFilter = async (filter: LocationQueryRaw | undefined) => {
  const query: LocationQueryRaw = {}

  if (selectedMaterial.value && selectedMaterial.value !== 0) {
    query.Material = selectedMaterial.value
  }

  if (selectedColor.value && selectedColor.value !== 0) {
    query.Color = selectedColor.value
  }

  if (selectedSize.value && selectedSize.value !== 0) {
    query.Size = selectedSize.value
  }

  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      query[encodeURIComponent(key)] = value
    })
  }

  await navigateTo({ query })
}
</script>
<template>
    <!-- // Attribue Stuff - Move to own component
    <div
        class="lg:px-4"
        data-testid="product-properties"
    >
        <fieldset
        v-if="getAllSizes && getAllSizes?.length"
        class="pb-4 flex"
        >
            <legend
                class="block mb-2 text-base font-medium leading-6 text-neutral-900"
            >
                Size
            </legend>
            <span
                v-for="{ label, value } in getAllSizes"
                :key="value"
                class="mr-2 mb-2 uppercase"
            >
                <SfChip
                class="min-w-[48px]"
                size="sm"
                :v-model="value"
                :input-props="{
                    onClick: (e) => value == selectedSize && e.preventDefault(),
                }"
                :model-value="value == selectedSize"
                @update:model-value="
                    value != selectedSize
                    && updateFilter({ ['Size']: value.toString() })
                "
                >
                {{ label }}
                </SfChip>
            </span>
        </fieldset>
        <fieldset
            v-if="getAllMaterials && getAllMaterials?.length"
            class="pb-4 flex"
        >
            <legend
                class="block mb-2 text-base font-medium leading-6 text-neutral-900"
            >
                Material
            </legend>
            <span
                v-for="{ label, value } in getAllMaterials"
                :key="value"
                class="mr-2 mb-2 uppercase"
            >
                <SfChip
                class="min-w-[48px]"
                size="sm"
                :v-model="value"
                :input-props="{
                    onClick: (e) =>
                    value == selectedMaterial && e.preventDefault(),
                }"
                :model-value="value == selectedMaterial"
                @update:model-value="
                    value != selectedMaterial
                    && updateFilter({ ['Material']: value.toString() })
                "
                >
                {{ label }}
                </SfChip>
            </span>
        </fieldset>
        <fieldset
        v-if="getAllColors && getAllColors?.length"
        class="pb-2 flex"
        >
        <legend
            class="block mb-2 text-base font-medium leading-6 text-neutral-900"
        >
            Color
        </legend>
        <span
            v-for="{ label, value } in getAllColors"
            :key="value"
            class="mr-2 mb-2 uppercase"
        >
            <SfChip
            class="min-w-[48px]"
            size="sm"
            :v-model="value"
            :input-props="{
                onClick: (e) =>
                value == selectedColor && e.preventDefault(),
            }"
            :model-value="value == selectedColor"
            @update:model-value="
                value != selectedColor
                && updateFilter({ ['Color']: value.toString() })
            "
            >
            <template #prefix>
                <SfThumbnail
                size="sm"
                :style="{ background: label }"
                />
            </template>
            {{ label }}
            </SfChip>
        </span>
        </fieldset>
    </div>
    <UiDivider class="my-4 md:mt-6" />
        -->
</template>