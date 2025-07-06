<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Register required GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Interface for animation properties (from/to states)
 * Allows flexible animation property definition
 */
interface AnimationProperties {
  [key: string]: any; // Allow any additional GSAP properties
}

/**
 * Main component props interface
 */
interface SplitTextProps {
  text: string; // Text content to be animated
  classes?: string; // Optional CSS class for styling
  stagger?: number; // Delay between each element animation (in seconds)
  duration?: number; // Duration of each element animation (in seconds)
  ease?: string; // GSAP easing function
  type?: string; // Type option for GSAP SplitText: "lines", "words", "chars", etc.
  from?: AnimationProperties; // Starting animation state
  to?: AnimationProperties; // Ending animation state
  start?: string; // Intersection threshold for triggering animation
  mask?: "lines" | "words" | "chars" | undefined; // Masking option for GSAP SplitText
  isManualPlay?: boolean; // Whether to trigger animation manually instead of on scroll
}

// Props definition with default values
const props = withDefaults(defineProps<SplitTextProps>(), {
  classes: "",
  stagger: 0.05,
  duration: 1,
  ease: "power4.out",
  type: "words",
  from: () => ({ opacity: 0, y: 60, visibility: "hidden" }),
  to: () => ({ opacity: 1, y: 0, visibility: "visible" }),
  start: "top 90%",
  mask: undefined,
  isManualPlay: false,
});

// Define emitted events
const emit = defineEmits<{
  "animation-completed": []; // Emitted when animation completes
}>();

// Refs and state variables
const splitTextRef = ref<HTMLElement | null>(null); // Reference to the DOM element
const isAnimationCompleted = ref<boolean>(false); // Track animation completion state
let timeline: gsap.core.Timeline | null = null; // GSAP timeline for animation
let textSplitter: any = null; // GSAP SplitText instance

/**
 * Sets up the animation for the split text elements
 * @param splitter - GSAP SplitText instance
 * @param element - Target DOM element
 */
const setupAnimation = (splitter: SplitText, element: HTMLElement): void => {
  // Determine which elements to animate based on type
  const animationTargets: Element[] = [];

  // Make sure no duplicate animated elements
  if (props.type.includes("chars")) {
    animationTargets.push(...splitter.chars);
  } else if (props.type.includes("words")) {
    animationTargets.push(...splitter.words);
  } else if (props.type.includes("lines")) {
    animationTargets.push(...splitter.lines);
  }

  // Optimize animation performance with will-change
  animationTargets.forEach((target: Element) => {
    if (!(target instanceof HTMLElement)) return;
    target.style.willChange = "transform, opacity";
  });

  // Set initial styles for targets
  gsap.set(animationTargets, {
    ...props.from,
    immediateRender: false,
    force3D: true, // Hardware acceleration
  });

  // Clean up previous timeline if it exists
  if (timeline) {
    timeline.kill();
  }

  // Create new animation timeline
  timeline = gsap.timeline({
    paused: true, // Start paused, will be played by ScrollTrigger or manually
    scrollTrigger: props.isManualPlay
      ? undefined
      : {
          trigger: element,
          start: props.start,
          toggleActions: "play none none none",
          once: true, // Only trigger once
          // markers: true,
        },
    smoothChildTiming: true,
    onComplete: () => {
      // Handle animation completion
      isAnimationCompleted.value = true;

      // Ensure final state and clean up properties
      gsap.set(animationTargets, {
        ...props.to,
        clearProps: "willChange", // Clean up will-change for better performance
        immediateRender: true,
      });

      // Emit completion event
      emit("animation-completed");
    },
    onReverseComplete: () => {
      // Reset animation state when reversed
      isAnimationCompleted.value = false;
    },
  });

  // Build the animation sequence
  timeline.set(animationTargets, {
    ...props.from,
    immediateRender: false,
    force3D: true,
  });

  // For more complex animations, you can add stagger effects here
  timeline.to(animationTargets, {
    ...props.to,
    duration: props.duration,
    ease: props.ease,
    stagger: props.stagger,
    force3D: true,
  });
};

/**
 * Initialize or reinitialize the text splitting and animation
 */
const initializeSplitText = (): void => {
  const element = splitTextRef.value;
  if (!element || isAnimationCompleted.value) return;

  // Clean up previous split if it exists
  if (textSplitter) {
    textSplitter.revert();
  }

  // Create new SplitText instance
  textSplitter = new SplitText(element, {
    type: props.type,
    mask: props.mask,
    autoSplit: true,
    onSplit: (self) => {
      return setupAnimation(self, element);
    },
  });

  // Set up animation with the new splitter
  setupAnimation(textSplitter, element);
};

// Initialize animation when component is mounted
onMounted(() => {
  initializeSplitText();
});

// Functions
// Trigger animation manually if isManualPlay is true
const play = () => {
  if (props.isManualPlay && timeline) {
    timeline.play();
  }
};

const reverse = () => {
  if (props.isManualPlay && timeline) {
    timeline.reverse();
  }
};

// Watch for prop changes that require re-initialization
watch(
  [
    () => props.text,
    () => props.stagger,
    () => props.classes,
    () => props.mask,
    () => props.duration,
    () => props.ease,
    () => props.type,
    () => props.from,
    () => props.to,
    () => props.start,
  ],
  () => {
    // Reset animation state and reinitialize
    isAnimationCompleted.value = false;
    initializeSplitText();
  },
  { deep: true } // Watch deeply for object changes
);

// Clean up resources when component is unmounted
onBeforeUnmount(() => {
  // Kill animation timeline
  if (timeline) {
    timeline.kill();
  }

  // Remove any ScrollTrigger instances associated with this element
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.vars.trigger === splitTextRef.value) {
      trigger.kill();
    }
  });

  // Clean up split text animations and revert DOM changes
  if (textSplitter) {
    gsap.killTweensOf(textSplitter.chars);
    gsap.killTweensOf(textSplitter.words);
    gsap.killTweensOf(textSplitter.lines);
    textSplitter.revert();
  }
});

// Expose methods for manual control
defineExpose({
  play,
  reverse,
  isAnimationCompleted,
});
</script>

<template>
  <div ref="splitTextRef" :class="`${classes}`">
    {{ text }}
  </div>
</template>

<style scoped>
/* Add any component-specific styles here */
</style>
