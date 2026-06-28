/**
 * Minimal HSV ⇄ hex helpers for the custom color picker. No deps — the picker
 * keeps HSV as its internal model (so the saturation/value canvas and hue strip
 * stay stable) and only converts to/from hex at the edges.
 */
export interface Hsv {
  h: number; // 0–360
  s: number; // 0–100
  v: number; // 0–100
}

export function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

const hex2 = (n: number) =>
  clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");

export function hsvToHex({ h, s, v }: Hsv): string {
  const sn = s / 100;
  const vn = v / 100;
  const c = vn * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vn - c;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return `#${hex2((r + m) * 255)}${hex2((g + m) * 255)}${hex2((b + m) * 255)}`.toUpperCase();
}

export function hexToHsv(hex: string): Hsv | null {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let hue = 0;
  if (d !== 0) {
    if (max === r) hue = ((g - b) / d) % 6;
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h: Math.round(hue), s: Math.round(s * 100), v: Math.round(max * 100) };
}

/** The pure hue (full S/V) for a given degree — used to paint the SV canvas. */
export function hueHex(h: number): string {
  return hsvToHex({ h, s: 100, v: 100 });
}
