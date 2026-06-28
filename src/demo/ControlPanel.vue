<script setup lang="ts">
// One demo panel: the shared 7-control row, each with its own seeded state so
// panels don't interfere. `skin` drives the [data-skin] hook that demo.css keys
// every visual style off. Controls are in isolation (no live preview) — each
// shows its own value readout (Q5).
import { ref } from "vue";
import SliderField from "./controls/SliderField.vue";
import ColorField from "./controls/ColorField.vue";
import ColorListField from "./controls/ColorListField.vue";
import ToggleField from "./controls/ToggleField.vue";
import SegmentedField from "./controls/SegmentedField.vue";
import SelectField from "./controls/SelectField.vue";
import TextField from "./controls/TextField.vue";

defineProps<{ id: string; name: string; skin: string }>();

const intensity = ref(65);
const tint = ref("#F5B544");
const stops = ref(["#F5B544", "#9C40FF", "#40FFAA"]);
const loop = ref(true);
const size = ref("md");
const easing = ref("ease-out");
const text = ref("Gradient Text");

const sizes = [
  { value: "sm", label: "S" },
  { value: "md", label: "M" },
  { value: "lg", label: "L" },
];
const easings = [
  { value: "linear", label: "Linear" },
  { value: "ease-in", label: "Ease in" },
  { value: "ease-out", label: "Ease out" },
  { value: "ease-in-out", label: "Ease in-out" },
  { value: "spring", label: "Spring" },
];
</script>

<template>
  <section class="ctl-panel" :data-skin="skin">
    <header class="ctl-panel__head">
      <span class="ctl-panel__id">{{ id }}</span>
      <span class="ctl-panel__name">{{ name }}</span>
    </header>
    <div class="ctl-panel__body">
      <SliderField v-model="intensity" label="Intensity" :min="0" :max="100" unit="%" />
      <ColorField v-model="tint" label="Tint" />
      <ColorListField v-model="stops" label="Stops" />
      <ToggleField v-model="loop" label="Loop" />
      <SegmentedField v-model="size" label="Size" :options="sizes" />
      <SelectField v-model="easing" label="Easing" :options="easings" />
      <TextField v-model="text" label="Label" placeholder="Type a label…" />
    </div>
  </section>
</template>
