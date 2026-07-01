<script setup lang="ts">
/* Detail page. The body of the Prerequisites section: the Install command (a
 * copyable dependency-setup line — `npm i` for npm frameworks, a CDN <script>
 * for the HTML variant) plus the non-dependency tooling/CSS notes. "Prerequisites,
 * not magic" (PRODUCT.md): the command is copyable; tooling/CSS notes stay as
 * honest plain lines. Renders nothing when a variant needs neither. */
import CodeBlock from "./CodeBlock.vue";
import type { InstallArtifact, NoteLine } from "./usage";
defineProps<{ install: InstallArtifact | null; notes: NoteLine[] }>();
</script>

<template>
  <div v-if="install || notes.length" class="sd-install">
    <CodeBlock
      v-if="install"
      :code="install.code"
      :lang="install.lang"
      :filename="install.filename"
      kind="install"
    />
    <ul v-if="notes.length" class="sd-notes">
      <li v-for="(n, i) in notes" :key="i">
        {{ n.text }}
        <a
          v-if="n.href"
          :href="n.href"
          class="sd-note-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Setup guide
          <svg
            class="sd-note-link__icon"
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
          </svg>
        </a>
      </li>
    </ul>
  </div>
</template>
