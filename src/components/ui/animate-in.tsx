"use client";

import { useEffect, useRef, useState } from "react";

interface AnimateInProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in ms before the animation starts once in view */
  delay?: number;
  /** Animation direction — default is bottom (slide up) */
  from?: "bottom" | "left" | "right" | "none";
  /** Intersection threshold 0–1 */
  threshold?: number;
}

const TRANSLATE: Record<NonNullable<AnimateInProps["from"]>, string> = {
  bottom: "translate-y-8",
  left:   "-translate-x-8",
  right:  "translate-x-8",
  none:   "",
};

export function AnimateIn({
  children,
  className = "",
  delay = 0,
  from = "bottom",
  threshold = 0.15,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const hiddenClass = `opacity-0 ${TRANSLATE[from]}`;
  const visibleClass = "opacity-100 translate-x-0 translate-y-0";

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? visibleClass : hiddenClass} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
