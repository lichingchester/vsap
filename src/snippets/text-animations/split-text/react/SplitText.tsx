import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// Aliased so it doesn't clash with this component's own name.
import { SplitText as GSAPSplitText } from "gsap/SplitText";

/** Any GSAP tween vars — e.g. { opacity: 0, y: "100%" }. */
type TweenVars = Record<string, number | string>;

interface SplitTextProps {
  children: ReactNode;
  /** What to split the text into before staggering. */
  splitBy?: "chars" | "words" | "lines";
  /** Clip each unit so it rises from behind a hard edge. */
  mask?: boolean;
  /** Delay between each unit's animation, in seconds. */
  stagger?: number;
  /** Duration of each unit's animation, in seconds. */
  duration?: number;
  /** GSAP easing function for the reveal. */
  ease?: string;
  /** Starting GSAP state for each unit. */
  from?: TweenVars;
  /** Ending GSAP state for each unit. */
  to?: TweenVars;
  className?: string;
}

export default function SplitText({
  children,
  splitBy = "chars",
  mask = true,
  stagger = 0.05,
  duration = 0.8,
  ease = "power4.out",
  from = { opacity: 0, y: "100%" },
  to = { opacity: 1, y: 0 },
  className,
}: SplitTextProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    // Respect reduced-motion — leave the text in place, no reveal.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

    let split: GSAPSplitText | undefined;
    const ctx = gsap.context(() => {
      split = GSAPSplitText.create(el, {
        type: splitBy,
        mask: mask ? splitBy : undefined,
        autoSplit: true, // re-split on resize / font load
        // Build the tween in onSplit so it re-binds to the freshly split units.
        onSplit: (self) => {
          const units =
            splitBy === "words"
              ? self.words
              : splitBy === "lines"
                ? self.lines
                : self.chars;
          return gsap.fromTo(units, from, {
            ...to,
            duration,
            ease,
            stagger,
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        },
      });
    }, el);

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
