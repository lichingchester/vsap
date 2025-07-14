<script setup lang="ts">
import { computed, defineAsyncComponent, h } from "vue";
import type { SlotsType } from "vue";

// Create a fallback component that renders an <a> tag
interface ATagProps {
  href?: string;
  target?: string;
  [key: string]: unknown; // For other HTML attributes
}

// Create a fallback component that renders an <a> tag
const ATag = (props: ATagProps, { slots }: { slots: SlotsType }) => {
  return h("a", props, slots);
};

// Try to import RouterLink dynamically with a fallback
const RouterLink = defineAsyncComponent({
  loader: async () => {
    try {
      // @ts-ignore
      const router = await import("vue-router");
      return router.RouterLink;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return ATag;
    }
  },
  loadingComponent: ATag,
  errorComponent: ATag,
});

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
  attributes?: Record<string, unknown>;
}

const props = withDefaults(defineProps<LinkTagProps>(), {
  href: "",
  noLink: false,
  external: false,
  newTab: false,
});

// Get the component type based on props
const is = computed(() => {
  if (props.noLink) return "div";
  if (props.external) return "a";
  return RouterLink;
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

  // For RouterLink
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
