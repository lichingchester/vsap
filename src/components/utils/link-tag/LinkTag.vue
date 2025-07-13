<script setup lang="ts">
import { computed } from "vue";

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
}

const props = withDefaults(defineProps<LinkTagProps>(), {
  href: "",
  noLink: false,
  external: false,
  newTab: false,
});

// Get the component type based on props
const is = computed<"a" | "div">(() => (props.noLink ? "div" : "a"));

// Determine target attribute
const target = computed<"_blank" | "">(() => (props.newTab ? "_blank" : ""));

// Build the link attributes
const link = computed(() => {
  if (props.noLink) {
    return {};
  }

  if (props.external) {
    return { href: props.href };
  }

  return {
    href: props.href,
    // href: props.href ? $__getRelativeRouteBase(localePath(props.href)) : "",
  };
});
</script>

<template>
  <component
    :is="is"
    v-bind="link"
    :target="target"
    :class="{ 'no-link': noLink }"
  >
    <slot />
  </component>
</template>
