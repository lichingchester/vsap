<script setup lang="ts">
// tskr/ui control kit — TextField. Native input, kit-styled chrome.
import "./controls.css";
defineProps<{ label: string; placeholder?: string }>();
const value = defineModel<string>({ required: true });
</script>

<template>
  <div class="tk-field tk-textfield">
    <div class="tk-field__head">
      <span class="tk-label">{{ label }}</span>
      <span class="tk-value">{{ value.length }} ch</span>
    </div>
    <input
      v-model="value"
      type="text"
      class="tk-text"
      :placeholder="placeholder"
      :aria-label="label"
    />
  </div>
</template>
