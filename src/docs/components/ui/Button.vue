<script setup lang="ts">
import { computed } from "vue";

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: "primary",
  size: "default",
});

const borderStyle = computed(() => {
  return {
    primary: "border border-[var(--vp-input-border-color)]",
    // secondary: "border border-[var(--vp-c-secondary-1)]",
    // outline: "border border-[var(--vp-c-secondary-1)]",
  }[props.variant];
});

const backgroundStyle = computed(() => {
  return {
    primary: "bg-[var(--vp-c-default-soft)] hover:bg-[var(--vp-c-default-3)]",
    // secondary: "bg-[var(--vp-c-secondary-1)] text-[var(--vp-c-secondary-4)]",
    // outline: "bg-[var(--vp-c-secondary-1)] text-[var(--vp-c-secondary-4)]",
  }[props.variant];
});

const textStyle = computed(() => {
  return {
    primary: "text-[var(--vp-c-default-4)]",
    // secondary: "text-[var(--vp-c-secondary-4)]",
    // outline: "text-[var(--vp-c-secondary-4)]",
  }[props.variant];
});

const sizeStyle = computed(() => {
  return {
    default: "h-9 px-4 py-2 has-[>svg]:px-3",
    // sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
    // lg: "h-10 px-6 has-[>svg]:px-4",
    icon: "size-10",
  }[props.size];
});

const animationStyle = computed(() => {
  return {
    primary: "transition-all",
    // secondary:
    //   "transition-colors hover:bg-[var(--vp-c-secondary-2)] active:bg-[var(--vp-c-secondary-3)]",
  }[props.variant];
});
</script>

<template>
  <div
    role="button"
    tabindex="0"
    class="cursor-pointer rounded-lg inline-flex items-center justify-center gap-2 whitespace-nowrap"
    :class="[
      borderStyle,
      backgroundStyle,
      textStyle,
      sizeStyle,
      animationStyle,
    ]"
  >
    <slot />
  </div>
</template>
