import type { CSSProperties, ReactNode } from "react";
import "./GradientText.css";

/**
 * GradientText — text painted with a linear gradient, clipped to the glyphs.
 *
 * Pass any number of colors; CSS distributes the stops evenly. Copy
 * GradientText.css alongside this file and keep the import above. For a version
 * that flows, see the Animated Gradient Text snippet.
 */
interface GradientTextProps {
  children?: ReactNode;
  /** Gradient colors, in order. */
  colors?: string[];
  /** Gradient direction, in degrees (0–360). */
  degree?: number;
}

export default function GradientText({
  children,
  colors = ["#ffaa40", "#9c40ff", "#ffaa40"],
  degree = 90,
}: GradientTextProps) {
  const style: CSSProperties = {
    backgroundImage: `linear-gradient(${degree}deg, ${colors.join(", ")})`,
  };

  return (
    <span className="gradient-text" style={style}>
      {children}
    </span>
  );
}
