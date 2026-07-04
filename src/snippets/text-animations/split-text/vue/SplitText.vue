<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/** Any GSAP tween vars — e.g. { opacity: 0, y: "100%" }. */
type TweenVars = Record<string, number | string>;

const props = withDefaults(
  defineProps<{
    /** What to split the slotted text into before staggering. */
    splitBy?: "chars" | "words" | "lines";
    /** Clip each unit so it rises from behind a hard edge. */
    mask?: boolean;
    /** Delay between each unit's animation, in seconds. */
    stagger?: number;
    /** Duration of each unit's animation, in seconds. */
    duration?: number;
    /** GSAP easing function for the reveal. */
    ease?: string;
    /** Starting GSAP state for each unit. */
    from?: TweenVars;
    /** Ending GSAP state for each unit. */
    to?: TweenVars;
  }>(),
  {
    splitBy: "chars",
    mask: true,
    stagger: 0.05,
    duration: 0.8,
    ease: "power4.out",
    from: () => ({ opacity: 0, y: "100%" }),
    to: () => ({ opacity: 1, y: 0 }),
  },
);

const root = ref<HTMLElement | null>(null);
let split: SplitText | null = null;

onMounted(() => {
  const el = root.value;
  if (!el) return;

  // Respect reduced-motion — leave the text in place, no reveal.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger, SplitText);

  split = SplitText.create(el, {
    type: props.splitBy,
    mask: props.mask ? props.splitBy : undefined,
    autoSplit: true, // re-split on resize / font load
    // Build the tween in onSplit so it re-binds to the freshly split units.
    onSplit: (self) => {
      const units =
        props.splitBy === "words"
          ? self.words
          : props.splitBy === "lines"
            ? self.lines
            : self.chars;
      return gsap.fromTo(units, props.from, {
        ...props.to,
        duration: props.duration,
        ease: props.ease,
        stagger: props.stagger,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    },
  });
});

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach((t) => {
    if (t.vars.trigger === root.value) t.kill();
  });
  split?.revert();
  split = null;
});
</script>

<template>
  <div ref="root"><slot /></div>
</template>
