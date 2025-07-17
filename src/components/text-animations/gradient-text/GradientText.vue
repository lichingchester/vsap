<script setup lang="ts">
import { computed, defineProps } from "vue";

interface GradientTextProps {
  class?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

const props = defineProps<GradientTextProps>();

const gradientColors = computed(
  () => props.colors ?? ["#ffaa40", "#9c40ff", "#ffaa40"],
);
const animationDuration = computed(() => (props.animationSpeed ?? 8) + "s");

const gradientStyle = computed(() => ({
  backgroundImage: `linear-gradient(to right, ${gradientColors.value.join(", ")})`,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  backgroundSize: "300% 100%",
  animation: `gradient-move ${animationDuration.value} linear infinite`,
}));

const borderGradientStyle = computed(() => ({
  backgroundImage: `linear-gradient(to right, ${gradientColors.value.join(", ")})`,
  backgroundSize: "300% 100%",
  animation: `gradient-move ${animationDuration.value} linear infinite`,
}));

const borderInnerStyle = {
  width: "calc(100% - 2px)",
  height: "calc(100% - 2px)",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
};
</script>

<template>
  <div
    :class="[
      'relative mx-auto flex max-w-fit flex-row items-center justify-center font-medium backdrop-blur transition-shadow duration-500 overflow-hidden cursor-pointer',
      props.class,
    ]"
  >
    <div
      class="inline-block relative z-2 text-transparent bg-cover gradient-animate"
      :style="gradientStyle"
    >
      <slot />
    </div>
  </div>
</template>

<style>
@keyframes gradient-move {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.gradient-animate {
  /* fallback in case JS fails */
  animation: gradient-move 8s linear infinite;
}
</style>
