<script setup lang="ts">
/* THROWAWAY (detail-page /demos harness). The live reference render inside the
 * lit-cutout stage. Shared by all three layouts so the preview is identical and
 * only its placement differs. */
import PreviewStage from "./PreviewStage.vue";
import type { DemoSnippet } from "./catalog";
import type { DetailView } from "./view";

defineProps<{
  snippet: DemoSnippet;
  view: DetailView;
  propValues: Record<string, unknown>;
}>();
</script>

<template>
  <PreviewStage :reference-label="view.referenceLabel" :fallback-note="view.fallbackNote">
    <component
      :is="snippet.component"
      v-bind="propValues"
      :class="snippet.previewClass"
    >
      {{ snippet.usage.children }}
    </component>
  </PreviewStage>
</template>
