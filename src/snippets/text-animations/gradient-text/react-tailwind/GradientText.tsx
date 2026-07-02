import type { CSSProperties, ReactNode } from "react";

/**
 * GradientText — text painted with a linear gradient, clipped to the glyphs.
 *
 * `bg-clip-text text-transparent` clips the gradient to the letters. Pass any
 * number of colors; CSS distributes the stops evenly. For a version that flows,
 * see the Animated Gradient Text snippet.
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
    // Explicit -webkit prefix: Safari still requires it and Tailwind v4 ships
    // no autoprefixer, so `bg-clip-text` alone wouldn't clip there.
    WebkitBackgroundClip: "text",
  };

  return (
    <span className="inline-block bg-clip-text text-transparent" style={style}>
      {children}
    </span>
  );
}
