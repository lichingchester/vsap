/*
 * Detail page — registry of live preview components (the reference variant of
 * each snippet, the only variant that runs, ADR-0005). Resolved island-side by
 * snippet name, because Astro serialises island props as JSON and a Vue
 * component can't cross that boundary as a prop. Add a line here when a snippet
 * gains a live preview.
 */
import type { Component } from "vue";
import GradientText from "../snippets/text-animations/gradient-text/vue-tailwind/GradientText.vue";
import AnimatedGradientText from "../snippets/text-animations/animated-gradient-text/vue-tailwind/AnimatedGradientText.vue";
import SplitText from "../snippets/text-animations/split-text/vue/SplitText.vue";
import LinkTag from "../snippets/utils/link-tag/vue/LinkTag.vue";

export const previews: Record<string, Component> = {
  "gradient-text": GradientText,
  "animated-gradient-text": AnimatedGradientText,
  "split-text": SplitText,
  "link-tag": LinkTag,
};
