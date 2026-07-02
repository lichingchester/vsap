import type { CSSProperties, ReactNode } from "react";
import "./AnimatedGradientText.css";

/**
 * AnimatedGradientText — text painted with an animated linear gradient.
 *
 * The gradient is clipped to the glyphs and its background-position is
 * animated, so the colors appear to flow across the letters. Pass any number
 * of colors; CSS distributes the stops evenly.
 *
 * Copy AnimatedGradientText.css alongside this file and keep the import above.
 */
interface AnimatedGradientTextProps {
  children?: ReactNode;
  /** Gradient colors, in order. Repeat the first color last for a seamless loop. */
  colors?: string[];
  /** One full loop, in seconds. */
  animationSpeed?: number;
  /** Gradient direction, in degrees (0–360). */
  degree?: number;
}

export default function AnimatedGradientText({
  children,
  colors = ["#ffaa40", "#9c40ff", "#ffaa40"],
  animationSpeed = 8,
  degree = 90,
}: AnimatedGradientTextProps) {
  // A near-vertical gradient animates along Y, a near-horizontal one along X;
  // the oversized axis is what gives the background-position room to travel.
  const d = ((degree % 360) + 360) % 360;
  const isVertical = d % 180 < 45 || d % 180 > 135;

  const style: CSSProperties = {
    backgroundImage: `linear-gradient(${degree}deg, ${colors.join(", ")})`,
    backgroundSize: isVertical ? "100% 300%" : "300% 100%",
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <span className="animated-gradient-text" style={style}>
      {children}
    </span>
  );
}
