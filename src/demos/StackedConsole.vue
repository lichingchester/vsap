<script setup lang="ts">
/*
 * THROWAWAY (detail-page /demos harness) — Stacked variation S3 "Console".
 * Section design: tight rhythm, sticky mini-headers (a section heading sticks
 * under the top nav while its section is in view) with a leading accent tick.
 * Heading: compact. TOC: a right rail with a scroll-PROGRESS fill plus links,
 * active section marked. Code block: IDE treatment — gutter line numbers + a
 * wrap toggle, with a sticky code toolbar holding the variant selector.
 */
import { computed } from "vue";
import LivePreview from "./LivePreview.vue";
import Controls from "./Controls.vue";
import CodeBlock from "./CodeBlock.vue";
import InstallBlock from "./InstallBlock.vue";
import ApiTableVue from "./ApiTableVue.vue";
import VariantSelector from "./VariantSelector.vue";
import { sectionList } from "./view";
import { useScrollSpy, useScrollProgress } from "./scroll";
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
const progress = useScrollProgress();
</script>

<template>
  <div class="doc-grid lay-s3">
    <div class="doc-main">
      <p class="con-bc">
        <span class="s-bc__group">{{ snippet.category }}/</span><span class="s-bc__name">{{ snippet.name }}</span>
      </p>
      <h1 class="con-title">{{ snippet.title }}</h1>

      <section id="preview" class="s-section con-sec">
        <h2 class="con-h"><span class="con-h__tick"></span>Preview</h2>
        <LivePreview :snippet="snippet" :view="view" :prop-values="propValues" />
        <Controls
          v-if="snippet.controls.length"
          class="con-controls"
          :controls="snippet.controls"
          :values="propValues"
          @update="$emit('update', $event)"
          @reset="$emit('reset')"
        />
      </section>

      <section v-if="view.install || view.notes.length" id="install" class="s-section con-sec">
        <h2 class="con-h"><span class="con-h__tick"></span>Install</h2>
        <InstallBlock :install="view.install" :notes="view.notes" />
      </section>

      <section id="source" class="s-section con-sec">
        <h2 class="con-h"><span class="con-h__tick"></span>{{ view.isHtml ? "Source" : "Component" }}</h2>
        <div class="con-toolbar">
          <span class="con-toolbar__label">variant</span>
          <VariantSelector compact />
        </div>
        <CodeBlock
          v-for="src in view.sources"
          :key="src.filename"
          :code="src.code"
          :lang="src.lang"
          :filename="src.filename"
          kind="source"
          line-numbers
          wrappable
        />
      </section>

      <section v-if="view.usage" id="usage" class="s-section con-sec">
        <h2 class="con-h"><span class="con-h__tick"></span>Usage</h2>
        <CodeBlock
          :code="view.usage.code"
          :lang="view.usage.lang"
          :filename="view.usage.filename"
          kind="usage"
          line-numbers
        />
      </section>

      <section id="api" class="s-section con-sec">
        <h2 class="con-h"><span class="con-h__tick"></span>API</h2>
        <ApiTableVue :rows="snippet.props" />
      </section>
    </div>

    <nav class="toc-prog" aria-label="On this page">
      <p class="toc-prog__title">On this page</p>
      <div class="toc-prog__body">
        <div class="toc-prog__track">
          <div class="toc-prog__fill" :style="{ transform: `scaleY(${progress})` }"></div>
        </div>
        <div class="toc-prog__links">
          <a
            v-for="s in sections"
            :key="s.id"
            :href="`#${s.id}`"
            :aria-current="active === s.id"
          >
            {{ s.label }}
          </a>
        </div>
      </div>
    </nav>
  </div>
</template>
