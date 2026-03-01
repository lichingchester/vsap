<script setup lang="ts">
// Docs UI
import PreviewBlock from "@/src/docs/components/ui/PreviewBlock.vue";

// Components
import LinkTag from "@/src/components/utils/link-tag/LinkTag.vue";

defineProps<{
  caseName: string;
}>();
</script>

<template>
  <template v-if="caseName === 'ExternalNewTab'">
    <PreviewBlock class="relative min-h-20 flex items-center justify-center">
      <LinkTag
        href="https://github.com/lichingchester/vsap"
        external
        new-tab
        class="text-lg underline text-[var(--vp-c-brand-1)] hover:text-[var(--vp-c-brand-2)] transition-colors"
      >
        Open VSAP GitHub (new tab)
      </LinkTag>
    </PreviewBlock>
  </template>

  <template v-if="caseName === 'NoLink'">
    <PreviewBlock class="relative min-h-20 flex items-center justify-center">
      <LinkTag no-link class="text-lg text-[var(--vp-c-text-1)]">
        I render as a &lt;div&gt;, not a link
      </LinkTag>
    </PreviewBlock>
  </template>
</template>
