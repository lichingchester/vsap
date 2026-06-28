<script setup lang="ts">
// Fully-custom slider — no native <input type=range>. Drag + keyboard live in
// useSlider; this file is structure + ARIA only, styled per skin via demo.css.
import { useSlider } from "../useSlider";

const props = withDefaults(
  defineProps<{
    label: string;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
  }>(),
  { min: 0, max: 100, step: 1, unit: "" },
);

const value = defineModel<number>({ required: true });
const { track, percent, dragging, onPointerDown, onPointerMove, onPointerUp, onKeyDown } =
  useSlider(value, { min: props.min, max: props.max, step: props.step });
</script>

<template>
  <div class="ctl ctl-slider" :class="{ 'is-dragging': dragging }">
    <div class="ctl-head">
      <span class="ctl-label">{{ label }}</span>
      <span class="ctl-value">{{ value }}{{ unit }}</span>
    </div>
    <!-- track = full-height transparent hit area; rail = the thin visible bar
         inside it. Grab anywhere on the row; the bar itself stays slim. -->
    <div
      ref="track"
      class="ctl-slider__track"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
    >
      <div class="ctl-slider__rail">
        <div class="ctl-slider__fill" :style="{ width: percent + '%' }" />
      </div>
      <div
        class="ctl-slider__thumb"
        :style="{ left: percent + '%' }"
        role="slider"
        tabindex="0"
        :aria-label="label"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="value"
        @keydown="onKeyDown"
      />
    </div>
  </div>
</template>
