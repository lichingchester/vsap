<script setup lang="ts">
// Full custom color picker, as a reusable field. HSV internal model so the SV
// canvas + hue strip stay stable; hex is the boundary format written to the
// parent. Popover dismissal (Esc / outside-click) via usePopover. Keeps the
// quick-pick preset row and a validated hex input alongside the full picker.
import { computed, reactive, ref, watch } from "vue";
import { usePopover } from "../usePopover";
import { clamp, hexToHsv, hsvToHex, hueHex, type Hsv } from "../color";

const props = defineProps<{ label: string }>();
const model = defineModel<string>({ required: true });

const trigger = ref<HTMLElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const { open, toggle } = usePopover(trigger, panel);

const presets = [
  "#F5B544", "#FFC65A", "#FF7A45", "#FF4D6D",
  "#9C40FF", "#6C5CE7", "#40A9FF", "#40FFAA",
];

const hsv = reactive<Hsv>(hexToHsv(model.value) ?? { h: 40, s: 72, v: 96 });
const currentHex = computed(() => hsvToHex(hsv));

// Outside-in sync only (writing model below keeps model === currentHex, so this
// won't loop back).
watch(model, (v) => {
  if (v.toUpperCase() === currentHex.value) return;
  const next = hexToHsv(v);
  if (next) Object.assign(hsv, next);
});
function commit() {
  model.value = currentHex.value;
}

// ---- SV canvas (2D) ----
const sv = ref<HTMLElement | null>(null);
const svDrag = ref(false);
function setSv(e: PointerEvent) {
  const r = sv.value!.getBoundingClientRect();
  hsv.s = Math.round(clamp((e.clientX - r.left) / r.width, 0, 1) * 100);
  hsv.v = Math.round((1 - clamp((e.clientY - r.top) / r.height, 0, 1)) * 100);
  commit();
}
function svDown(e: PointerEvent) {
  svDrag.value = true;
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  setSv(e);
}
function svMove(e: PointerEvent) {
  if (svDrag.value) setSv(e);
}
function svUp(e: PointerEvent) {
  svDrag.value = false;
  (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
}
function svKey(e: KeyboardEvent) {
  const k = e.key;
  if (k === "ArrowLeft") hsv.s = clamp(hsv.s - 2, 0, 100);
  else if (k === "ArrowRight") hsv.s = clamp(hsv.s + 2, 0, 100);
  else if (k === "ArrowUp") hsv.v = clamp(hsv.v + 2, 0, 100);
  else if (k === "ArrowDown") hsv.v = clamp(hsv.v - 2, 0, 100);
  else return;
  e.preventDefault();
  commit();
}

// ---- Hue strip (1D) ----
const hue = ref<HTMLElement | null>(null);
const hueDrag = ref(false);
function setHue(e: PointerEvent) {
  const r = hue.value!.getBoundingClientRect();
  hsv.h = Math.round(clamp((e.clientX - r.left) / r.width, 0, 1) * 360);
  commit();
}
function hueDown(e: PointerEvent) {
  hueDrag.value = true;
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  setHue(e);
}
function hueMove(e: PointerEvent) {
  if (hueDrag.value) setHue(e);
}
function hueUp(e: PointerEvent) {
  hueDrag.value = false;
  (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
}
function hueKey(e: KeyboardEvent) {
  if (e.key === "ArrowLeft") hsv.h = (hsv.h - 4 + 360) % 360;
  else if (e.key === "ArrowRight") hsv.h = (hsv.h + 4) % 360;
  else return;
  e.preventDefault();
  commit();
}

// ---- Hex input ----
const draft = ref(model.value);
watch(model, (v) => (draft.value = v.toUpperCase()));
function commitHex() {
  const next = hexToHsv(draft.value);
  if (next) {
    Object.assign(hsv, next);
    commit();
  } else {
    draft.value = model.value.toUpperCase();
  }
}
function pick(c: string) {
  const next = hexToHsv(c);
  if (next) {
    Object.assign(hsv, next);
    commit();
  }
}
</script>

<template>
  <div class="ctl ctl-picker">
    <div class="ctl-head">
      <span class="ctl-label">{{ label }}</span>
      <span class="ctl-value">{{ model.toUpperCase() }}</span>
    </div>
    <div class="ctl-picker__row">
      <button
        ref="trigger"
        type="button"
        class="ctl-swatch__btn"
        :class="{ 'is-open': open }"
        :style="{ '--swatch': model }"
        :aria-label="`${label}: ${model}`"
        aria-haspopup="dialog"
        :aria-expanded="open"
        @click="toggle"
      />
      <span class="ctl-picker__hexlabel">{{ model.toUpperCase() }}</span>

      <div v-show="open" ref="panel" class="ctl-pop ctl-pop--picker" role="dialog" :aria-label="label">
        <!-- Saturation / value canvas -->
        <div
          ref="sv"
          class="ctl-pick__sv"
          :style="{ '--hue': hueHex(hsv.h) }"
          @pointerdown="svDown"
          @pointermove="svMove"
          @pointerup="svUp"
        >
          <div class="ctl-pick__sv-white" />
          <div class="ctl-pick__sv-black" />
          <div
            class="ctl-pick__sv-knob"
            :style="{ left: hsv.s + '%', top: 100 - hsv.v + '%', '--swatch': currentHex }"
            role="slider"
            tabindex="0"
            :aria-label="`${label} saturation and brightness`"
            :aria-valuetext="`S ${hsv.s}% B ${hsv.v}%`"
            @keydown="svKey"
          />
        </div>

        <!-- Hue strip -->
        <div
          ref="hue"
          class="ctl-pick__hue"
          @pointerdown="hueDown"
          @pointermove="hueMove"
          @pointerup="hueUp"
        >
          <div
            class="ctl-pick__hue-knob"
            :style="{ left: (hsv.h / 360) * 100 + '%' }"
            role="slider"
            tabindex="0"
            :aria-label="`${label} hue`"
            :aria-valuenow="hsv.h"
            aria-valuemin="0"
            aria-valuemax="360"
            @keydown="hueKey"
          />
        </div>

        <!-- Hex + preview -->
        <div class="ctl-pop__hex">
          <span class="ctl-pop__preview" :style="{ '--swatch': currentHex }" />
          <input
            v-model="draft"
            class="ctl-pop__hexin"
            spellcheck="false"
            aria-label="Hex value"
            @keydown.enter="commitHex"
            @blur="commitHex"
          />
        </div>

        <!-- Quick-pick presets -->
        <div class="ctl-pick__presets">
          <button
            v-for="c in presets"
            :key="c"
            type="button"
            class="ctl-pick__preset"
            :class="{ 'is-sel': c === model.toUpperCase() }"
            :style="{ '--chip': c }"
            :aria-label="c"
            @click="pick(c)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
