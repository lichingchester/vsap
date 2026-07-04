<script setup lang="ts">
/*
 * Live gallery of the Control kit (ADR-0010) for the /design page. Each control
 * is a real, hydrated instance with its own demo state — you can drag the
 * slider, flip the toggle, pick a color — because a controls page you can't
 * operate is just a screenshot. Docs-only chrome; never copied.
 */
import { ref } from "vue";
import {
  Slider,
  Toggle,
  Segmented,
  Select,
  TextField,
  ColorPicker,
  ColorList,
} from "../controls";

const amount = ref(48);
const enabled = ref(true);
const density = ref("mid");
const easing = ref("ease");
const label = ref("tskr/ui");
const accent = ref("#F5B544");
const stops = ref(["#F5B544", "#FFC65A", "#40FFAA"]);

const densityOpts = [
  { value: "low", label: "Low" },
  { value: "mid", label: "Mid" },
  { value: "high", label: "High" },
];
const easingOpts = [
  { value: "linear", label: "Linear" },
  { value: "ease", label: "Ease" },
  { value: "spring", label: "Spring" },
];
</script>

<template>
  <div class="ds-controls">
    <Slider v-model="amount" label="Amount" :min="0" :max="100" unit="%" />
    <Toggle v-model="enabled" label="Enabled" />
    <Segmented v-model="density" label="Density" :options="densityOpts" />
    <Select v-model="easing" label="Easing" :options="easingOpts" />
    <TextField v-model="label" label="Label" placeholder="Type…" />
    <ColorPicker v-model="accent" label="Accent" />
    <div class="ds-controls__wide">
      <ColorList v-model="stops" label="Stops" />
    </div>
  </div>
</template>
