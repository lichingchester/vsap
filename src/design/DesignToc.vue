<script setup lang="ts">
/*
 * The /design page's right-hand "On this page" rail. A thin island whose only
 * job is scroll-spy: it reuses `useScrollSpy` from the detail page (scroll.ts),
 * observing the static `.s-section`s Astro renders — the IntersectionObserver
 * crosses the island boundary happily. Styling rides the shared `.docs-toc`.
 */
import { useScrollSpy } from "../detail/scroll";

defineProps<{ sections: { id: string; label: string }[] }>();
const active = useScrollSpy();
</script>

<template>
  <nav class="docs-toc" aria-label="On this page">
    <p class="docs-toc__title">On this page</p>
    <a
      v-for="s in sections"
      :key="s.id"
      :href="`#${s.id}`"
      :aria-current="active === s.id ? 'true' : 'false'"
    >
      {{ s.label }}
    </a>
  </nav>
</template>
