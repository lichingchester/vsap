<script setup lang="ts">
/*
 * THROWAWAY (detail-page /demos harness). The single island that owns the
 * detail-page state: the persisted variant preference, the selected snippet,
 * and the live prop values (which drive both the preview and the generated
 * Usage). Stacked layout won the first round; this renders one of three STACKED
 * variations (S1 Ledger / S2 Slab / S3 Console) so the section / TOC / heading /
 * code-block treatments can be compared in context. The variant selector is NOT
 * in the page head — it lives in the site header + at the code block, per each
 * layout. A demo toolbar (not part of the final design) switches snippet/layout.
 */
import { ref, computed, onMounted, watch } from "vue";
import { demoCatalog, getDemoSnippet } from "./catalog";
import { pref, initPref } from "./variantPref";
import { buildView } from "./view";
import StackedRuled from "./StackedRuled.vue";
import StackedSlab from "./StackedSlab.vue";
import StackedConsole from "./StackedConsole.vue";

const props = defineProps<{
  layout: "s1" | "s2" | "s3";
  snippet?: string;
}>();

const LAYOUTS = { s1: StackedRuled, s2: StackedSlab, s3: StackedConsole };
const LAYOUT_LABEL = { s1: "S1 · Ledger", s2: "S2 · Slab", s3: "S3 · Console" };

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

const current = ref(getDemoSnippet(props.snippet ?? demoCatalog[0].name));
const propValues = ref<Record<string, unknown>>(clone(current.value.defaultProps));

function selectSnippet(name: string) {
  current.value = getDemoSnippet(name);
}
watch(current, (s) => {
  propValues.value = clone(s.defaultProps);
});
function reset() {
  propValues.value = clone(current.value.defaultProps);
}
function update(v: Record<string, unknown>) {
  propValues.value = v;
}

const view = computed(() => buildView(current.value, pref, propValues.value));
const activeLayout = computed(() => LAYOUTS[props.layout]);

function hrefFor(layout: string) {
  return `/demos/detail/${layout}?s=${current.value.name}`;
}

onMounted(() => {
  initPref();
  const q = new URLSearchParams(location.search);
  const s = q.get("s");
  if (s) current.value = getDemoSnippet(s);
});
</script>

<template>
  <div class="demo-detail">
    <!-- Demo toolbar (scaffolding — not part of the final detail page) -->
    <div class="demo-bar">
      <span class="demo-bar__tag">demo · {{ LAYOUT_LABEL[layout] }}</span>
      <div class="demo-bar__switch">
        <a
          v-for="l in (['s1', 's2', 's3'] as const)"
          :key="l"
          class="demo-bar__layout"
          :aria-current="l === layout"
          :href="hrefFor(l)"
          >{{ l.toUpperCase() }}</a
        >
      </div>
      <div class="demo-bar__snips">
        <button
          v-for="s in demoCatalog"
          :key="s.name"
          type="button"
          class="demo-bar__snip"
          :aria-pressed="s.name === current.name"
          @click="selectSnippet(s.name)"
        >
          {{ s.name }}
        </button>
      </div>
      <button type="button" class="demo-bar__reset" @click="reset">Reset props</button>
    </div>

    <component
      :is="activeLayout"
      :snippet="current"
      :view="view"
      :prop-values="propValues"
      @update="update"
      @reset="reset"
    />
  </div>
</template>
