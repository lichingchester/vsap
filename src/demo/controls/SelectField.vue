<script setup lang="ts">
// Fully-custom select — a button trigger + custom listbox popover (the open menu
// native <select> won't let us style). Owns keyboard: Up/Down/Home/End move the
// active option, Enter/Space commit, Esc closes (via usePopover).
import { computed, nextTick, ref, watch } from "vue";
import { ChevronDown, Check } from "lucide-vue-next";
import { usePopover } from "../usePopover";

const props = defineProps<{ label: string; options: { value: string; label: string }[] }>();
const value = defineModel<string>({ required: true });

const trigger = ref<HTMLElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const { open, show, close, toggle } = usePopover(trigger, panel);

const active = ref(0);
const selectedLabel = computed(
  () => props.options.find((o) => o.value === value.value)?.label ?? value.value,
);

watch(open, (o) => {
  if (!o) return;
  active.value = Math.max(0, props.options.findIndex((x) => x.value === value.value));
  nextTick(() => (panel.value?.querySelector("[data-active]") as HTMLElement)?.focus());
});

function commit(i: number) {
  value.value = props.options[i].value;
  close();
  trigger.value?.focus();
}
function onTriggerKey(e: KeyboardEvent) {
  if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    show();
  }
}
function onListKey(e: KeyboardEvent) {
  const n = props.options.length;
  if (e.key === "ArrowDown") active.value = (active.value + 1) % n;
  else if (e.key === "ArrowUp") active.value = (active.value - 1 + n) % n;
  else if (e.key === "Home") active.value = 0;
  else if (e.key === "End") active.value = n - 1;
  else if (e.key === "Enter" || e.key === " ") return commit(active.value);
  else return;
  e.preventDefault();
}
</script>

<template>
  <div class="ctl ctl-select">
    <div class="ctl-head">
      <span class="ctl-label">{{ label }}</span>
      <span class="ctl-value">{{ value }}</span>
    </div>
    <div class="ctl-select__wrap">
      <button
        ref="trigger"
        type="button"
        class="ctl-select__trigger"
        :class="{ 'is-open': open }"
        aria-haspopup="listbox"
        :aria-expanded="open"
        :aria-label="label"
        @click="toggle"
        @keydown="onTriggerKey"
      >
        <span>{{ selectedLabel }}</span>
        <ChevronDown class="ctl-select__chevron" :size="15" :stroke-width="2" />
      </button>
      <ul
        v-show="open"
        ref="panel"
        class="ctl-select__list"
        role="listbox"
        :aria-label="label"
        tabindex="-1"
        @keydown="onListKey"
      >
        <li
          v-for="(o, i) in options"
          :key="o.value"
          class="ctl-select__opt"
          :class="{ 'is-active': i === active }"
          role="option"
          :aria-selected="o.value === value"
          :data-active="i === active ? '' : undefined"
          tabindex="-1"
          @click="commit(i)"
          @mouseenter="active = i"
        >
          <span>{{ o.label }}</span>
          <Check v-if="o.value === value" class="ctl-select__tick" :size="14" :stroke-width="2.5" />
        </li>
      </ul>
    </div>
  </div>
</template>
