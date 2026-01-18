import { defineConfig } from "vitepress";
import { fileURLToPath, URL } from "url";
import tailwindcss from "@tailwindcss/vite";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "VSAP",
  description:
    "Open-source collection of fancy, animated and useful Vue components for website building.",
  vite: {
    plugins: [tailwindcss()],

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("../..", import.meta.url)),
      },
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Docs", link: "/getting-started/installation" },
      { text: "Components", link: "/components/text-animations/split-text" },
    ],

    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "Installation", link: "/getting-started/installation" },
          // { text: "Quick Start", link: "/getting-started/quick-start" },
          // { text: "Usage", link: "/getting-started/usage" },
          // { text: "Configuration", link: "/getting-started/configuration" },
          // { text: "Contributing", link: "/getting-started/contributing" },
        ],
      },
      {
        text: "Text Animations",
        items: [
          {
            text: "Split Text",
            link: "/components/text-animations/split-text",
          },
          {
            text: "Gradient Text",
            link: "/components/text-animations/gradient-text",
          },
        ],
      },
      {
        text: "Backgrounds",
        items: [
          {
            text: "Aurora",
            link: "/components/backgrounds/aurora",
          },
        ],
      },
      // {
      //   text: "UI Components",
      //   items: [
      //     {
      //       text: "Button",
      //       link: "/components/ui/buttons/button",
      //     },
      //     {
      //       text: "Card",
      //       link: "/components/ui/cards/card",
      //     },
      //   ],
      // },
      {
        text: "Utilities",
        items: [
          {
            text: "Link Tag",
            link: "/components/utils/link-tag",
          },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/lichingchester/vsap" },
    ],

    outline: [2, 3],
  },
});
