<script setup lang="ts">
import { ref, computed } from "vue";

// Docs UI
import PreviewBlock from "@/src/docs/components/ui/PreviewBlock.vue";
import ConfigItem from "@/src/docs/components/ui/configurations/ConfigItem.vue";
import ConfigGroup from "@/src/docs/components/ui/configurations/ConfigGroup.vue";

// Shadcn
import { Slider } from "@/src/docs/components/shadcn/ui/slider";
import { Input } from "@/src/docs/components/shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/docs/components/shadcn/ui/select";

// Components
import GradientText from "@/src/components/text-animations/gradient-text/GradientText.vue";

// Initial colors, can be any length
const configColors = ref(["#40ffaa", "#4079ff", "#40ffaa"]);
// Color percentages for gradient stops (0-100) - each element is an array for the slider component
const configColorPercentages = ref([[0], [50], [100]]);

// --- Fix: make slider value an array, use [0] for value ---
const configAnimationSpeed = ref([3]); // <-- array!
const configDegree = ref([90]); // <-- array for slider!
const configGradientType = ref<"linear" | "radial">("linear"); // linear or radial
const configShowBorder = ref(false);

const gradientBarStyle = computed(() => {
  const colorStops = configColors.value.map((color, index) => {
    const percentage = configColorPercentages.value[index]?.[0] || 0;
    return `${color} ${percentage}%`;
  });

  if (configGradientType.value === "radial") {
    return {
      background: `radial-gradient(circle, ${colorStops.join(", ")})`,
    };
  } else {
    return {
      background: `linear-gradient(${configDegree.value[0]}deg, ${colorStops.join(", ")})`,
    };
  }
});

const gradientColorsWithPercentages = computed(() => {
  return configColors.value.map((color, index) => {
    const percentage = configColorPercentages.value[index]?.[0] || 0;
    return `${color} ${percentage}%`;
  });
});

// Optional: Validate hex code (returns true/false)
function isValidHex(str) {
  return /^#[0-9a-fA-F]{6}$/.test(str);
}

// Add a new color with default percentage
function addColor() {
  configColors.value.push("#40ffaa");
  // Add new percentage at the end
  const lastPercentage =
    configColorPercentages.value[
      configColorPercentages.value.length - 1
    ]?.[0] || 100;
  configColorPercentages.value.push([Math.min(lastPercentage + 10, 100)]);
}

// Remove the last color and its percentage
function removeColor() {
  if (configColors.value.length > 2) {
    configColors.value.pop();
    configColorPercentages.value.pop();
  }
}

// Update degree from input
function updateDegree(value: string | number) {
  const numValue = typeof value === "string" ? parseInt(value) : value;
  if (!isNaN(numValue)) {
    configDegree.value[0] = Math.max(0, Math.min(360, numValue));
  }
}

// Drag functionality for circular degree controller
function startDragDegree(event: MouseEvent | TouchEvent) {
  // Only allow interaction in linear mode
  if (configGradientType.value !== "linear") return;

  // Find the circular controller container at the start
  const clickableArea = event.target as HTMLElement;
  const containerDiv = clickableArea.parentElement; // The div with relative w-16 h-16

  if (!containerDiv) return;

  const handleMove = (e: MouseEvent | TouchEvent) => {
    const rect = containerDiv.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    // Calculate angle from center
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    // Convert to angle in radians (atan2 gives -π to π)
    const angleRad = Math.atan2(deltaY, deltaX);

    // Convert to degrees and adjust:
    // - atan2 gives 0° at right (3 o'clock)
    // - We want 0° at top (12 o'clock)
    // - So we add 90° and normalize to 0-360
    let degree = ((angleRad * 180) / Math.PI + 90 + 360) % 360;

    configDegree.value[0] = Math.round(degree);
  };

  const handleEnd = () => {
    document.removeEventListener("mousemove", handleMove);
    document.removeEventListener("mouseup", handleEnd);
    document.removeEventListener("touchmove", handleMove);
    document.removeEventListener("touchend", handleEnd);
  };

  document.addEventListener("mousemove", handleMove);
  document.addEventListener("mouseup", handleEnd);
  document.addEventListener("touchmove", handleMove);
  document.addEventListener("touchend", handleEnd);

  // Handle initial click/touch
  handleMove(event);
}
</script>

