<script setup lang="ts">
/* Detail page — the props API table (ADR-0015). Type and Default are DEPICTED,
 * not printed: Type in a ghost outline chip, Default via its render kind
 * (swatches / toggle glyph / required tag / code token). `describeDefault`
 * classifies each row; the template just switches on the kind. */
import { computed } from "vue";
import type { PropDoc } from "../snippets/types";
import { describeDefault } from "./apiRender";

const props = defineProps<{ rows: PropDoc[] }>();
const rows = computed(() => props.rows.map((p) => ({ p, d: describeDefault(p) })));
</script>

<template>
  <div class="api-wrap">
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
        <tr v-for="{ p, d } in rows" :key="p.name">
          <td class="api__name">{{ p.name }}</td>

          <td class="api__type">
            <code class="api-type">{{ p.type }}</code>
          </td>

          <td class="api__def">
            <!-- required: no default to show -->
            <span v-if="d.required" class="api-req">required</span>

            <!-- colours → swatches (single: swatch + hex; many: swatches, hex on hover) -->
            <span v-else-if="d.kind === 'colors'" class="api-sw">
              <span
                v-for="(c, i) in d.colors"
                :key="i"
                class="api-sw__chip"
                :style="{ '--sw': c }"
                :title="c"
              />
              <code v-if="d.colors.length === 1" class="api-sw__hex">{{ d.colors[0] }}</code>
            </span>

            <!-- boolean → toggle glyph in its default position -->
            <span v-else-if="d.kind === 'boolean'" class="api-bool" :class="{ 'is-on': d.bool }">
              <span class="api-bool__track"><span class="api-bool__knob" /></span>
              <code class="api-bool__val">{{ d.bool }}</code>
            </span>

            <!-- empty string → labelled token so the cell doesn't read as blank -->
            <span v-else-if="d.isEmptyString" class="api-tok">
              <code>""</code><span class="api-tok__note">empty</span>
            </span>

            <!-- code (also union, until its option-chips renderer ships) -->
            <code v-else class="api-tok">{{ d.text }}</code>
          </td>

          <td>{{ p.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
