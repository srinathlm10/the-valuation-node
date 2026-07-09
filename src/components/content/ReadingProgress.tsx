import { useEffect, useState } from "react";

/**
 * Thin teal bar under the sticky header showing how far through the page the
 * reader is. Purely decorative (aria-hidden); scroll-driven rather than
 * animated, so it is inherently reduced-motion friendly.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min(100, (el.scrollTop / total) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed top-16 left-0 right-0 z-40 h-0.5 pointer-events-none">
      <div className="h-full bg-primary/80" style={{ width: `${progress}%` }} />
    </div>
  );
}
