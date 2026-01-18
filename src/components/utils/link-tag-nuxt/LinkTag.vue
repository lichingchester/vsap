<script setup lang="ts">
import { computed } from "vue";
import { NuxtLink } from "#components";

interface LinkTagProps {
  /**
   * URL or path to navigate to
   */
  href?: string;

  /**
   * When true, renders as <div> instead of <a>
   */
  noLink?: boolean;

  /**
   * When true, uses href directly instead of processing via router
   */
  external?: boolean;

  /**
   * When true, opens link in new tab with target="_blank"
   */
  newTab?: boolean;

  /**
   * Additional attributes to pass to the element
   */
  attributes?: Record<string, any>;
}

const props = withDefaults(defineProps<LinkTagProps>(), {
  href: "",
  noLink: false,
  external: false,
  newTab: false,
});

// Get the component type based on props
const is = computed<"a" | "div" | typeof NuxtLink>(() => {
  if (props.noLink) return "div";
  if (props.external) return "a";
  return NuxtLink;
});

// Determine target attribute
const target = computed<"_blank" | "">(() => (props.newTab ? "_blank" : ""));

// Build the link attributes
const link = computed(() => {
  // No link means no attributes for <div>
  if (props.noLink) {
    return { ...props.attributes };
  }

  // For external links
  if (props.external) {
    return { href: props.href, target: target.value, ...props.attributes };
  }

  // For NuxtLink
  return {
    to: props.href,
    target: target.value || undefined,
    ...props.attributes,
  };
});
</script>

<template>
  <component :is="is" v-bind="link">
    <slot />
  </component>
</template>
