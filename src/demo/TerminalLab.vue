<script setup lang="ts">
// Terminal · lab — focused iteration on the chosen skin (B1). Applies the four
// asks: fatter slider hit area, a full HSV ColorPickerField, four toggle
// directions to choose from, and a full-width segmented. Everything sits inside
// a [data-skin="terminal"] wrapper so the Terminal CSS drives it.
import { ref } from "vue";
import SliderField from "./controls/SliderField.vue";
import ColorPickerField from "./controls/ColorPickerField.vue";
import ColorListField from "./controls/ColorListField.vue";
import SegmentedField from "./controls/SegmentedField.vue";
import SelectField from "./controls/SelectField.vue";
import TextField from "./controls/TextField.vue";
import ToggleField from "./controls/ToggleField.vue";

const intensity = ref(65);
const tint = ref("#F5B544");
const stops = ref(["#F5B544", "#9C40FF", "#40FFAA"]);
const size = ref("md");
const easing = ref("ease-out");
const text = ref("Gradient Text");

const sizes = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
];
const easings = [
  { value: "linear", label: "Linear" },
  { value: "ease-in", label: "Ease in" },
  { value: "ease-out", label: "Ease out" },
  { value: "ease-in-out", label: "Ease in-out" },
  { value: "spring", label: "Spring" },
];

// One value per toggle direction so they toggle independently.
const tSwitch = ref(true);
const tBracket = ref(true);
const tLed = ref(false);
const tCheckbox = ref(true);
</script>

<template>
  <section class="lab">
    <header class="lab__head">
      <h2 class="lab__title">Terminal · lab</h2>
      <p class="lab__sub">
        Iterating the chosen skin: fatter slider target, a full HSV picker,
        toggle directions, and a full-width button group.
      </p>
    </header>

    <div class="lab__grid" data-skin="terminal">
      <!-- Primary controls -->
      <section class="ctl-panel" data-skin="terminal">
        <header class="ctl-panel__head">
          <span class="ctl-panel__id">B1</span>
          <span class="ctl-panel__name">controls</span>
        </header>
        <div class="ctl-panel__body">
          <SliderField v-model="intensity" label="Intensity" :min="0" :max="100" unit="%" />
          <ColorPickerField v-model="tint" label="Tint" />
          <ColorListField v-model="stops" label="Stops" />
          <SegmentedField v-model="size" label="Size" :options="sizes" block />
          <SelectField v-model="easing" label="Easing" :options="easings" />
          <TextField v-model="text" label="Label" placeholder="Type a label…" />
        </div>
      </section>

      <!-- Toggle directions -->
      <section class="ctl-panel" data-skin="terminal">
        <header class="ctl-panel__head">
          <span class="ctl-panel__id">04</span>
          <span class="ctl-panel__name">toggle directions</span>
        </header>
        <div class="ctl-panel__body lab__toggles">
          <div class="lab__toggle">
            <span class="lab__toggle-tag">a · switch</span>
            <ToggleField v-model="tSwitch" label="Loop" variant="switch" />
          </div>
          <div class="lab__toggle">
            <span class="lab__toggle-tag">b · bracket</span>
            <ToggleField v-model="tBracket" label="Loop" variant="bracket" />
          </div>
          <div class="lab__toggle">
            <span class="lab__toggle-tag">c · led</span>
            <ToggleField v-model="tLed" label="Loop" variant="led" />
          </div>
          <div class="lab__toggle">
            <span class="lab__toggle-tag">d · checkbox</span>
            <ToggleField v-model="tCheckbox" label="Loop" variant="checkbox" />
          </div>
        </div>
      </section>
    </div>
  </section>
</template>
