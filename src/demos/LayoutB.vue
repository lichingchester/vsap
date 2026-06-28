<script setup lang="ts">
/*
 * THROWAWAY (detail-page /demos harness) — Layout B "Workbench toggle".
 * One framed stage at the top toggles Preview / Source / Usage; the controls
 * sit in a right rail beside it, so tweaking a prop updates the live preview AND
 * the Usage code in the same frame. Install + API sit below. Makes props->code
 * the most tangible (shadcn-style).
 */
import { ref, computed, watch } from "vue";
import LivePreview from "./LivePreview.vue";
import Controls from "./Controls.vue";
import CodeBlock from "./CodeBlock.vue";
import InstallBlock from "./InstallBlock.vue";
import ApiTableVue from "./ApiTableVue.vue";
import VariantSelector from "./VariantSelector.vue";
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

type Tab = "preview" | "source" | "usage";
const tab = ref<Tab>("preview");
const tabs = computed<{ id: Tab; label: string }[]>(() => {
  const t: { id: Tab; label: string }[] = [
    { id: "preview", label: "Preview" },
    { id: "source", label: props.view.isHtml ? "Source" : "Component" },
  ];
  if (props.view.usage) t.push({ id: "usage", label: "Usage" });
  return t;
});
// If the active tab vanishes (variant switched to HTML on Usage), fall back.
watch(tabs, (ts) => {
  if (!ts.some((x) => x.id === tab.value)) tab.value = "preview";
});
</script>

<template>
  <div class="lay-b">
    <section id="preview" class="s-section">
      <div class="lay-b__stagebar">
        <div class="lay-b__tabs" role="tablist">
          <button
            v-for="t in tabs"
            :key="t.id"
            type="button"
            role="tab"
            class="lay-b__tab"
            :aria-selected="tab === t.id"
            @click="tab = t.id"
          >
            {{ t.label }}
          </button>
        </div>
        <VariantSelector compact />
      </div>

      <div class="lay-b__work">
        <div class="lay-b__main">
          <LivePreview
            v-show="tab === 'preview'"
            :snippet="snippet"
            :view="view"
            :prop-values="propValues"
          />
          <template v-if="tab === 'source'">
            <CodeBlock
              v-for="src in view.sources"
              :key="src.filename"
              :code="src.code"
              :lang="src.lang"
              :filename="src.filename"
              kind="source"
            />
          </template>
          <CodeBlock
            v-else-if="tab === 'usage' && view.usage"
            :code="view.usage.code"
            :lang="view.usage.lang"
            :filename="view.usage.filename"
            kind="usage"
          />
        </div>

        <aside v-if="snippet.controls.length" class="lay-b__rail">
          <Controls
            :controls="snippet.controls"
            :values="propValues"
            @update="$emit('update', $event)"
            @reset="$emit('reset')"
          />
        </aside>
      </div>
    </section>

    <section
      v-if="view.install || view.notes.length"
      id="install"
      class="s-section"
    >
      <h2 class="s-h2">Install</h2>
      <InstallBlock :install="view.install" :notes="view.notes" />
    </section>

    <section id="api" class="s-section">
      <h2 class="s-h2">API</h2>
      <ApiTableVue :rows="snippet.props" />
    </section>
  </div>
</template>
