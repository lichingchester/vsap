<script setup lang="ts">
import { RotateCcw } from "lucide-vue-next";
import { ref } from "vue";

// Docs UI
import PreviewBlock from "@/src/docs/components/ui/PreviewBlock.vue";
import Button from "@/src/docs/components/ui/Button.vue";
import ConfigItem from "@/src/docs/components/ui/configurations/ConfigItem.vue";
import ConfigGroup from "@/src/docs/components/ui/configurations/ConfigGroup.vue";

// Shadcn
import { Slider } from "@/src/docs/components/shadcn/ui/slider";

// Components
import Aurora from "@/src/components/backgrounds/aurora/Aurora.vue";

const componentKey = ref<number>(0);

const forceRerender = (): void => {
  componentKey.value += 1;
};

const configBaseColor = ref("#0d1117");
const configAuroraColor1 = ref("#00aaff");
const configAuroraColor2 = ref("#ff00aa");
const configSpeed = ref([1.0]);
const configIntensity = ref([3.0]);
const configDensityX = ref([2.5]);
const configDensityY = ref([0.0]);
const configVerticalFalloff = ref([1.0]);
const configOpacity = ref([1.0]);
const configNoiseAmplitude = ref([0.3]);
</script>

<template>
  <div class="">
    <PreviewBlock class="relative min-h-76 flex items-center justify-center">
      <Button
        class="absolute right-3 top-3 z-10"
        variant="primary"
        size="icon"
        @click="forceRerender"
      >
        <RotateCcw class="size-5" />
      </Button>

      <Aurora
        :key="componentKey"
        :baseColor="configBaseColor"
        :auroraColor1="configAuroraColor1"
        :auroraColor2="configAuroraColor2"
        :speed="configSpeed[0]"
        :intensity="configIntensity[0]"
        :densityX="configDensityX[0]"
        :densityY="configDensityY[0]"
        :verticalFalloff="configVerticalFalloff[0]"
        :opacity="configOpacity[0]"
        :noiseAmplitude="configNoiseAmplitude[0]"
      />
    </PreviewBlock>

    <ConfigGroup>
      <ConfigItem name="Base Color">
        <input type="color" v-model="configBaseColor" />
      </ConfigItem>

      <ConfigItem name="Aurora Color 1">
        <input type="color" v-model="configAuroraColor1" />
      </ConfigItem>

      <ConfigItem name="Aurora Color 2">
        <input type="color" v-model="configAuroraColor2" />
      </ConfigItem>

      <ConfigItem name="Speed">
        <Slider v-model="configSpeed" :max="10" :step="0.1" class="w-40" />
        <div class="text-sm text-muted-foreground">
          {{ configSpeed[0] + "x" }}
        </div>
      </ConfigItem>

      <ConfigItem name="Intensity">
        <Slider v-model="configIntensity" :max="10" :step="0.1" class="w-40" />
        <div class="text-sm text-muted-foreground">
          {{ configIntensity[0] }}
        </div>
      </ConfigItem>

      <ConfigItem name="Density X">
        <Slider v-model="configDensityX" :max="20" :step="0.1" class="w-40" />
        <div class="text-sm text-muted-foreground">
          {{ configDensityX[0] }}
        </div>
      </ConfigItem>

      <ConfigItem name="Density Y">
        <Slider v-model="configDensityY" :max="20" :step="0.1" class="w-40" />
        <div class="text-sm text-muted-foreground">
          {{ configDensityY[0] }}
        </div>
      </ConfigItem>

      <ConfigItem name="Vertical Falloff">
        <Slider
          v-model="configVerticalFalloff"
          :max="10"
          :step="0.1"
          class="w-40"
        />
        <div class="text-sm text-muted-foreground">
          {{ configVerticalFalloff[0] }}
        </div>
      </ConfigItem>

      <ConfigItem name="Opacity">
        <Slider v-model="configOpacity" :max="1" :step="0.1" class="w-40" />
        <div class="text-sm text-muted-foreground">
          {{ configOpacity[0] }}
        </div>
      </ConfigItem>

      <ConfigItem name="Noise Amplitude">
        <Slider
          v-model="configNoiseAmplitude"
          :max="2"
          :step="0.1"
          class="w-40"
        />
        <div class="text-sm text-muted-foreground">
          {{ configNoiseAmplitude[0] }}
        </div>
      </ConfigItem>
    </ConfigGroup>
  </div>
</template>
