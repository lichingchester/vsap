<script setup lang="ts">
/*
 * THROWAWAY (detail-page /demos harness). The lit-cutout preview well
 * (DESIGN.md: inset darker than canvas, hairline, dot-grid). Always renders the
 * live *reference* variant (ADR-0005), with an honest label saying so, plus a
 * quiet fallback note when the visitor's preferred variant has no code here.
 * Reduced motion is handled in demos-detail.css (point 4).
 */
defineProps<{
  /** Label of the reference being previewed, e.g. "Vue + Tailwind". */
  referenceLabel: string;
  /** Set when the selected variant fell back to the reference. */
  fallbackNote?: string | null;
}>();
</script>

<template>
  <div class="demo-stage-wrap">
    <div class="demo-stage">
      <slot />
    </div>
    <p class="demo-stage__meta">
      <span class="demo-stage__live">● live</span>
      previewing <b>{{ referenceLabel }}</b> (reference)
      <span v-if="fallbackNote" class="demo-stage__fallback">— {{ fallbackNote }}</span>
    </p>
  </div>
</template>
