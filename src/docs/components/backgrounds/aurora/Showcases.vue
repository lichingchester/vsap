<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { RotateCcw } from "lucide-vue-next";

// Docs UI
import PreviewBlock from "@/src/docs/components/ui/PreviewBlock.vue";
import Button from "@/src/docs/components/ui/Button.vue";

// Components
import Aurora from "@/src/components/backgrounds/aurora/Aurora.vue";

defineProps<{
  caseName: string;
}>();

const componentKey = ref(0);
</script>

<template>
  <template v-if="caseName === 'Ocean'">
    <PreviewBlock class="relative min-h-76 flex items-center justify-center">
      <Button
        class="absolute right-3 top-3"
        variant="primary"
        size="icon"
        @click="componentKey++"
      >
        <RotateCcw class="size-5" />
      </Button>

      <Aurora
        :key="componentKey"
        baseColor="#173564"
        auroraColor1="#00aaff"
        auroraColor2="#5c53a2"
        :speed="1.0"
        :intensity="5.9"
        :densityX="1.9"
        :densityY="4.9"
        :verticalFalloff="1.9"
        :opacity="1"
        :noiseAmplitude="0.5"
      />
    </PreviewBlock>
  </template>

  <template v-if="caseName === 'Stage Curtain'">
    <PreviewBlock class="relative min-h-76 flex items-center justify-center">
      <Button
        class="absolute right-3 top-3"
        variant="primary"
        size="icon"
        @click="componentKey++"
      >
        <RotateCcw class="size-5" />
      </Button>

      <Aurora
        :key="componentKey"
        baseColor="#0a1d2d"
        auroraColor1="#A500B5"
        auroraColor2="#FF6F61"
        :speed="1.0"
        :intensity="2.6"
        :densityX="10"
        :densityY="0.2"
        :verticalFalloff="0.5"
        :opacity="1"
        :noiseAmplitude="0.1"
      />
    </PreviewBlock>
  </template>
</template>
