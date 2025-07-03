<script lang="ts" setup>
import { computed, PropType } from "vue";

const props = defineProps({
  text: {
    type: String as PropType<string>,
    required: true,
  },
});
</script>

<template>
  <div class="split-text">
    <span v-for="(char, index) in text.split('')" :key="index" class="char">
      {{ char }}
    </span>
  </div>
</template>
