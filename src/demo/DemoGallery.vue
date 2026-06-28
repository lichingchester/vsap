<script setup lang="ts">
// The /demo island. Two axes laid out as two stacked sections, three-up each
// (Q6): Density (chrome weight) and Personality (mood). Each panel renders the
// same 7 controls so skins compare directly.
import ControlPanel from "./ControlPanel.vue";
import TerminalLab from "./TerminalLab.vue";

const density = [
  { id: "A1", name: "Bare", skin: "bare" },
  { id: "A2", name: "Carded", skin: "carded" },
  { id: "A3", name: "Inset", skin: "inset" },
];
const personality = [
  { id: "B1", name: "Terminal", skin: "terminal" },
  { id: "B2", name: "Refined", skin: "refined" },
  { id: "B3", name: "Brutalist", skin: "brutalist" },
];
</script>

<template>
  <div class="demo">
    <TerminalLab />

    <section class="demo-axis demo-axis--divider">
      <header class="demo-axis__head">
        <h2 class="demo-axis__title">Reference · all six skins</h2>
        <p class="demo-axis__sub">The original exploration, kept for comparison.</p>
      </header>
    </section>

    <section class="demo-axis">
      <header class="demo-axis__head">
        <h2 class="demo-axis__title">A · Density</h2>
        <p class="demo-axis__sub">Same controls, three weights of chrome.</p>
      </header>
      <div class="demo-grid">
        <ControlPanel v-for="p in density" :key="p.id" v-bind="p" />
      </div>
    </section>

    <section class="demo-axis">
      <header class="demo-axis__head">
        <h2 class="demo-axis__title">B · Personality</h2>
        <p class="demo-axis__sub">Three moods drawn from the tskr/ui system.</p>
      </header>
      <div class="demo-grid">
        <ControlPanel v-for="p in personality" :key="p.id" v-bind="p" />
      </div>
    </section>
  </div>
</template>
