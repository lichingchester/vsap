import type { SnippetMeta } from "../../types";

export const meta: SnippetMeta = {
  name: "split-text",
  title: "Split Text",
  description:
    "A GSAP reveal that splits a heading into characters, words, or lines and " +
    "staggers them into view as it scrolls on-screen — with optional masking " +
    "for the polished 'rise from behind a clipped edge' look. A visual effect, " +
    "so the Vue cell is the reference and the React and HTML cells are " +
    "hand-checked ports of the same GSAP logic. Needs the (now-free) GSAP " +
    "SplitText and ScrollTrigger plugins.",
  kind: "effect",
  category: "text-animations",
  // GSAP animates the text nodes directly — there's no Tailwind vs CSS
  // distinction, so this effect opts out of the styling axis.
  hasStylingAxis: false,
  // Flagship: interactive playground (split-by / mask / stagger / duration).
  playground: true,
  // One-shot reveal — the preview stage shows a Replay button (remounts to replay).
  replayable: true,
  previewClass: "text-4xl font-semibold tracking-tight sm:text-5xl",
  previewProps: {
    splitBy: "chars",
    mask: true,
    stagger: 0.05,
    duration: 0.8,
  },
  controls: [
    {
      prop: "splitBy",
      label: "Split by",
      kind: "segmented",
      options: [
        { value: "chars", label: "Chars" },
        { value: "words", label: "Words" },
        { value: "lines", label: "Lines" },
      ],
    },
    { prop: "mask", label: "Mask", kind: "toggle" },
    { prop: "stagger", label: "Stagger", kind: "range", min: 0, max: 0.2, step: 0.01, unit: "s" },
    { prop: "duration", label: "Duration", kind: "range", min: 0.1, max: 2, step: 0.1, unit: "s" },
  ],
  usage: {
    tag: "SplitText",
    children: "Reveal your words, one line at a time",
    props: ["splitBy", "mask", "stagger", "duration"],
  },
  props: [
    {
      name: "splitBy",
      type: '"chars" | "words" | "lines"',
      default: '"chars"',
      description:
        "What to split the text into before staggering. Chars is the flashiest; words is lighter for longer copy.",
    },
    {
      name: "mask",
      type: "boolean",
      default: "true",
      description:
        "Clip each unit so the text rises from behind a hard edge — the polished reveal. Maps to GSAP's mask option.",
    },
    {
      name: "stagger",
      type: "number",
      default: "0.05",
      description: "Delay between each unit's animation, in seconds.",
    },
    {
      name: "duration",
      type: "number",
      default: "0.8",
      description: "Duration of each unit's animation, in seconds.",
    },
    {
      name: "ease",
      type: "string",
      default: '"power4.out"',
      description: "GSAP easing function for the reveal.",
    },
    {
      name: "from",
      type: "Record<string, number | string>",
      default: '{ opacity: 0, y: "100%" }',
      description:
        "Starting GSAP state for each unit. Any tween vars — swap in x, rotate, or scale for a different entrance.",
    },
    {
      name: "to",
      type: "Record<string, number | string>",
      default: "{ opacity: 1, y: 0 }",
      description: "Ending GSAP state for each unit.",
    },
  ],
  variants: [
    {
      id: "vue",
      framework: "vue",
      label: "Vue",
      entry: "SplitText.vue",
      reference: true,
      prerequisites: [
        {
          npm: "gsap",
          version: "^3.13",
          note: "SplitText and ScrollTrigger ship inside the gsap package (free since v3.13).",
        },
      ],
    },
    {
      id: "react",
      framework: "react",
      label: "React",
      entry: "SplitText.tsx",
      prerequisites: [
        {
          npm: "gsap",
          version: "^3.13",
          note: "SplitText and ScrollTrigger ship inside the gsap package (free since v3.13).",
        },
      ],
    },
    {
      id: "html",
      framework: "html",
      label: "HTML",
      entry: "split-text.html",
      prerequisites: [
        { cdn: "https://cdn.jsdelivr.net/npm/gsap@3.13/dist/gsap.min.js" },
        { cdn: "https://cdn.jsdelivr.net/npm/gsap@3.13/dist/ScrollTrigger.min.js" },
        {
          cdn: "https://cdn.jsdelivr.net/npm/gsap@3.13/dist/SplitText.min.js",
          note: "Load these three <script> tags before the inline script below.",
        },
      ],
    },
  ],
};

export default meta;
