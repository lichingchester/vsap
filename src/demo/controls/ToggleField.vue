<script setup lang="ts">
// Fully-custom switch — role=switch on a button, Space/Enter handled natively.
// `variant` swaps the visual treatment (Terminal explorations); the button
// semantics + a11y stay identical across all four.
withDefaults(
  defineProps<{
    label: string;
    variant?: "switch" | "bracket" | "led" | "checkbox";
  }>(),
  { variant: "switch" },
);
const value = defineModel<boolean>({ required: true });
</script>

<template>
  <div class="ctl ctl-toggle" :data-variant="variant">
    <div class="ctl-head">
      <span class="ctl-label">{{ label }}</span>
      <span class="ctl-value">{{ value ? "on" : "off" }}</span>
    </div>

    <button
      type="button"
      class="ctl-toggle__btn"
      role="switch"
      :aria-checked="value"
      :aria-label="label"
      @click="value = !value"
    >
      <!-- switch: squared slide track + knob -->
      <template v-if="variant === 'switch'">
        <span class="ctl-toggle__switch"><span class="ctl-toggle__knob" /></span>
      </template>

      <!-- bracket: [ ON ] / [ OFF ] mono text -->
      <template v-else-if="variant === 'bracket'">
        <span class="ctl-toggle__bracket">[ {{ value ? "ON" : "OFF" }} ]</span>
      </template>

      <!-- led: status dot + label -->
      <template v-else-if="variant === 'led'">
        <span class="ctl-toggle__led" />
        <span class="ctl-toggle__ledlabel">{{ value ? "ENABLED" : "DISABLED" }}</span>
      </template>

      <!-- checkbox: [x] / [ ] -->
      <template v-else>
        <span class="ctl-toggle__cb">[<span class="ctl-toggle__cbmark">{{ value ? "x" : " " }}</span>]</span>
        <span class="ctl-toggle__cblabel">{{ label }}</span>
      </template>
    </button>
  </div>
</template>
