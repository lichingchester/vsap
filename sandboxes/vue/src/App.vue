<script setup lang="ts">
import { computed, ref, shallowRef, watch, type Component } from "vue";
import { entries, groupedEntries } from "./discover";

const groups = groupedEntries();
const key = ref<string | null>(
  new URLSearchParams(location.search).get("variant"),
);
const replay = ref(0);

const active = computed(() => entries.find((e) => e.key === key.value) ?? null);

// The resolved SFC for the active variant, loaded on demand.
const Comp = shallowRef<Component | null>(null);
let token = 0;
watch(
  active,
  async (a) => {
    const mine = ++token; // guard against out-of-order loads
    Comp.value = null;
    if (!a) return;
    const mod = await a.load();
    if (mine === token) Comp.value = mod.default as Component;
  },
  { immediate: true },
);

function select(k: string) {
  key.value = k;
  const url = new URL(location.href);
  url.searchParams.set("variant", k);
  history.replaceState(null, "", url);
}
</script>

<template>
  <div class="sb">
    <aside class="sb-side">
      <div class="sb-brand">vue <span>sandbox</span></div>
      <div v-for="g in groups" :key="g.title" class="sb-group">
        <div class="sb-group-title">{{ g.title }}</div>
        <button
          v-for="e in g.items"
          :key="e.key"
          :data-variant="e.key"
          class="sb-item"
          :class="{ 'is-active': e.key === key }"
          @click="select(e.key)"
        >
          {{ e.variant.label }}
        </button>
      </div>
      <div v-if="entries.length === 0" class="sb-group-title">
        no vue variants found
      </div>
    </aside>

    <main class="sb-main">
      <template v-if="active">
        <header class="sb-head">
          <div class="sb-head-title">
            <span class="sb-title">{{ active.snippet.title }}</span>
            <span class="sb-variant">{{ active.variant.label }}</span>
            <code class="sb-entry">{{ active.variant.entry }}</code>
          </div>
          <button
            v-if="active.snippet.replayable"
            class="sb-replay"
            @click="replay++"
          >
            ↻ Replay
          </button>
        </header>

        <section class="sb-stage" data-mount>
          <!-- key bump remounts one-shot effects on Replay / variant change -->
          <div
            :key="active.key + ':' + replay"
            :class="active.snippet.previewClass"
          >
            <component
              :is="Comp"
              v-if="Comp"
              v-bind="active.snippet.previewProps || {}"
            >
              {{ active.snippet.usage?.children }}
            </component>
            <div v-else class="sb-loading">loading…</div>
          </div>
        </section>

        <footer
          v-if="(active.variant.prerequisites || []).length"
          class="sb-prereq"
        >
          <span class="sb-prereq-label">Prerequisites</span>
          <ul>
            <li v-for="(p, i) in active.variant.prerequisites" :key="i">
              <code v-if="p.npm"
                >npm i {{ p.npm }}{{ p.version ? "@" + p.version : "" }}</code
              >
              <code v-if="p.cdn">{{ p.cdn }}</code>
              <span v-if="p.note" class="sb-prereq-note">{{ p.note }}</span>
            </li>
          </ul>
        </footer>
      </template>
      <div v-else class="sb-empty">Select a variant&nbsp;→</div>
    </main>
  </div>
</template>
