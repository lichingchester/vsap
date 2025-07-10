<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { RotateCcw } from "lucide-vue-next";

// Docs UI
import PreviewBlock from "@/src/docs/components/ui/PreviewBlock.vue";
import Button from "@/src/docs/components/ui/Button.vue";

// Components
import SplitText from "@/src/components/text-animations/split-text/SplitText.vue";

defineProps<{
  caseName: string;
}>();

const componentKey = ref(0);

const isManualPlayRef = useTemplateRef("isManualPlayRef");
</script>

<template>
  <template v-if="caseName === 'AdvancedGsapConfig'">
    <PreviewBlock class="relative min-h-76 flex items-center justify-center">
      <Button
        class="absolute right-3 top-3"
        variant="primary"
        size="icon"
        @click="componentKey++"
      >
        <RotateCcw class="size-5" />
      </Button>

      <SplitText
        :key="componentKey"
        text="Hello World!"
        class="text-8xl text-center"
        type="chars,words"
        :from="{
          opacity: 0,
          y: 'random(150, 0)',
          x: 'random(-100, 100)',
          rotate: 'random(-180, 180)',
          visibility: 'hidden',
        }"
        :to="{ opacity: 1, y: 0, x: 0, rotate: 0, visibility: 'visible' }"
        ease="elastic.out(1,0.3)"
        :duration="2"
      />
    </PreviewBlock>
  </template>

  <template v-if="caseName === 'Mask'">
    <PreviewBlock class="relative min-h-76 flex items-center justify-center">
      <Button
        class="absolute right-3 top-3"
        variant="primary"
        size="icon"
        @click="componentKey++"
      >
        <RotateCcw class="size-5" />
      </Button>

      <SplitText
        :key="componentKey"
        text="Hello World!"
        class="text-8xl text-center"
        type="chars,words"
        mask="chars"
      />
    </PreviewBlock>
  </template>

  <template v-if="caseName === 'Manual'">
    <PreviewBlock class="relative min-h-76 flex items-center justify-center">
      <div class="absolute right-3 top-3 flex gap-3">
        <Button variant="primary" @click="isManualPlayRef?.play"> Play </Button>
        <Button variant="primary" @click="isManualPlayRef?.reverse">
          Reverse
        </Button>
      </div>

      <SplitText
        ref="isManualPlayRef"
        text="Hello World!"
        class="text-8xl text-center"
        type="chars,words"
        :from="{
          x: (index: number) =>
            `random(['${index % 2 === 0 ? '0' : '100%, -100%'}])`,
          y: (index: number) =>
            `random(['${index % 2 !== 0 ? '0' : '100%, -100%'}])`,
        }"
        :to="{
          x: 0,
          y: 0,
        }"
        mask="chars"
        ease="power3.inOut"
        is-manual-play
      />
    </PreviewBlock>
  </template>

  <template v-if="caseName === 'Absolute'">
    <PreviewBlock class="relative min-h-76">
      <Button
        class="absolute right-3 top-3"
        variant="primary"
        size="icon"
        @click="componentKey++"
      >
        <RotateCcw class="size-5" />
      </Button>

      <SplitText
        ref="isManualPlayRef"
        :key="componentKey"
        text="Hello World!"
        class="absolute left-3 bottom-3 text-8xl text-center"
        :from="{
          opacity: 0,
          y: '-200%',
        }"
        :to="{
          opacity: 1,
          y: 0,
        }"
        :duration="2"
        ease="power3.out"
        type="chars,words"
      />
    </PreviewBlock>
  </template>
</template>
