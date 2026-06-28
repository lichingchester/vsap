<script setup lang="ts">
/*
 * THROWAWAY (detail-page /demos harness) — Stacked variation S1 "Ledger".
 * Section design: numbered, full-width ruled headings (01 Preview), generous
 * rhythm, no panels. Heading: mono index + label + hover anchor. TOC: the
 * DESIGN.md-sanctioned left-border reading rail, numbered, amber on active.
 * Code block: minimal (filename + copy). Variant selector lives in the Source
 * heading row — not the page head.
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
const num = computed(() =>
  Object.fromEntries(
    sections.value.map((s, i) => [s.id, String(i + 1).padStart(2, "0")]),
  ),
);
const active = useScrollSpy();
</script>

<template>
  <div class="doc-grid lay-s1">
    <div class="doc-main">
      <p class="s-bc">
        <span class="s-bc__group">{{ snippet.category }} /</span>
        <span class="s-bc__name">{{ snippet.name }}</span>
      </p>
      <h1 class="led-title">{{ snippet.title }}</h1>

      <section id="preview" class="s-section">
        <h2 class="led-h"><span class="led-h__num">{{ num.preview }}</span> Preview</h2>
        <LivePreview :snippet="snippet" :view="view" :prop-values="propValues" />
        <Controls
          v-if="snippet.controls.length"
          class="led-controls"
          :controls="snippet.controls"
          :values="propValues"
          @update="$emit('update', $event)"
          @reset="$emit('reset')"
        />
      </section>

      <section v-if="view.install || view.notes.length" id="install" class="s-section">
        <h2 class="led-h"><span class="led-h__num">{{ num.install }}</span> Install</h2>
        <InstallBlock :install="view.install" :notes="view.notes" />
      </section>

      <section id="source" class="s-section">
        <div class="led-h-row">
          <h2 class="led-h">
            <span class="led-h__num">{{ num.source }}</span>
            {{ view.isHtml ? "Source" : "Component" }}
          </h2>
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
        <h2 class="led-h"><span class="led-h__num">{{ num.usage }}</span> Usage</h2>
        <CodeBlock
          :code="view.usage.code"
          :lang="view.usage.lang"
          :filename="view.usage.filename"
          kind="usage"
        />
      </section>

      <section id="api" class="s-section">
        <h2 class="led-h"><span class="led-h__num">{{ num.api }}</span> API</h2>
        <ApiTableVue :rows="snippet.props" />
      </section>
    </div>

    <nav class="toc-rail" aria-label="On this page">
      <p class="toc-rail__title">On this page</p>
      <a
        v-for="s in sections"
        :key="s.id"
        :href="`#${s.id}`"
        :aria-current="active === s.id"
      >
        <span class="toc-rail__num">{{ num[s.id] }}</span>{{ s.label }}
      </a>
    </nav>
  </div>
</template>
