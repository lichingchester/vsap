<script setup lang="ts">
import { computed, defineAsyncComponent, h } from "vue";

/**
 * LinkTag — a universal link.
 *
 * Renders the most appropriate element for the context:
 *  - <RouterLink> for internal navigation (falls back to a plain <a> when
 *    vue-router isn't installed, so the snippet works in any Vue project)
 *  - a plain <a> for external URLs
 *  - a <div> when you want the slot content without any navigation
 */

interface LinkTagProps {
  /** URL or path to navigate to. */
  href?: string;
  /** Render a <div> instead of a link. */
  noLink?: boolean;
  /** Treat href as an external URL — always a plain <a>. */
  external?: boolean;
  /** Open in a new tab (sets target="_blank"). */
  newTab?: boolean;
  /** Extra attributes forwarded to the rendered element. */
  attributes?: Record<string, unknown>;
}

const props = withDefaults(defineProps<LinkTagProps>(), {
  href: "",
  noLink: false,
  external: false,
  newTab: false,
});

// Plain <a> fallback, used when vue-router can't be resolved.
const ATag = (p: Record<string, unknown>, { slots }: { slots: unknown }) =>
  h("a", p, slots as never);

// Resolve RouterLink lazily so the component degrades gracefully without vue-router.
const RouterLink = defineAsyncComponent({
  loader: async () => {
    try {
      const mod = await import("vue-router");
      return mod.RouterLink;
    } catch {
      return ATag;
    }
  },
  loadingComponent: ATag,
  errorComponent: ATag,
});

const tag = computed(() => {
  if (props.noLink) return "div";
  if (props.external) return "a";
  return RouterLink;
});

const target = computed(() => (props.newTab ? "_blank" : undefined));

const bindings = computed(() => {
  if (props.noLink) return { ...props.attributes };
  if (props.external) {
    return { href: props.href, target: target.value, ...props.attributes };
  }
  return { to: props.href, target: target.value, ...props.attributes };
});
</script>

<template>
  <component :is="tag" v-bind="bindings">
    <slot />
  </component>
</template>
