import { computed, ref, type Ref } from "vue";

/**
 * Drag + keyboard math for the fully-custom slider (no native <input type=range>).
 * Owns pointer capture so a drag started on the thumb keeps tracking outside the
 * track, plus the keyboard model a native range gave for free (arrows, Home/End,
 * PageUp/Down).
 *
 * `value` is a ref the caller two-way binds; the composable clamps + snaps to step.
 */
export function useSlider(
  value: Ref<number>,
  opts: { min: number; max: number; step: number },
) {
  const { min, max, step } = opts;
  const track = ref<HTMLElement | null>(null);
  const dragging = ref(false);

  const percent = computed(() =>
    max === min ? 0 : ((value.value - min) / (max - min)) * 100,
  );

  function snap(v: number) {
    const snapped = Math.round((v - min) / step) * step + min;
    const clamped = Math.min(max, Math.max(min, snapped));
    // Avoid 0.30000000000000004 from float steps.
    return Number(clamped.toFixed(6));
  }

  function setFromClientX(clientX: number) {
    const el = track.value;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    const ratio = (clientX - rect.left) / rect.width;
    value.value = snap(min + ratio * (max - min));
  }

  function onPointerDown(e: PointerEvent) {
    dragging.value = true;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  }
  function onPointerMove(e: PointerEvent) {
    if (!dragging.value) return;
    setFromClientX(e.clientX);
  }
  function onPointerUp(e: PointerEvent) {
    dragging.value = false;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  }

  function onKeyDown(e: KeyboardEvent) {
    const big = Math.max(step, (max - min) / 10);
    let next = value.value;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        next = value.value - step;
        break;
      case "ArrowRight":
      case "ArrowUp":
        next = value.value + step;
        break;
      case "PageDown":
        next = value.value - big;
        break;
      case "PageUp":
        next = value.value + big;
        break;
      case "Home":
        next = min;
        break;
      case "End":
        next = max;
        break;
      default:
        return;
    }
    e.preventDefault();
    value.value = snap(next);
  }

  return {
    track,
    percent,
    dragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onKeyDown,
  };
}
