<script setup lang="ts">
// Text input — the one control whose native element IS the widget; we restyle
// its chrome per skin. Value readout shows length.
defineProps<{ label: string; placeholder?: string }>();
const value = defineModel<string>({ required: true });
</script>

<template>
  <div class="ctl ctl-text">
    <div class="ctl-head">
      <span class="ctl-label">{{ label }}</span>
      <span class="ctl-value">{{ value.length }} ch</span>
    </div>
    <input
      v-model="value"
      type="text"
      class="ctl-text__input"
      :placeholder="placeholder"
      :aria-label="label"
    />
  </div>
</template>
