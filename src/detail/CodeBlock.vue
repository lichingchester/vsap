<script setup lang="ts">
/*
 * Detail page. One copy artifact rendered as a code
 * block: a mono filename tab, Shiki-highlighted body, and a keyboard-operable
 * Copy button with a "Copied" state and visible focus ring (point 4: filename +
 * copy feedback, WCAG 2.2 AA). Reactive — re-highlights when `code` changes, so
 * the live Usage block updates as the playground controls move.
 */
import { ref, watch, onMounted } from "vue";
import { getHighlighter, SHIKI_THEMES } from "./highlighter";

const props = defineProps<{
  code: string;
  lang: string;
  filename: string;
  /** Small kind label shown before the filename, e.g. "source" / "usage". */
  kind?: string;
  /** IDE treatment (S3): gutter line numbers. */
  lineNumbers?: boolean;
  /** IDE treatment (S3): offer a soft-wrap toggle. */
  wrappable?: boolean;
}>();

const html = ref("");
const copied = ref(false);
const wrap = ref(false);

async function render() {
  try {
    const hl = await getHighlighter();
    html.value = hl.codeToHtml(props.code, {
      lang: props.lang,
      themes: SHIKI_THEMES,
      defaultColor: "dark",
    });
  } catch {
    // Unknown lang or load failure — fall back to plain, escaped text.
    const esc = props.code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    html.value = `<pre class="shiki"><code>${esc}</code></pre>`;
  }
}

async function copy() {
  await navigator.clipboard.writeText(props.code);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1600);
}

onMounted(render);
watch(() => [props.code, props.lang], render);
</script>

<template>
  <figure class="sd-code" :class="{ 'sd-code--ln': lineNumbers, 'sd-code--wrap': wrap }">
    <figcaption class="sd-code__bar">
      <span class="sd-code__name">
        <span v-if="kind" class="sd-code__kind">{{ kind }}</span>
        {{ filename }}
      </span>
      <span class="sd-code__actions">
        <button
          v-if="wrappable"
          class="sd-code__wrap"
          type="button"
          :aria-pressed="wrap"
          @click="wrap = !wrap"
        >
          wrap
        </button>
        <button
          class="sd-code__copy"
          type="button"
          :data-copied="copied"
          @click="copy"
        >
          {{ copied ? "Copied ✓" : "Copy" }}
        </button>
      </span>
    </figcaption>
    <div class="sd-code__body" v-html="html"></div>
  </figure>
</template>
