<script setup lang="ts">
// tskr/ui control kit — ColorList. Repeatable colors: a row of Swatches (each a
// full HSV picker), removable on hover, plus + Add. Clamped to [min, max].
import "./controls.css";
import { Plus, X } from "lucide-vue-next";
import Swatch from "./Swatch.vue";

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
  <div class="tk-field tk-colorlist">
    <div class="tk-field__head">
      <span class="tk-label">{{ label }}</span>
      <span class="tk-value">{{ value.length }} stops</span>
    </div>
    <div class="tk-cl__row">
      <div v-for="(c, i) in value" :key="i" class="tk-cl__item">
        <Swatch v-model="value[i]" :aria-label="`${label} ${i + 1}`" />
        <button
          v-if="value.length > min"
          type="button"
          class="tk-cl__rm"
          :aria-label="`Remove ${label} ${i + 1}`"
          @click="remove(i)"
        >
          <X :size="11" :stroke-width="2.5" />
        </button>
      </div>
      <button
        type="button"
        class="tk-cl__add"
        :disabled="value.length >= max"
        :aria-label="`Add ${label}`"
        @click="add"
      >
        <Plus :size="14" :stroke-width="2.5" />
      </button>
    </div>
  </div>
</template>
