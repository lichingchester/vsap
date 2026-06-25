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
  <div class="overflow-hidden rounded-xl border border-neutral-800">
    <!-- Variant tabs: switching a tab changes the code shown, not the preview above. -->
    <div
      class="flex items-center gap-1 border-b border-neutral-800 bg-neutral-900 px-2"
    >
      <button
        v-for="v in variants"
        :key="v.id"
        class="px-3 py-2 text-sm transition-colors"
        :class="
          v.id === activeId
            ? 'border-b-2 border-neutral-100 text-neutral-100'
            : 'text-neutral-400 hover:text-neutral-200'
        "
        @click="activeId = v.id"
      >
        {{ v.label }}
      </button>
      <button
        class="my-1 ml-auto rounded-md bg-neutral-800 px-3 py-1.5 text-xs text-neutral-100 hover:bg-neutral-700"
        @click="copy"
      >
        {{ copied ? "Copied!" : "Copy" }}
      </button>
    </div>

    <!-- Per-variant prerequisites — the honest replacement for "no setup". -->
    <div
      v-if="active?.prerequisites?.length"
      class="border-b border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm"
    >
      <p class="mb-1 font-medium text-neutral-300">Before you paste</p>
      <ul class="space-y-1 text-neutral-400">
        <li v-for="(p, i) in active.prerequisites" :key="i">
          <code
            v-if="p.npm"
            class="rounded bg-neutral-800 px-1.5 py-0.5 text-neutral-200"
            >npm i {{ p.npm }}</code
          ><span v-if="p.note">{{ p.npm ? " — " : "" }}{{ p.note }}</span>
        </li>
      </ul>
    </div>

    <pre
      class="overflow-x-auto bg-neutral-950 p-4 text-sm leading-relaxed"
    ><code>{{ active?.code }}</code></pre>
  </div>
</template>
