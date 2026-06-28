<script setup lang="ts">
// tskr/ui control kit — ColorPicker. Single color field: head + Swatch (full
// HSV popover). The head's value readout doubles as the hex display.
import "./controls.css";
import Swatch from "./Swatch.vue";

defineProps<{ label: string }>();
const value = defineModel<string>({ required: true });
</script>

<template>
  <div class="tk-field tk-colorpicker">
    <div class="tk-field__head">
      <span class="tk-label">{{ label }}</span>
      <span class="tk-value">{{ value.toUpperCase() }}</span>
    </div>
    <Swatch v-model="value" :aria-label="label" />
  </div>
</template>
