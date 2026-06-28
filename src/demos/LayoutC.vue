<script setup lang="ts">
/*
 * THROWAWAY (detail-page /demos harness) — Layout C "Console (code-forward)".
 * Two columns: a live playground (preview + controls) on the left, a persistent
 * code pane on the right stacking Source + Usage with filename tabs + copy,
 * framed like a terminal. Code gets permanent real estate — "the core is the
 * source copy". API sits below, full width.
 */
import LivePreview from "./LivePreview.vue";
import Controls from "./Controls.vue";
import CodeBlock from "./CodeBlock.vue";
import InstallBlock from "./InstallBlock.vue";
import ApiTableVue from "./ApiTableVue.vue";
import VariantSelector from "./VariantSelector.vue";
import type { DemoSnippet } from "./catalog";
import type { DetailView } from "./view";

defineProps<{
  snippet: DemoSnippet;
  view: DetailView;
  propValues: Record<string, unknown>;
}>();
defineEmits<{
  (e: "update", v: Record<string, unknown>): void;
  (e: "reset"): void;
}>();
</script>

<template>
  <div class="lay-c">
    <section id="preview" class="s-section lay-c__split">
      <div class="lay-c__play">
        <LivePreview :snippet="snippet" :view="view" :prop-values="propValues" />
        <Controls
          v-if="snippet.controls.length"
          :controls="snippet.controls"
          :values="propValues"
          @update="$emit('update', $event)"
          @reset="$emit('reset')"
        />
        <InstallBlock :install="view.install" :notes="view.notes" />
      </div>

      <div id="source" class="lay-c__pane">
        <div class="lay-c__panebar">
          <span class="lay-c__panetitle">source</span>
          <VariantSelector compact />
        </div>
        <CodeBlock
          v-for="src in view.sources"
          :key="src.filename"
          :code="src.code"
          :lang="src.lang"
          :filename="src.filename"
          kind="source"
        />
        <CodeBlock
          v-if="view.usage"
          :code="view.usage.code"
          :lang="view.usage.lang"
          :filename="view.usage.filename"
          kind="usage"
        />
      </div>
    </section>

    <section id="api" class="s-section">
      <h2 class="s-h2">API</h2>
      <ApiTableVue :rows="snippet.props" />
    </section>
  </div>
</template>
