<script setup lang="ts">
/*
 * Detail page (Console layout, promoted from the S3 demo). The single island
 * that owns detail-page state: the persisted variant preference, and the live
 * prop values that drive BOTH the preview and the generated Usage (props→code).
 *
 * Layout: sticky mini-headers with an accent tick, a scroll-progress TOC rail,
 * and IDE code blocks (line numbers + wrap). Copy artifacts: Install · Source ·
 * Usage (conditional; the self-contained HTML variant collapses Source+Usage).
 * No-drift (ADR-0004/0005): the preview mounts the live reference component the
 * code blocks ?raw-show.
 */
import { ref, computed, onMounted, watch } from "vue";
import LivePreview from "./LivePreview.vue";
import Controls from "./Controls.vue";
import CodeBlock from "./CodeBlock.vue";
import InstallBlock from "./InstallBlock.vue";
import ApiTable from "./ApiTable.vue";
import VariantSelector from "./VariantSelector.vue";
import { buildView, sectionList } from "./view";
import { buildSnippetData, type VariantSource } from "./snippetData";
import { previews } from "./previews";
import { pref, initPref } from "./variantPref";
import { useScrollSpy, useScrollProgress } from "./scroll";
import type { SnippetMeta } from "../snippets/types";

// meta + raw sources are serialisable Astro island props; the live preview
// component is resolved here from the registry (it can't cross the JSON island
// boundary).
const props = defineProps<{
  meta: SnippetMeta;
  sources: Record<string, VariantSource>;
}>();

const data = computed(() =>
  buildSnippetData(props.meta, previews[props.meta.name], props.sources),
);

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
const propValues = ref<Record<string, unknown>>(clone(data.value.defaultProps));

// Remount key for one-shot previews: bumping it re-runs the animation. New
// stagger/duration only take effect on the next play, so control edits bump it
// too (update/reset); the stage's Replay button bumps it on demand.
const previewKey = ref(0);
function replay() {
  previewKey.value += 1;
}

watch(
  () => props.meta,
  () => (propValues.value = clone(data.value.defaultProps)),
);
function reset() {
  propValues.value = clone(data.value.defaultProps);
  if (data.value.replayable) replay();
}
function update(v: Record<string, unknown>) {
  propValues.value = v;
  if (data.value.replayable) replay();
}

const view = computed(() => buildView(data.value, pref, propValues.value));
const sections = computed(() => sectionList(view.value));
const active = useScrollSpy();
const progress = useScrollProgress();

onMounted(initPref);
</script>

<template>
  <div class="doc-grid sd-console">
    <div class="doc-main">
      <p class="con-bc">
        <span class="s-bc__group">{{ data.category }}/</span><span class="s-bc__name">{{ data.name }}</span>
      </p>
      <h1 class="con-title">{{ data.title }}</h1>

      <section id="preview" class="s-section con-sec">
        <h2 class="con-h"><span class="con-h__tick"></span>Preview</h2>
        <LivePreview
          :snippet="data"
          :view="view"
          :prop-values="propValues"
          :preview-key="previewKey"
          @replay="replay"
        />
        <Controls
          v-if="data.controls.length"
          class="con-controls"
          :controls="data.controls"
          :values="propValues"
          @update="update"
          @reset="reset"
        />
      </section>

      <section v-if="view.install || view.notes.length" id="prerequisites" class="s-section con-sec">
        <h2 class="con-h"><span class="con-h__tick"></span>Prerequisites</h2>
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
        <ApiTable :rows="data.props" />
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
