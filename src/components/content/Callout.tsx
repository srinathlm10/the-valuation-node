import type { ReactNode } from "react";
import { Info, FlaskConical, AlertTriangle, XCircle, CheckCircle2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutVariant = "note" | "info" | "methodology" | "warning" | "danger" | "success";

const VARIANTS: Record<
  CalloutVariant,
  { box: string; title: string; icon: React.ComponentType<{ className?: string }> }
> = {
  note: {
    box: "border bg-muted/30",
    title: "text-foreground",
    icon: BookOpen,
  },
  info: {
    box: "border border-primary/25 bg-primary/5",
    title: "text-primary",
    icon: Info,
  },
  methodology: {
    box: "border border-primary/25 bg-primary/5",
    title: "text-primary",
    icon: FlaskConical,
  },
  warning: {
    box: "border border-amber-300/60 dark:border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/20",
    title: "text-amber-800 dark:text-amber-300",
    icon: AlertTriangle,
  },
  danger: {
    box: "border border-red-300/60 dark:border-red-500/30 bg-red-50/60 dark:bg-red-950/20",
    title: "text-red-800 dark:text-red-300",
    icon: XCircle,
  },
  success: {
    box: "border border-emerald-300/60 dark:border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/20",
    title: "text-emerald-800 dark:text-emerald-300",
    icon: CheckCircle2,
  },
};

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  /** Render the title as a real heading to keep the document outline intact. */
  titleAs?: "p" | "h2" | "h3";
  children: ReactNode;
  className?: string;
}

/**
 * The standard callout box for all content surfaces: Methodology, "Where I
 * might be wrong", common mistakes, prerequisites, examples. One component,
 * one look per meaning; never hand-roll tinted boxes on content pages.
 */
export function Callout({ variant = "note", title, titleAs = "p", children, className }: CalloutProps) {
  const v = VARIANTS[variant];
  const Icon = v.icon;
  const TitleTag = titleAs;
  return (
    <aside role="note" aria-label={title} className={cn("rounded-xl p-5", v.box, className)}>
      {title && (
        <TitleTag className={cn("flex items-center gap-2 font-semibold text-sm mb-2.5", v.title)}>
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {title}
        </TitleTag>
      )}
      <div className="text-sm text-muted-foreground leading-relaxed [&>*+*]:mt-2">{children}</div>
    </aside>
  );
}
