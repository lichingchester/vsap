<script setup lang="ts">
/*
 * THROWAWAY (detail-page /demos harness). The two-axis variant control —
 * Framework (Vue/React/HTML) + Styling (Tailwind/CSS) — bound to the persisted
 * global preference. Rendered compact in the header and full-size above the
 * code region; both write the one source of truth. HTML collapses the styling
 * axis (it has no Tailwind/CSS split).
 */
import { onMounted } from "vue";
import { pref, setPref, initPref } from "./variantPref";
import type { FrameworkAxis, StylingAxis } from "./usage";

defineProps<{ compact?: boolean }>();
onMounted(initPref);

const frameworks: { id: FrameworkAxis; label: string }[] = [
  { id: "vue", label: "Vue" },
  { id: "react", label: "React" },
  { id: "html", label: "HTML" },
];
const stylings: { id: StylingAxis; label: string }[] = [
  { id: "tailwind", label: "Tailwind" },
  { id: "css", label: "CSS" },
];
</script>

<template>
  <div class="vsel" :class="{ 'vsel--compact': compact }">
    <div class="vsel__axis">
      <span v-if="!compact" class="vsel__label">Framework</span>
      <div class="vseg" role="group" aria-label="Framework">
        <button
          v-for="f in frameworks"
          :key="f.id"
          type="button"
          class="vseg__btn"
          :aria-pressed="pref.framework === f.id"
          @click="setPref({ framework: f.id })"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <div class="vsel__axis" :data-disabled="pref.framework === 'html'">
      <span v-if="!compact" class="vsel__label">Styling</span>
      <div class="vseg" role="group" aria-label="Styling">
        <button
          v-for="s in stylings"
          :key="s.id"
          type="button"
          class="vseg__btn"
          :disabled="pref.framework === 'html'"
          :aria-pressed="pref.framework !== 'html' && pref.styling === s.id"
          @click="setPref({ styling: s.id })"
        >
          {{ s.label }}
        </button>
      </div>
    </div>
  </div>
</template>
