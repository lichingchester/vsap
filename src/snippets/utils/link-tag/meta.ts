import type { SnippetMeta } from "../../types";

export const meta: SnippetMeta = {
  name: "link-tag",
  title: "Link Tag",
  description:
    "A universal link that renders the right element for the context — a " +
    "router link for internal navigation, a plain <a> for external URLs, or a " +
    "<div> when you just want the content. A utility, so each framework gets " +
    "its own idiomatic implementation rather than a port of one reference.",
  kind: "utility",
  category: "utils",
  // Behavioural snippet — no Tailwind vs CSS distinction.
  hasStylingAxis: false,
  variants: [
    {
      id: "vue",
      framework: "vue",
      label: "Vue",
      entry: "LinkTag.vue",
      native: true,
      prerequisites: [
        {
          npm: "vue-router",
          note: "Optional — gracefully falls back to a plain <a> when vue-router isn't installed.",
        },
      ],
    },
    {
      id: "vue-nuxt",
      framework: "vue-nuxt",
      label: "Nuxt",
      entry: "LinkTag.vue",
      native: true,
      prerequisites: [
        { note: "Uses Nuxt's built-in <NuxtLink> — no extra install." },
      ],
    },
    {
      id: "react-next",
      framework: "react-next",
      label: "React (Next.js)",
      entry: "LinkTag.tsx",
      native: true,
      prerequisites: [{ npm: "next", note: "Uses next/link." }],
    },
    {
      id: "html",
      framework: "html",
      label: "HTML",
      entry: "link-tag.html",
      native: true,
      prerequisites: [{ note: "No dependencies — plain <a>." }],
    },
  ],
};

export default meta;
