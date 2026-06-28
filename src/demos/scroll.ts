/*
 * THROWAWAY (detail-page /demos harness). Scroll helpers for the right-sidebar
 * (TOC) explorations: scroll-spy (which section is active) and a 0–1 page
 * progress value for the progress-rail TOC. Re-scans on DOM changes so a
 * conditional section (Install/Usage) appearing or vanishing stays tracked.
 */
import { ref, onMounted, onUpdated, onBeforeUnmount } from "vue";

export function useScrollSpy() {
  const active = ref("");
  let obs: IntersectionObserver | null = null;

  function scan() {
    obs?.disconnect();
    obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) active.value = e.target.id;
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    document.querySelectorAll(".s-section").forEach((s) => obs!.observe(s));
  }

  onMounted(() => requestAnimationFrame(scan));
  onUpdated(() => requestAnimationFrame(scan));
  onBeforeUnmount(() => obs?.disconnect());
  return active;
}

export function useScrollProgress() {
  const progress = ref(0);
  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }
  onMounted(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  });
  onBeforeUnmount(() => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  });
  return progress;
}
