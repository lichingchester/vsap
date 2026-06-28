<script setup lang="ts">
// tskr/ui control kit — Segmented. role=radiogroup with roving tabindex + arrow
// keys. `block` stretches to full width with equal segments.
import "./controls.css";
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
  <div class="tk-field tk-seg">
    <div class="tk-field__head">
      <span class="tk-label">{{ label }}</span>
      <span class="tk-value">{{ value }}</span>
    </div>
    <div class="tk-seg__group" :class="{ 'is-block': block }" role="radiogroup" :aria-label="label">
      <button
        v-for="(o, i) in options"
        :key="o.value"
        ref="btns"
        type="button"
        class="tk-seg__btn"
        :class="{ 'is-active': value === o.value }"
        role="radio"
        :aria-checked="value === o.value"
        :tabindex="value === o.value ? 0 : -1"
        @click="value = o.value"
        @keydown="onKey($event, i)"
      >
        {{ o.label }}
      </button>
    </div>
  </div>
</template>
