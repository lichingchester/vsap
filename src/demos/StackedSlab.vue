<script setup lang="ts">
/*
 * THROWAWAY (detail-page /demos harness) — Stacked variation S2 "Slab".
 * Section design: each section led by a small uppercase mono LABEL TAB rather
 * than a ruled heading; spacing (not rules) separates them. Heading: page title
 * carries a kind badge. TOC: a boxed panel with filled dot markers (no border
 * stripe). Code block: the variant selector sits in a toolbar fused to the top
 * of the Source code group — "selector at the code block".
 */
import { computed } from "vue";
import LivePreview from "./LivePreview.vue";
import Controls from "./Controls.vue";
import CodeBlock from "./CodeBlock.vue";
import InstallBlock from "./InstallBlock.vue";
import ApiTableVue from "./ApiTableVue.vue";
import VariantSelector from "./VariantSelector.vue";
import { sectionList } from "./view";
import { useScrollSpy } from "./scroll";
import type { DemoSnippet } from "./catalog";
import type { DetailView } from "./view";

const props = defineProps<{
  snippet: DemoSnippet;
  view: DetailView;
  propValues: Record<string, unknown>;
}>();
defineEmits<{
  (e: "update", v: Record<string, unknown>): void;
  (e: "reset"): void;
}>();

const sections = computed(() => sectionList(props.view));
const active = useScrollSpy();
</script>

<template>
  <div class="doc-grid lay-s2">
    <div class="doc-main">
      <p class="s-bc">
        <span class="s-bc__group">{{ snippet.category }} /</span>
        <span class="s-bc__name">{{ snippet.name }}</span>
      </p>
      <div class="slab-titlerow">
        <h1 class="slab-title">{{ snippet.title }}</h1>
        <span class="slab-badge">{{ snippet.kind }}</span>
      </div>

      <section id="preview" class="s-section slab-sec">
        <span class="slab-tag">Preview</span>
        <LivePreview :snippet="snippet" :view="view" :prop-values="propValues" />
        <Controls
          v-if="snippet.controls.length"
          class="slab-controls"
          :controls="snippet.controls"
          :values="propValues"
          @update="$emit('update', $event)"
          @reset="$emit('reset')"
        />
      </section>

      <section v-if="view.install || view.notes.length" id="install" class="s-section slab-sec">
        <span class="slab-tag">Install</span>
        <InstallBlock :install="view.install" :notes="view.notes" />
      </section>

      <section id="source" class="s-section slab-sec">
        <span class="slab-tag">{{ view.isHtml ? "Source" : "Component" }}</span>
        <div class="slab-codewrap">
          <div class="slab-codebar">
            <span class="slab-codebar__hint">choose a variant</span>
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
        </div>
      </section>

      <section v-if="view.usage" id="usage" class="s-section slab-sec">
        <span class="slab-tag">Usage</span>
        <CodeBlock
          :code="view.usage.code"
          :lang="view.usage.lang"
          :filename="view.usage.filename"
          kind="usage"
        />
      </section>

      <section id="api" class="s-section slab-sec">
        <span class="slab-tag">API</span>
        <ApiTableVue :rows="snippet.props" />
      </section>
    </div>

    <nav class="toc-box" aria-label="On this page">
      <p class="toc-box__title">On this page</p>
      <a
        v-for="s in sections"
        :key="s.id"
        :href="`#${s.id}`"
        :aria-current="active === s.id"
      >
        <span class="toc-box__dot"></span>{{ s.label }}
      </a>
    </nav>
  </div>
</template>
