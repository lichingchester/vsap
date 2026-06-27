<script setup lang="ts">
import { computed } from "vue";

/**
 * GradientText — text painted with an animated linear gradient.
 *
 * The gradient is clipped to the glyphs and its background-position is
 * animated, so the colors appear to flow across the letters. Pass any number
 * of colors; CSS distributes the stops evenly.
 */
interface GradientTextProps {
  /** Gradient colors, in order. Repeat the first color last for a seamless loop. */
  colors?: string[];
  /** One full loop, in seconds. */
  animationSpeed?: number;
  /** Gradient direction, in degrees (0–360). */
  degree?: number;
}

const props = withDefaults(defineProps<GradientTextProps>(), {
  colors: () => ["#ffaa40", "#9c40ff", "#ffaa40"],
  animationSpeed: 8,
  degree: 90,
});

const gradientStyle = computed(() => {
  // A near-vertical gradient animates along Y, a near-horizontal one along X;
  // the oversized axis is what gives the background-position room to travel.
  const d = ((props.degree % 360) + 360) % 360;
  const isVertical = d % 180 < 45 || d % 180 > 135;
  return {
    backgroundImage: `linear-gradient(${props.degree}deg, ${props.colors.join(", ")})`,
    backgroundSize: isVertical ? "100% 300%" : "300% 100%",
    animationDuration: `${props.animationSpeed}s`,
  };
});
</script>

<template>
  <span class="gradient-text" :style="gradientStyle">
    <slot />
  </span>
</template>

<style scoped>
.gradient-text {
  display: inline-block;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  animation-name: gradient-text-move;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes gradient-text-move {
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
</style>
