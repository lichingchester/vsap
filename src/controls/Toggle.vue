<script setup lang="ts">
// tskr/ui control kit — Toggle (switch). role=switch on a button; Space/Enter
// handled natively. The chosen Terminal direction: squared track + knob.
import "./controls.css";
defineProps<{ label: string }>();
const value = defineModel<boolean>({ required: true });
</script>

<template>
  <div class="tk-field tk-toggle">
    <div class="tk-field__head">
      <span class="tk-label">{{ label }}</span>
      <span class="tk-value">{{ value ? "on" : "off" }}</span>
    </div>
    <button
      type="button"
      class="tk-toggle__btn"
      role="switch"
      :aria-checked="value"
      :aria-label="label"
      @click="value = !value"
    >
      <span class="tk-toggle__switch"><span class="tk-toggle__knob" /></span>
    </button>
  </div>
</template>
