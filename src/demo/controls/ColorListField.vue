<script setup lang="ts">
// Repeatable color list — the hard one. A row of shared ColorSwatch pickers,
// each removable (hover ×), plus + Add. Clamped to [min, max] stops. Icons from
// lucide. Per-swatch v-model writes back into the array by index.
import { Plus, X } from "lucide-vue-next";
import ColorSwatch from "./ColorSwatch.vue";

const props = withDefaults(
  defineProps<{ label: string; min?: number; max?: number }>(),
  { min: 2, max: 8 },
);
const value = defineModel<string[]>({ required: true });

function add() {
  if (value.value.length < props.max) value.value = [...value.value, "#40FFAA"];
}
function remove(i: number) {
  if (value.value.length > props.min)
    value.value = value.value.filter((_, idx) => idx !== i);
}
</script>

<template>
  <div class="ctl ctl-colorlist">
    <div class="ctl-head">
      <span class="ctl-label">{{ label }}</span>
      <span class="ctl-value">{{ value.length }} stops</span>
    </div>
    <div class="ctl-colorlist__row">
      <div v-for="(c, i) in value" :key="i" class="ctl-colorlist__item">
        <ColorSwatch v-model="value[i]" :aria-label="`${label} ${i + 1}`" />
        <button
          v-if="value.length > min"
          type="button"
          class="ctl-colorlist__rm"
          :aria-label="`Remove ${label} ${i + 1}`"
          @click="remove(i)"
        >
          <X :size="11" :stroke-width="2.5" />
        </button>
      </div>
      <button
        type="button"
        class="ctl-colorlist__add"
        :disabled="value.length >= max"
        :aria-label="`Add ${label}`"
        @click="add"
      >
        <Plus :size="14" :stroke-width="2.5" />
      </button>
    </div>
  </div>
</template>
