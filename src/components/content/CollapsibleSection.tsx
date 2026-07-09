import { useState, useId, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * The standard "show the math" / deep-dive toggle used across articles and
 * Foundations. Keyboard accessible, aria-wired, subtle chevron rotation.
 */
export function CollapsibleSection({ title, defaultOpen = false, children, className }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  return (
    <div className={cn("border border-primary/20 rounded-xl overflow-hidden", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-left bg-primary/5 hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-primary transition-transform duration-200", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div id={panelId} className="px-4 py-4 border-t border-primary/10">
          {children}
        </div>
      )}
    </div>
  );
}
