<script setup lang="ts">
// Shared swatch + custom color popover, used standalone (ColorField) and
// repeated (ColorListField). Fully-custom picker: a preset palette grid + a
// validated hex field (no native <input type=color> popover). Esc/outside-click
// close via usePopover. Deliberately not a 2D HSV canvas — the demo explores
// control *chrome*, and palette+hex stays reliable and on-theme.
import { ref, watch } from "vue";
import { usePopover } from "../usePopover";

const props = defineProps<{ ariaLabel: string }>();
const model = defineModel<string>({ required: true });

const trigger = ref<HTMLElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const { open, toggle } = usePopover(trigger, panel);

// Curated, on-theme palette (amber/violet/teal family + neutrals).
const presets = [
  "#F5B544", "#FFC65A", "#FF7A45", "#FF4D6D",
  "#9C40FF", "#6C5CE7", "#40A9FF", "#40FFAA",
  "#36D399", "#F4F4F5", "#8A8A93", "#0E0E11",
];

const draft = ref(model.value);
watch(model, (v) => (draft.value = v));

const HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
function commitHex() {
  if (HEX.test(draft.value)) model.value = draft.value.toUpperCase();
  else draft.value = model.value; // revert invalid
}
function pick(c: string) {
  model.value = c;
}
</script>

<template>
  <div class="ctl-swatch">
    <button
      ref="trigger"
      type="button"
      class="ctl-swatch__btn"
      :class="{ 'is-open': open }"
      :style="{ '--swatch': model }"
      :aria-label="`${ariaLabel}: ${model}`"
      aria-haspopup="dialog"
      :aria-expanded="open"
      @click="toggle"
    />
    <div v-show="open" ref="panel" class="ctl-pop" role="dialog" :aria-label="ariaLabel">
      <div class="ctl-pop__grid">
        <button
          v-for="c in presets"
          :key="c"
          type="button"
          class="ctl-pop__chip"
          :class="{ 'is-sel': c.toUpperCase() === model.toUpperCase() }"
          :style="{ '--chip': c }"
          :aria-label="c"
          @click="pick(c)"
        />
      </div>
      <div class="ctl-pop__hex">
        <span class="ctl-pop__preview" :style="{ '--swatch': model }" />
        <input
          v-model="draft"
          class="ctl-pop__hexin"
          spellcheck="false"
          aria-label="Hex value"
          @keydown.enter="commitHex"
          @blur="commitHex"
        />
      </div>
    </div>
  </div>
</template>
