<script setup lang="ts">
/*
 * Detail page. The lit-cutout preview well
 * (DESIGN.md: inset darker than canvas, hairline, dot-grid). Always renders the
 * live *reference* variant (ADR-0005), with an honest label saying so, plus a
 * quiet fallback note when the visitor's preferred variant has no code here.
 * Reduced motion is handled in demos-detail.css (point 4).
 *
 * One-shot snippets (`replayable`) show a corner Replay button that asks the
 * owner to remount the live component so the animation runs again.
 */
import { RotateCcw } from "lucide-vue-next";

defineProps<{
  /** Label of the reference being previewed, e.g. "Vue + Tailwind". */
  referenceLabel: string;
  /** Set when the selected variant fell back to the reference. */
  fallbackNote?: string | null;
  /** Show the Replay button (one-shot previews). */
  replayable?: boolean;
}>();
defineEmits<{ (e: "replay"): void }>();
</script>

<template>
  <div class="sd-stage-wrap">
    <div class="sd-stage">
      <button
        v-if="replayable"
        type="button"
        class="sd-stage__replay"
        title="Replay"
        aria-label="Replay animation"
        @click="$emit('replay')"
      >
        <RotateCcw :size="16" />
      </button>
      <slot />
    </div>
    <p class="sd-stage__meta">
      <span class="sd-stage__live">● live</span>
      previewing <b>{{ referenceLabel }}</b> (reference)
      <span v-if="fallbackNote" class="sd-stage__fallback">— {{ fallbackNote }}</span>
    </p>
  </div>
</template>
