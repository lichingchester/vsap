import type { SnippetMeta } from "../../types";

export const meta: SnippetMeta = {
  name: "gradient-text",
  title: "Gradient Text",
  description:
    "Text painted with an animated linear gradient that flows across the " +
    "letters. Pass any list of colors, a direction, and a speed. A visual " +
    "effect, so the Vue + Tailwind cell is the reference and the others are " +
    "hand-checked ports of it.",
  kind: "effect",
  category: "text-animations",
  // Visual effect — participates in the Tailwind vs CSS styling axis.
  hasStylingAxis: true,
  // Flagship: ships the opt-in interactive playground (color / degree / speed).
  playground: true,
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
      entry: "GradientText.vue",
      reference: true,
      prerequisites: [{ note: "Tailwind v4 configured." }],
    },
    {
      id: "vue-css",
      framework: "vue",
      styling: "css",
      label: "Vue + CSS",
      entry: "GradientText.vue",
      prerequisites: [{ note: "No dependencies — styles are scoped in the SFC." }],
    },
    {
      id: "react-tailwind",
      framework: "react",
      styling: "tailwind",
      label: "React + Tailwind",
      entry: "GradientText.tsx",
      prerequisites: [{ note: "Tailwind v4 configured." }],
    },
    {
      id: "react-css",
      framework: "react",
      styling: "css",
      label: "React + CSS",
      entry: "GradientText.tsx",
      prerequisites: [
        { note: "Also copy GradientText.css next to the component and keep the import." },
      ],
    },
    {
      id: "html",
      framework: "html",
      styling: "css",
      label: "HTML",
      entry: "gradient-text.html",
      prerequisites: [{ note: "No dependencies — self-contained <style> + markup." }],
    },
  ],
};

export default meta;
