/* Detail page — API-table depiction dispatch (ADR-0015).
 *
 * The API table *depicts* a prop's default rather than printing it as flat
 * source text. `describeDefault` classifies a PropDoc into a render kind from
 * its default/type STRINGS (never the prop name) and precomputes the little bit
 * of data each depiction needs, so ApiTable.vue stays declarative.
 *
 * Render kinds — "depiction echoes control":
 *   colors  → swatches       (echoes the Swatch control)
 *   boolean → toggle glyph   (echoes the Toggle control)
 *   union   → option chips    (echoes Segmented) — CLASSIFIED but not yet
 *             rendered: with no union prop in the corpus its renderer is
 *             deferred, so a union currently falls through to the code token.
 *   code    → filled code token (everything else)
 */
import type { PropDoc } from "../snippets/types";

export type RenderKind = "colors" | "boolean" | "union" | "code";

export interface DefaultDepiction {
  kind: RenderKind;
  /** true when the prop has no default (must be passed) → dim `required` tag. */
  required: boolean;
  /** Colour literals, when kind === "colors". */
  colors: string[];
  /** The default's boolean value, when kind === "boolean". */
  bool: boolean;
  /** true when the default is an empty string (`''` / `""`). */
  isEmptyString: boolean;
  /** Source text for the code token (the default as written). */
  text: string;
}

const COLOR_RE =
  /^#[0-9a-fA-F]{3,8}$|^rgba?\([^)]*\)$|^hsla?\([^)]*\)$/i;

/**
 * A default is "colours" when every quoted string literal inside it parses as a
 * colour and there is at least one. Handles both a single `'#fff'` and an array
 * `['#ffaa40', '#9c40ff', …]` by pulling the quoted members out of the source.
 */
function extractColors(def: string): string[] | null {
  const strings = [...def.matchAll(/['"]([^'"]*)['"]/g)].map((m) => m[1].trim());
  if (strings.length === 0) return null;
  return strings.every((s) => COLOR_RE.test(s)) ? strings : null;
}

/**
 * Members of a string-literal union type (`"solid" | "ghost"`), or null. Only
 * unions whose every member is a quoted literal qualify for option chips; a
 * mixed union like `string | number` is not one.
 */
export function unionMembers(type: string): string[] | null {
  if (!type.includes("|")) return null;
  const parts = type.split("|").map((p) => p.trim());
  const members = parts.map((p) => p.match(/^['"]([^'"]*)['"]$/)?.[1]);
  return members.every((m) => m !== undefined) ? (members as string[]) : null;
}

export function describeDefault(prop: PropDoc): DefaultDepiction {
  const base = {
    required: false,
    colors: [] as string[],
    bool: false,
    isEmptyString: false,
    text: prop.default ?? "",
  };

  // No default → required. Orthogonal to kind (a required boolean shows the
  // `required` tag, not a toggle).
  if (prop.default == null) {
    return { ...base, kind: "code", required: true, text: "" };
  }

  if (prop.type === "boolean") {
    return { ...base, kind: "boolean", bool: /true/i.test(prop.default) };
  }

  const colors = extractColors(prop.default);
  if (colors) return { ...base, kind: "colors", colors };

  const isEmptyString = prop.default === "''" || prop.default === '""';
  if (unionMembers(prop.type)) return { ...base, kind: "union", isEmptyString };

  return { ...base, kind: "code", isEmptyString };
}
