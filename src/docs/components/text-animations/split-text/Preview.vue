<script setup lang="ts">
import { RotateCcw } from "lucide-vue-next";
import { ref } from "vue";

// Docs UI
import PreviewBlock from "@/src/docs/components/ui/PreviewBlock.vue";
import Button from "@/src/docs/components/ui/Button.vue";
import ConfigItem from "@/src/docs/components/ui/configurations/ConfigItem.vue";
import ConfigGroup from "@/src/docs/components/ui/configurations/ConfigGroup.vue";

// Shadcn
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/docs/components/shadcn/ui/select";
import { Slider } from "@/src/docs/components/shadcn/ui/slider";

// Components
import SplitText from "@/src/components/text-animations/split-text/SplitText.vue";

const componentKey = ref<number>(0);

const forceRerender = (): void => {
  componentKey.value += 1;
};

const configType = ref("words,chars");
const configStagger = ref([0.05]);
const configDuration = ref([0.8]);
const configEase = ref("back.out");
const configMask = ref(undefined);
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
        :type="configType"
        :stagger="configStagger[0]"
        :duration="configDuration[0]"
        :ease="configEase"
        :mask="configMask"
      />
    </PreviewBlock>

    <ConfigGroup>
      <ConfigItem name="Type">
        <Select v-model="configType">
          <SelectTrigger as="div">
            <SelectValue placeholder="Select an type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="chars"> Chars </SelectItem>
              <SelectItem value="words"> Words </SelectItem>
              <SelectItem value="lines"> Lines </SelectItem>
              <SelectItem value="words,chars"> Words & Chars </SelectItem>
              <SelectItem value="lines,chars"> Lines & Chars </SelectItem>
              <SelectItem value="lines,words"> Lines & Words </SelectItem>
              <SelectItem value="lines,words,chars">
                Lines, Words & Chars
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </ConfigItem>

      <ConfigItem name="Stagger (Delay)">
        <Slider v-model="configStagger" :max="1" :step="0.05" class="w-40" />
        <div class="text-sm text-muted-foreground">
          {{ configStagger[0] + "s" }}
        </div>
      </ConfigItem>

      <ConfigItem name="Duration">
        <Slider v-model="configDuration" :max="5" :step="0.1" class="w-40" />
        <div class="text-sm text-muted-foreground">
          {{ configDuration[0] + "s" }}
        </div>
      </ConfigItem>

      <ConfigItem name="Ease">
        <Select v-model="configEase">
          <SelectTrigger as="div">
            <SelectValue placeholder="Select an ease" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="power1.out"> power1.out </SelectItem>
              <SelectItem value="power1.inOut"> power1.inOut </SelectItem>
              <SelectItem value="power2.out"> power2.out </SelectItem>
              <SelectItem value="power2.inOut"> power2.inOut </SelectItem>
              <SelectItem value="power3.out"> power3.out </SelectItem>
              <SelectItem value="power3.inOut"> power3.inOut </SelectItem>
              <SelectItem value="power4.out"> power4.out </SelectItem>
              <SelectItem value="power4.inOut"> power4.inOut </SelectItem>
              <SelectItem value="back.out"> back.out </SelectItem>
              <SelectItem value="back.inOut"> back.inOut </SelectItem>
              <SelectItem value="elastic.out"> elastic.out </SelectItem>
              <SelectItem value="elastic.inOut"> elastic.inOut </SelectItem>
              <SelectItem value="bounce.out"> bounce.out </SelectItem>
              <SelectItem value="bounce.inOut"> bounce.inOut </SelectItem>
              <SelectItem value="expo.out"> expo.out </SelectItem>
              <SelectItem value="expo.inOut"> expo.inOut </SelectItem>
              <SelectItem value="sine.out"> sine.out </SelectItem>
              <SelectItem value="sine.inOut"> sine.inOut </SelectItem>
              <SelectItem value="circ.out"> circ.out </SelectItem>
              <SelectItem value="circ.inOut"> circ.inOut </SelectItem>
              <SelectItem value="steps(4)"> steps(4) </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </ConfigItem>

      <ConfigItem name="Mask">
        <Select v-model="configMask">
          <SelectTrigger as="div">
            <SelectValue placeholder="Select a mask" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem :value="undefined"> None </SelectItem>
              <SelectItem value="lines"> Lines </SelectItem>
              <SelectItem value="words"> Words </SelectItem>
              <SelectItem value="chars"> Chars </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </ConfigItem>
    </ConfigGroup>
  </div>
</template>
