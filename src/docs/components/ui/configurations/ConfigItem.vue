<script setup lang="ts">
defineProps({
  name: String,
});
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <div class="font-semibold">{{ name }}</div>
    <slot />
  </div>
</template>
