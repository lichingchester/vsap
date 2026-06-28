<script setup lang="ts">
// Fully-custom segmented control — role=radiogroup with roving tabindex and
// arrow-key navigation (the model native radios give for free).
import { ref } from "vue";

const props = withDefaults(
  defineProps<{
    label: string;
    options: { value: string; label: string }[];
    block?: boolean;
  }>(),
  { block: false },
);
const value = defineModel<string>({ required: true });
const btns = ref<HTMLButtonElement[]>([]);

function select(v: string) {
  value.value = v;
}
function onKey(e: KeyboardEvent, i: number) {
  const n = props.options.length;
  let j = i;
  if (e.key === "ArrowRight" || e.key === "ArrowDown") j = (i + 1) % n;
  else if (e.key === "ArrowLeft" || e.key === "ArrowUp") j = (i - 1 + n) % n;
  else return;
  e.preventDefault();
  value.value = props.options[j].value;
  btns.value[j]?.focus();
}
</script>

<template>
  <div class="ctl ctl-segmented">
    <div class="ctl-head">
      <span class="ctl-label">{{ label }}</span>
      <span class="ctl-value">{{ value }}</span>
    </div>
    <div
      class="ctl-segmented__group"
      :class="{ 'is-block': block }"
      role="radiogroup"
      :aria-label="label"
    >
      <button
        v-for="(o, i) in options"
        :key="o.value"
        ref="btns"
        type="button"
        class="ctl-segmented__seg"
        :class="{ 'is-active': value === o.value }"
        role="radio"
        :aria-checked="value === o.value"
        :tabindex="value === o.value ? 0 : -1"
        @click="select(o.value)"
        @keydown="onKey($event, i)"
      >
        {{ o.label }}
      </button>
    </div>
  </div>
</template>
