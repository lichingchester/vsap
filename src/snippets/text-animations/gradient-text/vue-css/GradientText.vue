<script setup lang="ts">
import { computed } from "vue";

/**
 * GradientText — text painted with a linear gradient, clipped to the glyphs.
 *
 * Pass any number of colors; CSS distributes the stops evenly. For a version
 * that flows, see the Animated Gradient Text snippet.
 */
interface GradientTextProps {
  /** Gradient colors, in order. */
  colors?: string[];
  /** Gradient direction, in degrees (0–360). */
  degree?: number;
}

const props = withDefaults(defineProps<GradientTextProps>(), {
  colors: () => ["#ffaa40", "#9c40ff", "#ffaa40"],
  degree: 90,
});

const gradientStyle = computed(() => ({
  backgroundImage: `linear-gradient(${props.degree}deg, ${props.colors.join(", ")})`,
}));
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
}
</style>
