<script setup lang="ts">
/* Detail page. The live reference render inside the
 * lit-cutout stage. Shared by all three layouts so the preview is identical and
 * only its placement differs. */
import PreviewStage from "./PreviewStage.vue";
import type { SnippetData } from "./types";
import type { DetailView } from "./view";

defineProps<{
  snippet: SnippetData;
  view: DetailView;
  propValues: Record<string, unknown>;
  /** Bumped to remount the live component (replay a one-shot animation). */
  previewKey: number;
}>();
defineEmits<{ (e: "replay"): void }>();
</script>

<template>
  <PreviewStage
    :reference-label="view.referenceLabel"
    :fallback-note="view.fallbackNote"
    :replayable="snippet.replayable"
    @replay="$emit('replay')"
  >
    <component
      :is="snippet.component"
      :key="previewKey"
      v-bind="propValues"
      :class="snippet.previewClass"
    >
      {{ snippet.usage.children }}
    </component>
  </PreviewStage>
</template>
