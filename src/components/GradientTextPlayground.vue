<script setup lang="ts">
import { ref } from "vue";
// The reference variant — the SAME file the page ?raw-imports for the code tab
// (no-drift, ADR-0004). Mounting it here makes the playground the live preview
// for this flagship snippet (ADR-0007).
import GradientText from "../snippets/text-animations/gradient-text/vue-tailwind/GradientText.vue";

// Docs-only control state. Native inputs, no component library (ADR-0007).
const colors = ref<string[]>(["#ffaa40", "#9c40ff", "#ffaa40"]);
const degree = ref(90);
const animationSpeed = ref(8);

function addColor() {
  if (colors.value.length < 8) colors.value.push("#40ffaa");
}
function removeColor(index: number) {
  if (colors.value.length > 2) colors.value.splice(index, 1);
}
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-neutral-800">
    <!-- Live preview: the reference variant, driven by the controls below. -->
    <div
      class="flex min-h-44 items-center justify-center bg-neutral-900 px-6 py-10"
    >
      <GradientText
        :colors="colors"
        :degree="degree"
        :animation-speed="animationSpeed"
        class="text-5xl font-semibold sm:text-6xl"
      >
        Gradient Text
      </GradientText>
    </div>

    <!-- Controls -->
    <div class="space-y-5 border-t border-neutral-800 bg-neutral-950 p-4">
      <!-- Colors -->
      <div>
        <div class="mb-2 flex items-center justify-between">
          <label class="text-sm font-medium text-neutral-300">Colors</label>
          <button
            class="rounded-md border border-dashed border-neutral-700 px-2 py-1 text-xs text-neutral-400 transition-colors hover:border-neutral-500 hover:text-neutral-200 disabled:opacity-40"
            :disabled="colors.length >= 8"
            @click="addColor"
          >
            + Add
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(color, i) in colors"
            :key="i"
            class="group relative"
          >
            <input
              v-model="colors[i]"
              type="color"
              class="h-9 w-9 cursor-pointer rounded-md border border-neutral-700 bg-transparent"
              :aria-label="`Color ${i + 1}`"
            />
            <button
              v-if="colors.length > 2"
              class="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-neutral-700 text-[10px] leading-none text-neutral-100 group-hover:flex hover:bg-neutral-600"
              :aria-label="`Remove color ${i + 1}`"
              @click="removeColor(i)"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- Degree -->
      <div>
        <div class="mb-1 flex items-center justify-between">
          <label class="text-sm font-medium text-neutral-300">Direction</label>
          <span class="text-sm tabular-nums text-neutral-400"
            >{{ degree }}°</span
          >
        </div>
        <input
          v-model.number="degree"
          type="range"
          min="0"
          max="360"
          step="1"
          class="w-full accent-neutral-200"
        />
      </div>

      <!-- Speed -->
      <div>
        <div class="mb-1 flex items-center justify-between">
          <label class="text-sm font-medium text-neutral-300">Loop</label>
          <span class="text-sm tabular-nums text-neutral-400"
            >{{ animationSpeed.toFixed(1) }}s</span
          >
        </div>
        <input
          v-model.number="animationSpeed"
          type="range"
          min="1"
          max="10"
          step="0.1"
          class="w-full accent-neutral-200"
        />
      </div>

      <p class="text-xs text-neutral-500">
        Tip: repeat the first color as the last stop for a seamless loop.
      </p>
    </div>
  </div>
</template>
