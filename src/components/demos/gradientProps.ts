/*
 * Props schema for the Gradient Text snippet — drives both the API reference
 * table and the interactive controls in the detail demo (ADR-0008). In the real
 * site this would live in the snippet's meta.ts; here it is demo scaffolding.
 */
export interface PropSpec {
  name: string;
  type: string;
  def: string;
  desc: string;
  /** Which live control (if any) edits this prop in the demo. */
  control?: "colors" | "angle" | "speed";
}

export const gradientProps: PropSpec[] = [
  {
    name: "colors",
    type: "string[]",
    def: "['#5eead4', '#38bdf8', '#818cf8']",
    desc: "Gradient colour stops, applied left to right. Any number of CSS colours.",
    control: "colors",
  },
  {
    name: "direction",
    type: "number",
    def: "100",
    desc: "Gradient angle in degrees, 0–360.",
    control: "angle",
  },
  {
    name: "speed",
    type: "number",
    def: "5",
    desc: "Seconds per animation loop, 1–12. Higher is slower.",
    control: "speed",
  },
  {
    name: "text",
    type: "string",
    def: "'Your text'",
    desc: "The text to render with the gradient.",
  },
];
