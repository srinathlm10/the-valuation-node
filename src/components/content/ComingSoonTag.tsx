import { cn } from "@/lib/utils";

/**
 * Small inline marker for a section or sub-section that exists in the site
 * map but has nothing published yet. Used next to the label in landing-page
 * pills and footer links so the entry is visible, not hidden.
 */
export function ComingSoonTag({ className }: { className?: string }) {
  return (
    <span className={cn("ml-1.5 text-[11px] font-normal italic opacity-70", className)}>
      coming soon
    </span>
  );
}
