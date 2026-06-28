import { onBeforeUnmount, ref, type Ref } from "vue";

/**
 * Open/close behaviour for the kit's popover controls (ColorPicker, Select).
 * Owns the dismissal semantics native popovers gave for free: outside-click and
 * Escape. Document listeners are bound only while open.
 */
export function usePopover(
  trigger: Ref<HTMLElement | null>,
  panel: Ref<HTMLElement | null>,
) {
  const open = ref(false);

  function onDocPointer(e: PointerEvent) {
    const t = e.target as Node;
    if (trigger.value?.contains(t) || panel.value?.contains(t)) return;
    close();
  }
  function onDocKey(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
      trigger.value?.focus();
    }
  }

  function bind() {
    document.addEventListener("pointerdown", onDocPointer, true);
    document.addEventListener("keydown", onDocKey, true);
  }
  function unbind() {
    document.removeEventListener("pointerdown", onDocPointer, true);
    document.removeEventListener("keydown", onDocKey, true);
  }

  function show() {
    if (open.value) return;
    open.value = true;
    bind();
  }
  function close() {
    if (!open.value) return;
    open.value = false;
    unbind();
  }
  function toggle() {
    open.value ? close() : show();
  }

  onBeforeUnmount(unbind);

  return { open, show, close, toggle };
}
