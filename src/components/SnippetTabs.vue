<script setup lang="ts">
import { computed, ref } from "vue";

interface Prerequisite {
  npm?: string;
  note?: string;
}

interface VariantView {
  id: string;
  label: string;
  code: string;
  native?: boolean;
  reference?: boolean;
  prerequisites?: Prerequisite[];
}

const props = defineProps<{ variants: VariantView[] }>();

const activeId = ref(props.variants[0]?.id ?? "");
const active = computed(
  () => props.variants.find((v) => v.id === activeId.value) ?? props.variants[0],
);

const copied = ref(false);
async function copy() {
  if (!active.value) return;
  await navigator.clipboard.writeText(active.value.code);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}
</script>

<template>
  <div class="overflow-hidden rounded-[8px] border border-line">
    <!-- Variant tabs: switching a tab changes the code shown, not the preview above. -->
    <div class="flex items-center gap-1 border-b border-line bg-surface px-2">
      <button
        v-for="v in variants"
        :key="v.id"
        class="px-3 py-2 text-sm transition-colors"
        :class="
          v.id === activeId
            ? 'border-b-2 border-accent text-fg'
            : 'text-muted hover:text-fg'
        "
        @click="activeId = v.id"
      >
        {{ v.label }}
      </button>
      <button
        class="my-1 ml-auto rounded-[4px] bg-surface2 px-3 py-1.5 font-mono text-xs text-fg hover:bg-line"
        @click="copy"
      >
        {{ copied ? "Copied!" : "Copy" }}
      </button>
    </div>

    <!-- Per-variant prerequisites — the honest replacement for "no setup". -->
    <div
      v-if="active?.prerequisites?.length"
      class="border-b border-line bg-surface px-4 py-3 text-sm"
    >
      <p class="mb-1 font-medium text-fg">Before you paste</p>
      <ul class="space-y-1 text-muted">
        <li v-for="(p, i) in active.prerequisites" :key="i">
          <code
            v-if="p.npm"
            class="rounded-[4px] bg-surface2 px-1.5 py-0.5 font-mono text-fg"
            >npm i {{ p.npm }}</code
          ><span v-if="p.note">{{ p.npm ? " — " : "" }}{{ p.note }}</span>
        </li>
      </ul>
    </div>

    <pre
      class="overflow-x-auto bg-inset p-4 font-mono text-sm leading-relaxed text-fg"
    ><code>{{ active?.code }}</code></pre>
  </div>
</template>
