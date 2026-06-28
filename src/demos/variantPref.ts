/*
 * THROWAWAY (detail-page /demos harness). The persisted, global variant
 * preference: one {framework, styling} the visitor sets once and every detail
 * page honours. Source of truth is this reactive singleton, mirrored to
 * localStorage and the URL (?fw=&style=) so a shared link opens the right
 * framework (point 4: deep-linkable variant). On promotion this becomes a real
 * site-level store.
 */
import { reactive } from "vue";
import type { VariantPref, FrameworkAxis, StylingAxis } from "./usage";

const KEY = "tskr-demo-variant-pref";

export const pref = reactive<VariantPref>({
  framework: "vue",
  styling: "tailwind",
});

const EVT = "tskr-pref-change";

// initPref runs once per island instance. Because the header selector and the
// detail island are separate islands (separate module instances), they sync via
// a window CustomEvent so the preference is truly global across the page.
let inited = false;
export function initPref() {
  if (inited || typeof window === "undefined") return;
  inited = true;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved?.framework) pref.framework = saved.framework;
    if (saved?.styling) pref.styling = saved.styling;
    const q = new URLSearchParams(location.search);
    const fw = q.get("fw") as FrameworkAxis | null;
    const st = q.get("style") as StylingAxis | null;
    if (fw === "vue" || fw === "react" || fw === "html") pref.framework = fw;
    if (st === "tailwind" || st === "css") pref.styling = st;
  } catch {
    /* ignore */
  }
  window.addEventListener(EVT, (e) => {
    const d = (e as CustomEvent<VariantPref>).detail;
    if (d) Object.assign(pref, d);
  });
  window.addEventListener("storage", (e) => {
    if (e.key === KEY && e.newValue) {
      try {
        Object.assign(pref, JSON.parse(e.newValue));
      } catch {
        /* ignore */
      }
    }
  });
}

export function setPref(patch: Partial<VariantPref>) {
  Object.assign(pref, patch);
  try {
    localStorage.setItem(KEY, JSON.stringify(pref));
    const u = new URL(location.href);
    u.searchParams.set("fw", pref.framework);
    u.searchParams.set("style", pref.styling);
    history.replaceState(null, "", u);
    window.dispatchEvent(new CustomEvent(EVT, { detail: { ...pref } }));
  } catch {
    /* ignore */
  }
}
