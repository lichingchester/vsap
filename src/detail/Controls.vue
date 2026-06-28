<script setup lang="ts">
/*
 * Detail page. The props playground — now built from the custom "Terminal"
 * control kit (src/controls, ADR-0010) instead of native inputs, so the fields
 * match the site chrome. Each control maps a snippet `controls` spec to a kit
 * widget; edits flow up as plain prop values, which drive both the live preview
 * and the generated Usage code (props→code). Reset returns to defaults.
 */
import { computed } from "vue";
import { ColorList, Slider, Toggle, TextField } from "../controls";
import type { ControlSpec } from "../snippets/types";

const props = defineProps<{
  controls: ControlSpec[];
  values: Record<string, unknown>;
}>();
const emit = defineEmits<{
  (e: "update", values: Record<string, unknown>): void;
  (e: "reset"): void;
}>();

function set(prop: string, value: unknown) {
  emit("update", { ...props.values, [prop]: value });
}

const hasControls = computed(() => props.controls.length > 0);
</script>

<template>
  <div v-if="hasControls" class="sd-controls">
    <div class="sd-controls__head">
      <span class="sd-controls__title">Props</span>
      <button type="button" class="sd-controls__reset" @click="emit('reset')">
        Reset
      </button>
    </div>

    <template v-for="c in controls" :key="c.prop">
      <ColorList
        v-if="c.kind === 'colors'"
        :model-value="(values[c.prop] as string[])"
        :label="c.label"
        @update:model-value="set(c.prop, $event)"
      />
      <Slider
        v-else-if="c.kind === 'range'"
        :model-value="(values[c.prop] as number)"
        :label="c.label"
        :min="c.min"
        :max="c.max"
        :step="c.step"
        :unit="c.unit"
        @update:model-value="set(c.prop, $event)"
      />
      <Toggle
        v-else-if="c.kind === 'toggle'"
        :model-value="Boolean(values[c.prop])"
        :label="c.label"
        @update:model-value="set(c.prop, $event)"
      />
      <TextField
        v-else
        :model-value="(values[c.prop] as string)"
        :label="c.label"
        @update:model-value="set(c.prop, $event)"
      />
    </template>
  </div>
</template>
