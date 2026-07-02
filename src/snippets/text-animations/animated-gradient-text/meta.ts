import type { SnippetMeta } from "../../types";

export const meta: SnippetMeta = {
  name: "animated-gradient-text",
  title: "Animated Gradient Text",
  description:
    "Text painted with a linear gradient that flows across the letters. Pass " +
    "any list of colors, a direction, and a speed. A visual effect, so the " +
    "Vue + Tailwind cell is the reference and the others are hand-checked ports " +
    "of it. For a still gradient with no motion, see Gradient Text.",
  kind: "effect",
  category: "text-animations",
  // Visual effect — participates in the Tailwind vs CSS styling axis.
  hasStylingAxis: true,
  // Flagship: ships the opt-in interactive playground (color / degree / speed).
  playground: true,
  previewClass: "text-5xl font-semibold sm:text-6xl",
  previewProps: {
    colors: ["#ffaa40", "#9c40ff", "#ffaa40"],
    degree: 90,
    animationSpeed: 8,
  },
  controls: [
    { prop: "colors", label: "Colors", kind: "colors" },
    { prop: "degree", label: "Direction", kind: "range", min: 0, max: 360, step: 1, unit: "°" },
    { prop: "animationSpeed", label: "Loop", kind: "range", min: 1, max: 10, step: 0.1, unit: "s" },
  ],
  usage: {
    tag: "AnimatedGradientText",
    children: "Animated Gradient Text",
    props: ["colors", "degree", "animationSpeed"],
  },
  props: [
    {
      name: "colors",
      type: "string[]",
      default: "['#ffaa40', '#9c40ff', '#ffaa40']",
      description:
        "Gradient colours, in order. Repeat the first colour last for a seamless loop.",
    },
    {
      name: "degree",
      type: "number",
      default: "90",
      description: "Gradient direction, in degrees (0–360).",
    },
    {
      name: "animationSpeed",
      type: "number",
      default: "8",
      description: "One full loop, in seconds. Higher is slower.",
    },
  ],
  variants: [
    {
      id: "vue-tailwind",
      framework: "vue",
      styling: "tailwind",
      label: "Vue + Tailwind",
      entry: "AnimatedGradientText.vue",
      reference: true,
      prerequisites: [
        { note: "Tailwind v4 configured.", href: "https://tailwindcss.com/docs/installation" },
      ],
    },
    {
      id: "vue-css",
      framework: "vue",
      styling: "css",
      label: "Vue + CSS",
      entry: "AnimatedGradientText.vue",
      // No prerequisites — styles are scoped in the SFC; the section is hidden.
    },
    {
      id: "react-tailwind",
      framework: "react",
      styling: "tailwind",
      label: "React + Tailwind",
      entry: "AnimatedGradientText.tsx",
      prerequisites: [
        { note: "Tailwind v4 configured.", href: "https://tailwindcss.com/docs/installation" },
      ],
    },
    {
      id: "react-css",
      framework: "react",
      styling: "css",
      label: "React + CSS",
      entry: "AnimatedGradientText.tsx",
      prerequisites: [
        { note: "Also copy AnimatedGradientText.css next to the component and keep the import." },
      ],
    },
    {
      id: "html",
      framework: "html",
      styling: "css",
      label: "HTML",
      entry: "animated-gradient-text.html",
      // No prerequisites — self-contained <style> + markup; the section is hidden.
    },
  ],
};

export default meta;
