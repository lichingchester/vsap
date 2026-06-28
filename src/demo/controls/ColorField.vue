<script setup lang="ts">
// Single color control — head + one shared ColorSwatch.
import ColorSwatch from "./ColorSwatch.vue";

defineProps<{ label: string }>();
const value = defineModel<string>({ required: true });
</script>

<template>
  <div class="ctl ctl-color">
    <div class="ctl-head">
      <span class="ctl-label">{{ label }}</span>
      <span class="ctl-value">{{ value.toUpperCase() }}</span>
    </div>
    <div class="ctl-color__row">
      <ColorSwatch v-model="value" :aria-label="label" />
    </div>
  </div>
</template>
