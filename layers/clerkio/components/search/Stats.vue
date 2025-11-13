<script lang="ts" setup>
import { AisStats } from 'vue-instantsearch/vue3/es'
</script>
<template>
  <ais-stats>
    <template #default="{ nbHits, processingTimeMS, query }">
      <p :class="$attrs.class">
        <strong>{{ $t('numberOfProducts', nbHits) }}</strong> {{$t('foundIn')}} {{ processingTimeMS }}ms
      </p>
    </template>
  </ais-stats>
</template>