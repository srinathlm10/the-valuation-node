import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** Optional action (a Link or Button) rendered below the text. */
  action?: ReactNode;
  className?: string;
}

/**
 * The standard empty state: a lucide icon in a soft tinted circle above a short
 * title and description. Used for empty lists, no-result searches, unavailable
 * articles, and 404s, so "nothing here" always looks intentional, not broken.
 */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("py-14 text-center", className)}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
      </div>
      <p className="mt-4 font-semibold">{title}</p>
      {description && (
        <p className="mt-1.5 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
