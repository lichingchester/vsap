<script setup lang="ts">
/*
 * Detail page. The generalised props playground
 * (from GradientTextPlayground, ADR-0007) — native inputs driven by a snippet's
 * `controls` spec. Edits flow up as plain prop values, which drive both the live
 * preview and the generated Usage code. Includes a Reset to defaults (point 4).
 */
import { computed } from "vue";
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

function colorsOf(prop: string): string[] {
  return (props.values[prop] as string[]) ?? [];
}
function setColor(prop: string, i: number, v: string) {
  const next = [...colorsOf(prop)];
  next[i] = v;
  set(prop, next);
}
function addColor(prop: string) {
  const next = [...colorsOf(prop)];
  if (next.length < 8) set(prop, [...next, "#40ffaa"]);
}
function removeColor(prop: string, i: number) {
  const next = colorsOf(prop).filter((_, j) => j !== i);
  if (next.length >= 2) set(prop, next);
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

    <div v-for="c in controls" :key="c.prop" class="sd-ctl">
      <!-- Colors -->
      <template v-if="c.kind === 'colors'">
        <div class="sd-ctl__row">
          <label class="sd-ctl__label">{{ c.label }}</label>
          <button
            type="button"
            class="sd-ctl__add"
            :disabled="colorsOf(c.prop).length >= 8"
            @click="addColor(c.prop)"
          >
            + Add
          </button>
        </div>
        <div class="sd-swatches">
          <div v-for="(col, i) in colorsOf(c.prop)" :key="i" class="sd-swatch">
            <input
              type="color"
              :value="col"
              :aria-label="`${c.label} ${i + 1}`"
              @input="setColor(c.prop, i, ($event.target as HTMLInputElement).value)"
            />
            <button
              v-if="colorsOf(c.prop).length > 2"
              type="button"
              class="sd-swatch__rm"
              :aria-label="`Remove ${c.label} ${i + 1}`"
              @click="removeColor(c.prop, i)"
            >
              ×
            </button>
          </div>
        </div>
      </template>

      <!-- Range -->
      <template v-else-if="c.kind === 'range'">
        <div class="sd-ctl__row">
          <label class="sd-ctl__label">{{ c.label }}</label>
          <span class="sd-ctl__val">{{ values[c.prop] }}{{ c.unit }}</span>
        </div>
        <input
          type="range"
          :min="c.min"
          :max="c.max"
          :step="c.step"
          :value="values[c.prop] as number"
          class="sd-range"
          @input="set(c.prop, Number(($event.target as HTMLInputElement).value))"
        />
      </template>

      <!-- Toggle -->
      <template v-else-if="c.kind === 'toggle'">
        <label class="sd-ctl__row sd-ctl__toggle">
          <span class="sd-ctl__label">{{ c.label }}</span>
          <input
            type="checkbox"
            :checked="Boolean(values[c.prop])"
            @change="set(c.prop, ($event.target as HTMLInputElement).checked)"
          />
        </label>
      </template>

      <!-- Text -->
      <template v-else>
        <div class="sd-ctl__row">
          <label class="sd-ctl__label">{{ c.label }}</label>
        </div>
        <input
          type="text"
          :value="values[c.prop] as string"
          class="sd-text"
          @input="set(c.prop, ($event.target as HTMLInputElement).value)"
        />
      </template>
    </div>
  </div>
</template>
