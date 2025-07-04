<script setup lang="ts">
import { RotateCcw } from "lucide-vue-next";
import { ref } from "vue";
import PreviewBlock from "@/src/docs/ui/PreviewBlock.vue";
import SplitText from "@/src/components/text-animations/split-text/SplitText.vue";
import Button from "@/src/docs/ui/Button.vue";

const componentKey = ref(0);

const forceRerender = () => {
  componentKey.value += 1;
};
</script>

<template>
  <div class="">
    <PreviewBlock class="relative min-h-76 flex items-center justify-center">
      <Button
        class="absolute right-3 top-3"
        variant="primary"
        size="icon"
        @click="forceRerender"
      >
        <RotateCcw class="size-5" />
      </Button>

      <SplitText
        :key="componentKey"
        text="Hello World!"
        class="text-8xl text-center"
        type="words,chars"
      />
    </PreviewBlock>

    <div class="text-2xl font-semibold mt-4">Configurations</div>

    <div class="mt-2">
      <div class="flex">
        <div class="font-semibold">Type</div>
      </div>

      <ul class="list-disc pl-6">
        <li>type: "words,chars"</li>
        <li>mask: "lines"</li>
        <li>autoSplit: true</li>
        <li>onSplit: function to handle split events</li>
      </ul>
    </div>
  </div>
</template>
