<script setup lang="ts">
import type { ProductAttribute } from '~/graphql'

interface Props {
  attributeLines: ProductAttribute[];
}

defineProps<Props>();
</script>

<template>
  <div v-if="attributeLines?.length" class="overflow-x-auto">
    <table class="w-full text-left typography-text-sm">
      <tbody class="divide-y divide-neutral-200">
        <tr
          v-for="(line, index) in attributeLines"
          :key="index"
          class="group hover:bg-neutral-50 transition-colors"
        >
          <td class="py-4 pr-4 font-headings font-semibold text-neutral-900 w-1/3 align-top border-l-2 border-transparent group-hover:border-primary-500 pl-4 transition-all">
            {{ line.attribute }}
          </td>
          <td class="py-4 pl-4 text-neutral-600 align-top typography-text-sm">
            {{ line.values?.join(', ') || '' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else class="py-4 px-4 text-neutral-500 italic">
    {{ $t("productNoSpecifications") || 'This product has no specifications yet' }}
  </div>
</template>
