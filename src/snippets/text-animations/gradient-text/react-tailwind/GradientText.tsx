import type { CSSProperties, ReactNode } from "react";

/**
 * GradientText — text painted with an animated linear gradient.
 *
 * The gradient is clipped to the glyphs (`bg-clip-text text-transparent`) and
 * its background-position is animated, so the colors appear to flow across the
 * letters. Pass any number of colors; CSS distributes the stops evenly.
 */
interface GradientTextProps {
  children?: ReactNode;
  /** Gradient colors, in order. Repeat the first color last for a seamless loop. */
  colors?: string[];
  /** One full loop, in seconds. */
  animationSpeed?: number;
  /** Gradient direction, in degrees (0–360). */
  degree?: number;
}

const KEYFRAMES = `
@keyframes gradient-text-move {
  0%   { background-position: 0% 0%; }
  25%  { background-position: 100% 0%; }
  50%  { background-position: 100% 100%; }
  75%  { background-position: 0% 100%; }
  100% { background-position: 0% 0%; }
}`;

export default function GradientText({
  children,
  colors = ["#ffaa40", "#9c40ff", "#ffaa40"],
  animationSpeed = 8,
  degree = 90,
}: GradientTextProps) {
  // A near-vertical gradient animates along Y, a near-horizontal one along X;
  // the oversized axis is what gives the background-position room to travel.
  const d = ((degree % 360) + 360) % 360;
  const isVertical = d % 180 < 45 || d % 180 > 135;

  const style: CSSProperties = {
    backgroundImage: `linear-gradient(${degree}deg, ${colors.join(", ")})`,
    backgroundSize: isVertical ? "100% 300%" : "300% 100%",
    // Explicit -webkit prefix: Safari still requires it and Tailwind v4 ships
    // no autoprefixer, so `bg-clip-text` alone wouldn't clip there.
    WebkitBackgroundClip: "text",
    animation: `gradient-text-move ${animationSpeed}s linear infinite`,
  };

  return (
    <>
      <style>{KEYFRAMES}</style>
      <span className="inline-block bg-clip-text text-transparent" style={style}>
        {children}
      </span>
    </>
  );
}
