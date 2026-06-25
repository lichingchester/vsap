<script setup lang="ts">
import { computed } from "vue";
// Nuxt auto-imports this from #components at build time.
import { NuxtLink } from "#components";

/**
 * LinkTag (Nuxt) — a universal link built on <NuxtLink>.
 *
 * NuxtLink already resolves internal vs external automatically, so this
 * variant leans on it for navigation and only drops to <a>/<div> for the
 * explicit external/no-link cases.
 */

interface LinkTagProps {
  /** URL or path to navigate to. */
  href?: string;
  /** Render a <div> instead of a link. */
  noLink?: boolean;
  /** Force a plain external <a> instead of NuxtLink. */
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

const tag = computed(() => {
  if (props.noLink) return "div";
  if (props.external) return "a";
  return NuxtLink;
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