<template>
  <div>
    <PreviewBlock
      class="relative min-h-76 flex items-center justify-center py-10"
    >
      <GradientText
        :colors="gradientColorsWithPercentages"
        :animationSpeed="configAnimationSpeed[0]"
        :degree="configDegree[0]"
        :gradientType="configGradientType"
        :showBorder="configShowBorder"
        class="text-8xl text-center"
      >
        Hello World!
      </GradientText>
    </PreviewBlock>

    <div class="space-y-4">
      <ConfigGroup>
        <ConfigItem name="Loop Duration">
          <div class="flex items-center gap-4 w-full">
            <Slider
              v-model="configAnimationSpeed"
              :min="1"
              :max="10"
              :step="0.1"
              class="flex-1"
            />
            <span class="min-w-max text-base font-medium">
              {{ configAnimationSpeed[0] }}s
            </span>
          </div>
        </ConfigItem>

        <ConfigItem name="Gradient Type">
          <Select v-model="configGradientType">
            <SelectTrigger as="div">
              <SelectValue placeholder="Select gradient type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="radial">Radial</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </ConfigItem>

        <ConfigItem name="Gradient Degree">
          <div class="flex items-center gap-4 w-full">
            <!-- Circular degree controller -->
            <div
              :class="[
                'relative w-16 h-16 flex-shrink-0 transition-opacity duration-200',
                configGradientType === 'radial'
                  ? 'opacity-40 pointer-events-none'
                  : '',
              ]"
            >
              <!-- Circle background -->
              <div
                class="w-full h-full rounded-full border-2 border-input bg-background shadow-sm transition-shadow pointer-events-none"
              >
                <!-- Degree line indicator -->
                <div
                  class="absolute w-0.5 h-6 bg-primary rounded-full origin-bottom"
                  :style="{
                    left: '50%',
                    bottom: '50%',
                    transform: `translateX(-50%) rotate(${configDegree[0]}deg)`,
                    transformOrigin: 'center bottom',
                  }"
                ></div>
                <!-- Center dot -->
                <div
                  class="absolute w-2 h-2 bg-primary rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                ></div>
              </div>
              <!-- Invisible clickable area for interaction -->
              <div
                :class="[
                  'absolute inset-0 rounded-full transition-all duration-200',
                  configGradientType === 'linear'
                    ? 'cursor-pointer hover:shadow-md'
                    : 'cursor-not-allowed',
                ]"
                @mousedown="startDragDegree"
                @touchstart="startDragDegree"
              ></div>
            </div>

            <!-- Input box for manual entry -->
            <Input
              :model-value="configDegree[0]"
              @update:model-value="updateDegree"
              :disabled="configGradientType === 'radial'"
              type="number"
              min="0"
              max="360"
              class="w-20 text-sm text-center transition-opacity duration-200"
              :class="{ 'opacity-40': configGradientType === 'radial' }"
            />
            <span class="text-sm text-muted-foreground">°</span>
          </div>
        </ConfigItem>

        <ConfigItem name="Colors">
          <div class="flex flex-col gap-2 w-full">
            <div class="flex flex-wrap gap-4">
              <template v-for="(color, idx) in configColors" :key="idx">
                <div class="flex items-center gap-2">
                  <Input
                    v-model="configColors[idx]"
                    type="text"
                    class="w-24 text-xs border border-primary bg-background rounded px-2 py-1 focus:border-primary transition-colors"
                    :class="{
                      'border-red-400': !isValidHex(configColors[idx]),
                    }"
                  />
                  <div class="relative">
                    <button
                      type="button"
                      class="inline-block w-6 h-6 rounded-full border-2 border-input shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                      :style="{ background: configColors[idx] }"
                      @click="$refs[`colorInput${idx}`][0].click()"
                      :aria-label="`Pick color, current color is ${configColors[idx]}`"
                    ></button>
                    <input
                      :ref="`colorInput${idx}`"
                      type="color"
                      :value="configColors[idx]"
                      @input="
                        configColors[idx] = (
                          $event.target as HTMLInputElement
                        ).value
                      "
                      class="absolute opacity-0 pointer-events-none"
                      tabindex="-1"
                    />
                  </div>
                </div>
              </template>
              <!-- Add color button -->
              <button
                v-if="configColors.length < 8"
                class="rounded-md border border-dashed border-input px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-all duration-200"
                @click="addColor"
                type="button"
              >
                + Add Color
              </button>
              <!-- Remove color button -->
              <button
                v-if="configColors.length > 2"
                class="rounded-md border border-input px-3 py-1.5 text-sm text-muted-foreground hover:border-destructive hover:text-destructive transition-all duration-200"
                @click="removeColor"
                type="button"
              >
                − Remove
              </button>
            </div>

            <!-- Gradient bar preview -->
            <div
              class="h-2 rounded-full w-full"
              :style="gradientBarStyle"
            ></div>
          </div>
        </ConfigItem>

        <ConfigItem name="Color Positions">
          <div class="flex flex-col gap-3 w-full">
            <template v-for="(color, idx) in configColors" :key="idx">
              <div class="flex items-center gap-4 w-full">
                <!-- Color preview -->
                <span
                  class="inline-block w-4 h-4 rounded-full border flex-shrink-0"
                  :style="{
                    background: isValidHex(configColors[idx])
                      ? configColors[idx]
                      : '#fff',
                  }"
                ></span>

                <!-- Slider -->
                <Slider
                  v-model="configColorPercentages[idx]"
                  :min="0"
                  :max="100"
                  :step="1"
                  class="flex-1"
                />

                <!-- Percentage display -->
                <span class="min-w-max text-sm font-medium w-10 text-right">
                  {{ Math.round(configColorPercentages[idx]?.[0] || 0) }}%
                </span>
              </div>
            </template>
          </div>
        </ConfigItem>
      </ConfigGroup>

      <!-- Info -->
      <div class="flex items-center gap-2 text-sm text-zinc-400 mt-1">
        <svg width="18" height="18" fill="none" class="inline-block mr-1">
          <circle cx="9" cy="9" r="8" stroke="#40ffaa" stroke-width="2" />
          <rect x="8" y="5" width="2" height="5" rx="1" fill="#40ffaa" />
          <rect x="8" y="12" width="2" height="2" rx="1" fill="#40ffaa" />
        </svg>
        For a smoother animation, the gradient should start and end with the
        same color.
      </div>
    </div>
  </div>
</template>
