<script setup lang="ts">
import { computed } from "vue";

/**
 * Gradient Text Component
 *
 * Creates animated gradient text effects with customizable colors and directions.
 * This implementation is inspired by and references: https://reactbits.dev/text-animations/gradient-text
 */

// Define the props interface for type safety
interface GradientTextProps {
  class?: string;
  colors?: string[]; // Array of color strings with percentages (e.g., "#ff0000 0%")
  animationSpeed?: number; // Animation duration in seconds
  // TODO: Implement animated border feature in a future release
  showBorder?: boolean; // Whether to show animated border (not yet implemented)
  degree?: number; // Gradient angle in degrees (0-360) for linear gradients
  gradientType?: "linear" | "radial"; // Type of gradient to use
}

const props = withDefaults(defineProps<GradientTextProps>(), {
  colors: () => ["#ffaa40", "#9c40ff", "#ffaa40"],
  animationSpeed: 8,
  showBorder: false,
  degree: 90,
  gradientType: "linear",
});

// Computed values derived from props
const animationDuration = computed(() => props.animationSpeed + "s");

// Main gradient style computation - handles both linear and radial gradients
const gradientStyle = computed(() => {
  if (props.gradientType === "radial") {
    // Radial gradient: emanates from center outward in a circle
    const backgroundImage = `radial-gradient(circle, ${props.colors.join(", ")})`;
    return {
      backgroundImage,
      backgroundClip: "text", // Clips the gradient to text shape
      WebkitBackgroundClip: "text", // Safari/WebKit support
      backgroundSize: "200% 200%", // Larger size allows for smooth animation movement
      animation: `radial-gradient-move ${animationDuration.value} ease-in-out infinite`,
    };
  } else {
    // Linear gradient: flows in a straight line at specified angle
    // Determine if gradient is more vertical or horizontal based on angle
    // This affects how we size the background for smooth animation
    const isVertical =
      Math.abs(props.degree % 180) < 45 || Math.abs(props.degree % 180) > 135;

    // For vertical gradients, extend height; for horizontal, extend width
    const backgroundSize = isVertical ? "100% 300%" : "300% 100%";
    const backgroundImage = `linear-gradient(${props.degree}deg, ${props.colors.join(", ")})`;

    return {
      backgroundImage,
      backgroundClip: "text", // Clips the gradient to text shape
      WebkitBackgroundClip: "text", // Safari/WebKit support
      backgroundSize,
      animation: `gradient-move ${animationDuration.value} linear infinite`,
    };
  }
});

// TODO: Border gradient style - for future animated border feature
// borderGradientStyle and borderInnerStyle will be implemented alongside showBorder prop
</script>

<template>
  <!-- Main container with responsive layout and styling -->
  <div
    :class="[
      'relative mx-auto flex max-w-fit flex-row items-center justify-center font-medium backdrop-blur transition-shadow duration-500 overflow-hidden',
      props.class,
    ]"
  >
    <!-- 
      Text element with gradient effect:
      - text-transparent: makes text transparent so gradient shows through
      - bg-cover: ensures background covers entire text area
      - gradient-animate: fallback CSS animation class
      - z-2: ensures text stays above other elements
    -->
    <div
      class="inline-block relative z-2 text-transparent bg-cover gradient-animate color-inherit"
      :style="gradientStyle"
    >
      <!-- Slot for user content (the actual text) -->
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* 
  Linear gradient animation keyframes
  Moves the background position in a smooth cycle to create flowing gradient effect
  The larger background size (300% x 100% or 100% x 300%) allows for smooth movement
*/
@keyframes gradient-move {
  0% {
    background-position: 0% 0%; /* Start at top-left */
  }
  25% {
    background-position: 100% 0%; /* Move to top-right */
  }
  50% {
    background-position: 100% 100%; /* Move to bottom-right */
  }
  75% {
    background-position: 0% 100%; /* Move to bottom-left */
  }
  100% {
    background-position: 0% 0%; /* Return to start for seamless loop */
  }
}

/* 
  Radial gradient animation keyframes
  Moves the center point of the radial gradient around the text area
  Creates a different visual effect compared to linear gradients
*/
@keyframes radial-gradient-move {
  0% {
    background-position: 0% 50%; /* Start at left-center */
  }
  25% {
    background-position: 100% 50%; /* Move to right-center */
  }
  50% {
    background-position: 50% 100%; /* Move to bottom-center */
  }
  75% {
    background-position: 50% 0%; /* Move to top-center */
  }
  100% {
    background-position: 0% 50%; /* Return to start for seamless loop */
  }
}

/* 
  Fallback animation class
  Applied directly to the text element as a safety net
  Uses default 8s duration if JavaScript computation fails
*/
.gradient-animate {
  animation: gradient-move 8s linear infinite;
}
</style>
