<script setup lang="ts">
/* Detail page. The Install copy artifact + the
 * non-npm prerequisite notes. "Prerequisites, not magic" (PRODUCT.md): the npm
 * line is copyable; tooling/CSS notes stay as honest plain lines. Renders
 * nothing when a variant needs neither. */
import CodeBlock from "./CodeBlock.vue";
defineProps<{ install: string | null; notes: string[] }>();
</script>

<template>
  <div v-if="install || notes.length" class="sd-install">
    <CodeBlock
      v-if="install"
      :code="install"
      lang="bash"
      filename="terminal"
      kind="install"
    />
    <ul v-if="notes.length" class="sd-notes">
      <li v-for="(n, i) in notes" :key="i">{{ n }}</li>
    </ul>
  </div>
</template>
