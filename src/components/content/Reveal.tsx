import { useEffect, useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms for grouped items. */
  delay?: number;
}

/**
 * Subtle scroll reveal, done as progressive enhancement: the prerendered HTML
 * is fully visible (crawlers and no-JS readers see everything). Only after
 * hydration, and only for elements still below the fold, is the element
 * hidden and then faded up when it scrolls into view. Skipped entirely when
 * the reader prefers reduced motion.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already in (or near) view: don't hide content the reader can see.
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.92) return;

    el.classList.add("reveal-pending");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("reveal-shown");
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
