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
      { text: "Examples", link: "/markdown-examples" },
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
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],

    outline: [2, 3],
  },
});
