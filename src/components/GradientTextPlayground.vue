<script setup lang="ts">
import { ref } from "vue";
// The reference variant — the SAME file the page ?raw-imports for the code tab
// (no-drift, ADR-0004). Mounting it here makes the playground the live preview
// for this flagship snippet (ADR-0007).
import GradientText from "../snippets/text-animations/gradient-text/vue-tailwind/GradientText.vue";
// The promoted tskr/ui control kit (chosen on /demo). Docs-only site chrome —
// fully-custom Terminal controls, never copied into a user's project.
import { ColorList, Slider } from "../controls";

const colors = ref<string[]>(["#FFAA40", "#9C40FF", "#FFAA40"]);
const degree = ref(90);
const animationSpeed = ref(8);
</script>

<template>
  <div class="overflow-hidden rounded-[8px] border border-line">
    <!-- Live preview: the reference variant, driven by the controls below. -->
    <div class="flex min-h-44 items-center justify-center bg-inset px-6 py-10">
      <GradientText
        :colors="colors"
        :degree="degree"
        :animation-speed="animationSpeed"
        class="text-5xl font-semibold sm:text-6xl"
      >
        Gradient Text
      </GradientText>
    </div>

    <!-- Controls — the tskr/ui kit -->
    <div class="space-y-5 border-t border-line bg-surface p-4">
      <ColorList v-model="colors" label="Colors" :min="2" :max="8" />
      <Slider v-model="degree" label="Direction" :min="0" :max="360" :step="1" unit="°" />
      <Slider v-model="animationSpeed" label="Loop" :min="1" :max="10" :step="0.1" unit="s" />

      <p class="text-xs text-dim">
        Tip: repeat the first color as the last stop for a seamless loop.
      </p>
    </div>
  </div>
</template>
