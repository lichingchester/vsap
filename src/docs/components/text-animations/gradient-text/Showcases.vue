<script setup lang="ts">
import { ref } from "vue";
import { RotateCcw } from "lucide-vue-next";

// Docs UI
import PreviewBlock from "@/src/docs/components/ui/PreviewBlock.vue";
import Button from "@/src/docs/components/ui/Button.vue";

// Components
import GradientText from "@/src/components/text-animations/gradient-text/GradientText.vue";

defineProps<{
  caseName: string;
}>();

const componentKey = ref(0);
</script>

<template>
  <template v-if="caseName === 'Rainbow Flow'">
    <PreviewBlock class="relative min-h-76 flex items-center justify-center">
      <Button
        class="absolute right-3 top-3"
        variant="primary"
        size="icon"
        @click="componentKey++"
      >
        <RotateCcw class="size-5" />
      </Button>

      <GradientText
        :key="componentKey"
        :colors="[
          '#ff0000 0%',
          '#ff8000 16%',
          '#ffff00 33%',
          '#80ff00 50%',
          '#00ff80 66%',
          '#0080ff 83%',
          '#ff0000 100%',
        ]"
        :animationSpeed="4"
        :degree="45"
        gradientType="linear"
        class="text-8xl text-center font-bold"
      >
        Rainbow Flow
      </GradientText>
    </PreviewBlock>
  </template>

  <template v-if="caseName === 'Ocean Waves'">
    <PreviewBlock class="relative min-h-76 flex items-center justify-center">
      <Button
        class="absolute right-3 top-3"
        variant="primary"
        size="icon"
        @click="componentKey++"
      >
        <RotateCcw class="size-5" />
      </Button>

      <GradientText
        :key="componentKey"
        :colors="[
          '#0ea5e9 0%',
          '#06b6d4 25%',
          '#0891b2 50%',
          '#0e7490 75%',
          '#0ea5e9 100%',
        ]"
        :animationSpeed="6"
        :degree="90"
        gradientType="linear"
        class="text-8xl text-center font-bold"
      >
        Ocean Waves
      </GradientText>
    </PreviewBlock>
  </template>

  <template v-if="caseName === 'Cyber Neon'">
    <PreviewBlock
      class="relative min-h-76 flex items-center justify-center bg-gray-900"
    >
      <Button
        class="absolute right-3 top-3"
        variant="primary"
        size="icon"
        @click="componentKey++"
      >
        <RotateCcw class="size-5" />
      </Button>

      <GradientText
        :key="componentKey"
        :colors="[
          '#00ff41 0%',
          '#00d4aa 25%',
          '#ff0080 50%',
          '#8000ff 75%',
          '#00ff41 100%',
        ]"
        :animationSpeed="2"
        :degree="0"
        gradientType="linear"
        class="text-8xl text-center font-bold"
      >
        CYBER NEON
      </GradientText>
    </PreviewBlock>
  </template>

  <template v-if="caseName === 'Fire Flame'">
    <PreviewBlock
      class="relative min-h-76 flex items-center justify-center bg-gray-900"
    >
      <Button
        class="absolute right-3 top-3"
        variant="primary"
        size="icon"
        @click="componentKey++"
      >
        <RotateCcw class="size-5" />
      </Button>

      <GradientText
        :key="componentKey"
        :colors="[
          '#ff4500 0%',
          '#ff6347 20%',
          '#ffa500 40%',
          '#ffff00 60%',
          '#ffa500 80%',
          '#ff4500 100%',
        ]"
        :animationSpeed="1.5"
        :degree="270"
        gradientType="linear"
        class="text-8xl text-center font-bold"
      >
        Fire Flame
      </GradientText>
    </PreviewBlock>
  </template>
</template>
