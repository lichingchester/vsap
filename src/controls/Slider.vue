<script setup lang="ts">
// tskr/ui control kit — Slider. Fully-custom (no native range); tall hit area
// wraps a thin rail so the whole row is grab-able. Drag + keyboard in useSlider.
import "./controls.css";
import { useSlider } from "./useSlider";

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
  <div class="tk-field tk-slider" :class="{ 'is-dragging': dragging }">
    <div class="tk-field__head">
      <span class="tk-label">{{ label }}</span>
      <span class="tk-value">{{ value }}{{ unit }}</span>
    </div>
    <div
      ref="track"
      class="tk-slider__track"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
    >
      <div class="tk-slider__rail">
        <div class="tk-slider__fill" :style="{ width: percent + '%' }" />
      </div>
      <div
        class="tk-slider__thumb"
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
