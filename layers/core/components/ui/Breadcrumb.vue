<script setup>
import { SfButton, SfLink, SfIconMoreHoriz, useDropdown } from '@storefront-ui/vue'

const props = defineProps({
  breadcrumbs: {
    type: [Array, String],
    default: () => [],
  },
})

const dropdownOpened = ref(false)

const toggle = () => {
  dropdownOpened.value = !dropdownOpened.value
}

const { referenceRef, floatingRef } = useDropdown({ dropdownOpened, onClose: () => dropdownOpened.value = false })
const NuxtLink = resolveComponent('NuxtLink')

const normalizedBreadcrumbs = computed(() => {
  if (Array.isArray(props.breadcrumbs)) return props.breadcrumbs
  if (typeof props.breadcrumbs === 'string') {
    try {
      return JSON.parse(props.breadcrumbs)
    }
    catch {
      return []
    }
  }
  return []
})

const computedBreadcrumbs = computed(() => {
  const arr = (normalizedBreadcrumbs.value || []).map(item => ({
    ...item,
    name: item.name === 'home' ? 'home' : String(item.name).toLowerCase(),
    link: item.link || item.slug,
  }))
  if (!arr.length) return [{ name: 'home', link: '/' }]
  const first = arr[0]
  if (first.name === 'home' && first.link === '/') return arr
  return [{ name: 'home', link: '/' }, ...arr]
})

</script>

<template>
  <nav data-testid="breadcrumbs" class="inline-flex items-center text-sm font-normal font-body capitalize">
    <ol class="flex w-auto leading-none group md:flex-wrap pl-0">
      <li class="flex items-center sm:hidden text-neutral-500 z-1">
        <div ref="referenceRef" class="w-max z-100">
          <SfButton
            class="relative w-5 h-5 !p-0 rounded-sm outline-secondary-600 hover:bg-transparent active:bg-transparent"
            aria-label="Show more breadcrumbs"
            type="button"
            variant="tertiary"
            square
            data-testid="breadcrumbs-dropdown-button"
            @click="toggle"
          >
            <template #prefix>
              <SfIconMoreHoriz
                size="sm"
                class="text-neutral-500 hover:text-primary-700 active:text-primary-800 active:bg-transparent"
              />
            </template>
          </SfButton>
          <ul v-if="dropdownOpened" ref="floatingRef" class="absolute px-4 py-2 rounded-md shadow-md border-neutral-100 z-100 mb-20 bg-white">
            <li v-for="item in computedBreadcrumbs" :key="item.name" class="py-2 last-of-type:hidden">
              <SfLink
                :tag="NuxtLink"
                :to="item.link"
                variant="secondary"
                class="leading-5 no-underline text-inherit hover:underline active:underline whitespace-nowrap outline-secondary-600"
              >
                {{ item.name }}
              </SfLink>
            </li>
          </ul>
        </div>
      </li>
      <li
        v-for="(item, index) in computedBreadcrumbs"
        :key="item.name"
        class="peer hidden sm:flex items-center peer-[:nth-of-type(even)]:before:content-['/'] peer-[:nth-of-type(even)]:before:px-2 peer-[:nth-of-type(even)]:before:leading-5 last-of-type:flex last-of-type:before:font-normal last-of-type:before:text-neutral-500 text-neutral-500 last-of-type:text-neutral-900 last-of-type:font-medium"
      >
        <SfLink
          v-if="index < computedBreadcrumbs.length - 1"
          :tag="item.link ? NuxtLink : 'div'"
          :to="item.link"
          variant="secondary"
          class="leading-5 no-underline hover:underline active:underline whitespace-nowrap outline-secondary-600 text-inherit"
        >
          {{ item.name }}
        </SfLink>
        <span v-else>
          {{ item.name }}
        </span>
      </li>
    </ol>
  </nav>
</template>
