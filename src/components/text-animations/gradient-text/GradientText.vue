<script setup lang="ts">
import { computed, defineProps } from "vue";

interface GradientTextProps {
  class?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  degree?: number;
}

const props = defineProps<GradientTextProps>();

const gradientColors = computed(
  () => props.colors ?? ["#ffaa40", "#9c40ff", "#ffaa40"],
);
const animationDuration = computed(() => (props.animationSpeed ?? 8) + "s");
const gradientDegree = computed(() => props.degree ?? 90);

const gradientStyle = computed(() => {
  // Adjust background size based on degree for better animation
  const isVertical =
    Math.abs(gradientDegree.value % 180) < 45 ||
    Math.abs(gradientDegree.value % 180) > 135;
  const backgroundSize = isVertical ? "100% 300%" : "300% 100%";

  return {
    backgroundImage: `linear-gradient(${gradientDegree.value}deg, ${gradientColors.value.join(", ")})`,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    backgroundSize,
    animation: `gradient-move ${animationDuration.value} linear infinite`,
  };
});

const borderGradientStyle = computed(() => {
  // Adjust background size based on degree for better animation
  const isVertical =
    Math.abs(gradientDegree.value % 180) < 45 ||
    Math.abs(gradientDegree.value % 180) > 135;
  const backgroundSize = isVertical ? "100% 300%" : "300% 100%";

  return {
    backgroundImage: `linear-gradient(${gradientDegree.value}deg, ${gradientColors.value.join(", ")})`,
    backgroundSize,
    animation: `gradient-move ${animationDuration.value} linear infinite`,
  };
});

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
    background-position: 0% 0%;
  }
  25% {
    background-position: 100% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  75% {
    background-position: 0% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}
.gradient-animate {
  /* fallback in case JS fails */
  animation: gradient-move 8s linear infinite;
}
</style>
