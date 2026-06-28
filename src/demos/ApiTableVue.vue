<script setup lang="ts">
/* THROWAWAY (detail-page /demos harness). The props API table, in Vue so it can
 * live inside the demo island. Mirrors the real ApiTable.astro styling. */
import type { PropDoc } from "../snippets/types";
defineProps<{ rows: PropDoc[] }>();
</script>

<template>
  <table class="api">
    <thead>
      <tr>
        <th>Prop</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="p in rows" :key="p.name">
        <td class="api__name">{{ p.name }}</td>
        <td class="api__type">{{ p.type }}</td>
        <td class="api__def">{{ p.default ?? "—" }}</td>
        <td>{{ p.description }}</td>
      </tr>
    </tbody>
  </table>
</template>
