<script setup lang="ts">
/*
 * THROWAWAY (detail-page /demos harness) — Layout A "Stacked docs".
 * Linear evolution of today's page, reordered for the copy job:
 *   Preview (live + controls) -> Install -> Source -> Usage -> API.
 * One variant selector sits above the code region.
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
  <div class="lay-a">
    <section id="preview" class="s-section">
      <h2 class="s-h2">Preview</h2>
      <LivePreview :snippet="snippet" :view="view" :prop-values="propValues" />
      <Controls
        v-if="snippet.controls.length"
        class="lay-a__controls"
        :controls="snippet.controls"
        :values="propValues"
        @update="$emit('update', $event)"
        @reset="$emit('reset')"
      />
    </section>

    <section
      v-if="view.install || view.notes.length"
      id="install"
      class="s-section"
    >
      <h2 class="s-h2">Install</h2>
      <InstallBlock :install="view.install" :notes="view.notes" />
    </section>

    <section id="source" class="s-section">
      <div class="s-h2-row">
        <h2 class="s-h2">{{ view.isHtml ? "Source" : "Component" }}</h2>
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
    </section>

    <section v-if="view.usage" id="usage" class="s-section">
      <h2 class="s-h2">Usage</h2>
      <CodeBlock
        :code="view.usage.code"
        :lang="view.usage.lang"
        :filename="view.usage.filename"
        kind="usage"
      />
    </section>

    <section id="api" class="s-section">
      <h2 class="s-h2">API</h2>
      <ApiTableVue :rows="snippet.props" />
    </section>
  </div>
</template>
