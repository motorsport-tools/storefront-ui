<script setup lang="ts">
definePageMeta({
  layout: "default",
  middleware: ["payment"],
})

const route = useRoute()

const { access_token, amount, sale_order_id } = route.query
</script>
<template>
{{ sale_order_id }}<br/>
{{ amount }}<br/>
{{ access_token }}
</template>