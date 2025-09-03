<script lang="ts" setup>
import {
  SfButton,
  SfCheckbox,
  SfChip,
  SfListItem,
  SfRadio,
  SfSelect,
  SfThumbnail,
} from "@storefront-ui/vue";

const emit = defineEmits(["close"]);
const props = defineProps({
  attributes: {
    type: Array,
    required: true,
  },
  categories: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const stockCount = inject("stockCount")

const route = useRoute()
const router = useRouter()
const {
  changeFilters,
  isFilterSelected,
  isStockSelected,
  selectedFilters,
} = useUiHelpers()

const sort = useState("sort", () =>
  route.query?.sort ? String(route.query.sort) : '',
);

const sortBy = computed(() => getSortOptions({ input: { sort: sort.value } }));
const changeSorting = (newSort: string) => {
  sort.value = newSort;
  applyFiltersInstantly()
};
const getSortOptions = (searchData: { input: any }) => ({
  options: sortOptions,
  selected: searchData.input.sort || "popular,DESC",
});

const facets = computed(() => [
  ...props.attributes,
])

const selectPriceFilter = (option: { id: string, label: string, values: string }) => {
  const wasSelected = isPriceFilterSelected(option.values)

  selectedFilters.value = selectedFilters.value.filter(
    (filter: any) => filter.filterName !== 'Price',
  )

  if (!wasSelected) {
    selectedFilters.value.push({
      filterName: 'Price',
      label: option.id,
      id: option.values,
    })
  }

  applyFiltersInstantly()
}

const isPriceFilterSelected = (values: string) => {
  return selectedFilters.value.some(
    (filter: any) => filter.filterName === 'Price' && filter.id === values,
  )
}

const selectFilter = (
  facet: { label: string },
  option: { id: string; value: string; label: string }
) => {
  const alreadySelectedIndex = selectedFilters.value.findIndex(
    (filter: { label: string }) => String(filter.label) === String(option.id)
  );

  if (alreadySelectedIndex !== -1) {
    selectedFilters.value.splice(alreadySelectedIndex, 1);
  } else {
    selectedFilters.value.push({
      filterName: facet?.label,
      label: option?.id,
      id: option?.value,
    })
  }
  applyFiltersInstantly()
}

const selectStockFilter = () => {
  const alreadySelectedIndex = selectedFilters.value.findIndex(
    (filter) => filter.filterName === "Availability"
  );

  if (alreadySelectedIndex !== -1) {
    selectedFilters.value.splice(alreadySelectedIndex, 1);

  } else {
    selectedFilters.value.push({
      filterName: 'Availability',
      label: 'true',
      id: true,
    })
  }

  applyFiltersInstantly()
};

const applyFiltersInstantly = () => {
  const filters = selectedFilters.value.filter((item: any) => {
    return typeof item === "object";
  })
  changeFilters(filters, sort.value)
}

const clearFilters = () => {
  selectedFilters.value = [];
  router.push({ query: {} });
  emit("close");
}
</script>

<template>
  <aside class="w-full lg:max-w-[376px] relative">
    <h5
      class="py-2 px-4 mb-6 bg-neutral-100 typography-headline-6 font-bold text-neutral-900 uppercase tracking-widest md:rounded-md"
    >
      Sort by
    </h5>
    <div class="px-2">
      <SfSelect
        v-model="sortBy.selected"
        placeholder="Select sorting"
        :aria-label="$t('sortBy')"
        @update:model-value="changeSorting"
      >
        <option
          v-for="{ id, value, attrName } in sortBy.options"
          :key="id"
          :selected="sortBy.selected === value"
          :value="value"
        >
          {{ attrName }}
        </option>
      </SfSelect>
    </div>
    <h5
      class="py-2 px-4 mt-6 mb-4 bg-neutral-100 typography-headline-6 font-bold text-neutral-900 uppercase tracking-widest md:rounded-md"
    >
      Filter
    </h5>
    <ul>
      <li
        v-for="(facet, index) in facets"
        :key="index"
        class="mb-6"
      >
        <h6
          class="px-2 py-2 font-medium typography-headline-5 border-b border-neutral-200"
        >
          {{ facet?.label }}
        </h6>

        <div
          v-if="facet.type == 'price'"
          class="mt-4"
        >
          <fieldset id="radio-price">
            <SfListItem
              v-for="(option, index) in facet.options"
              :key="index"
              tag="label"
              @click.prevent="selectPriceFilter(option)"
            >
              <template #prefix>
                <SfRadio
                  :model-value="isPriceFilterSelected(option.values) ? option.values : null"
                  :value="option.values"
                  :name="facet.label"
                  class="flex items-center"
                  :class="{
                    'bg-primary-700 border-primary-700 hover:bg-primary-800':
                      isPriceFilterSelected(option.values),
                  }"
                />
              </template>
              <span
                class="text-sm mr-2 cursor-pointer"
                :class="{
                  'font-medium': isPriceFilterSelected(option.values),
                }"
              >{{ option.label }}
              </span>
            </SfListItem>
          </fieldset>
        </div>

        <ul
          v-if="facet.type === 'select'"
          class="grid grid-cols-2 gap-2 px-3 mt-4"
        >
          <li
            v-for="{ id, value, label, total } in facet.options"
            :key="id"
          >
            <SfChip
              class="w-full"
              size="sm"
              :input-props="{ value }"
              :model-value="isFilterSelected({ id, value })"
              @update:model-value="selectFilter(facet, { id, value, label })"
            >
              <div class="w-full flex justify-center gap-2">
                <span>{{ label }}</span>
                <span class="text-[16px] text-[#808080]">({{ total }})</span>
              </div>
            </SfChip>
          </li>
        </ul>

        <ul
          v-if="facet.type === 'radio'"
          class="grid grid-cols-2 gap-2 px-3 mt-4"
        >
          <li
            v-for="{ id, value, label, total } in facet.options"
            :key="id"
          >
            <SfChip
              class="w-full"
              size="sm"
              :input-props="{ value }"
              :model-value="isFilterSelected({ id, value })"
              @update:model-value="selectFilter(facet, { id, value, label })"
            >
              <div class="w-full flex justify-center gap-2">
                <span>{{ label }}</span>
                <span class="text-[16px] text-[#808080]">({{ total }})</span>
              </div>
            </SfChip>
          </li>
        </ul>

        <div
          v-if="facet.type == 'color'"
          class="mt-4"
        >
          <SfListItem
            v-for="{ id, value, label, htmlColor, total } in facet.options"
            :key="id"
            size="sm"
            tag="label"
            :class="[
              'px-4 bg-transparent hover:bg-transparent',
              {
                'font-medium': isFilterSelected({ id }),
              },
            ]"
            :selected="isFilterSelected({ id })"
          >
            <template #prefix>
              <SfCheckbox
                :value="label"
                class="appearance-none peer hidden"
                :model-value="isFilterSelected({ id })"
                @update:model-value="
                  selectFilter(facet, { id, value, label })
                "
              />
              <span
                class="inline-flex items-center justify-center p-1 transition duration-300 rounded-full cursor-pointer ring-1 ring-neutral-200 ring-inset outline-offset-2 outline-secondary-600 peer-checked:ring-2 peer-checked:ring-primary-700 peer-hover:bg-primary-100 peer-[&:not(:checked):hover]:ring-primary-200 peer-active:bg-primary-200 peer-active:ring-primary-300 peer-disabled:cursor-not-allowed peer-disabled:bg-disabled-100 peer-disabled:opacity-50 peer-disabled:ring-1 peer-disabled:ring-disabled-200 peer-disabled:hover:ring-disabled-200 peer-checked:hover:ring-primary-700 peer-checked:active:ring-primary-700 peer-focus-visible:outline"
              >
                <SfThumbnail
                  size="sm"
                  :style="{ backgroundColor: htmlColor }"
                />
              </span>
            </template>
            <div class="w-full flex justify-between cursor-pointer">
              <span>{{ label }}</span>
              <span class="text-[16px] text-[#808080]">({{ total }})</span>
            </div>
          </SfListItem>
        </div>

        <div 
          v-if="facet.type == 'boolean'"
          class="mt-4"
        >
          <div
            class="flex items-center gap-2 px-4 cursor-pointer"
            :class="{ 'pointer-events-none opacity-50': facet.options?.find(option => option.value === 'true')?.total === 0 }"
          >
            <SfCheckbox
              :model-value="isStockSelected()"
              @update:model-value="selectStockFilter()"
            />
            <div class="w-full flex justify-between">
              <span>{{ facet.label }}</span>
              <span class="text-[16px] text-[#808080]">({{ facet.options?.find(option => option.value === 'true')?.total }})</span>
            </div>
          </div>
        </div>

        <div
          v-if="facet.type == 'in-stock'"
          class="mt-4"
        >
          <div
            class="flex items-center gap-2 px-4 cursor-pointer"
            :class="{ 'pointer-events-none opacity-50': stockCount === 0 }"
          >
            <SfCheckbox
              :model-value="isStockSelected()"
              @update:model-value="selectStockFilter()"
            />
            <div class="w-full flex justify-between">
              <span>In stock</span>
              <span class="text-[16px] text-[#808080]">({{ stockCount }})</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div
      class="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 lg:justify-between px-3 lg:px-0 mt-6"
    >
      <SfButton
        variant="secondary"
        class="w-full mr-3"
        @click="clearFilters"
      >
        {{ $t("clearFilters") }}
      </SfButton>
    </div>
  </aside>
</template>