<script setup lang="ts">
/*
 * THROWAWAY (detail-page /demos harness). The single island that owns the
 * detail-page state: the persisted variant preference, the selected snippet,
 * and the live prop values (which drive both the preview and the generated
 * Usage). Renders one of the three candidate layouts (A/B/C) so they can be
 * compared in context (ADR-0008's "judge on real surfaces"). A demo toolbar
 * (not part of the final design) lets you switch snippet + layout + reset.
 */
import { ref, computed, onMounted, watch } from "vue";
import { demoCatalog, getDemoSnippet } from "./catalog";
import { pref, initPref } from "./variantPref";
import { buildView } from "./view";
import VariantSelector from "./VariantSelector.vue";
import LayoutA from "./LayoutA.vue";
import LayoutB from "./LayoutB.vue";
import LayoutC from "./LayoutC.vue";

const props = defineProps<{
  layout: "a" | "b" | "c";
  snippet?: string;
}>();

const LAYOUTS = { a: LayoutA, b: LayoutB, c: LayoutC };
const LAYOUT_LABEL = { a: "A · Stacked", b: "B · Workbench", c: "C · Console" };

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
          v-for="l in (['a', 'b', 'c'] as const)"
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

    <!-- The detail page itself -->
    <p class="s-bc">
      <span class="s-bc__group">{{ current.category }} /</span>
      <span class="s-bc__name">{{ current.name }}</span>
    </p>
    <div class="demo-titlerow">
      <h1 class="s-title">{{ current.title }}</h1>
      <VariantSelector />
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
