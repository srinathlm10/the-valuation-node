import { Link } from "react-router-dom";
import { FOUNDATIONS_TREE } from "@/pages/Foundations";
import { FOUNDATIONS_CONTENT } from "@/data/foundationsContent";
import { FOUNDATIONS_SECTION_ICONS } from "@/lib/siteIcons";
import { cn } from "@/lib/utils";

interface RelatedTopic {
  section: string;
  sectionLabel: string;
  slug: string;
  label: string;
  buildsOnThis: boolean;
}

/**
 * Related Foundations topics for a given topic: first, topics anywhere in the
 * library that list THIS topic as a prerequisite (the natural "read next"),
 * then the following topics in the same section to keep the reader moving.
 */
function getRelatedTopics(sectionSlug: string, topicSlug: string, limit = 4): RelatedTopic[] {
  const out: RelatedTopic[] = [];
  const currentHref = `/learn/foundations/${sectionSlug}/${topicSlug}`;

  for (const sec of FOUNDATIONS_TREE) {
    for (const t of sec.topics) {
      if (sec.section === sectionSlug && t.slug === topicSlug) continue;
      const c = FOUNDATIONS_CONTENT[t.slug];
      if (c?.prerequisites?.some((p) => p.href === currentHref)) {
        out.push({
          section: sec.section,
          sectionLabel: sec.label,
          slug: t.slug,
          label: t.label,
          buildsOnThis: true,
        });
      }
    }
  }

  const sec = FOUNDATIONS_TREE.find((s) => s.section === sectionSlug);
  if (sec) {
    const idx = sec.topics.findIndex((t) => t.slug === topicSlug);
    for (let i = 1; i < sec.topics.length && out.length < limit; i++) {
      const t = sec.topics[(idx + i) % sec.topics.length];
      if (t.slug === topicSlug || out.some((o) => o.slug === t.slug)) continue;
      out.push({
        section: sec.section,
        sectionLabel: sec.label,
        slug: t.slug,
        label: t.label,
        buildsOnThis: false,
      });
    }
  }

  return out.slice(0, limit);
}

interface RelatedTopicsProps {
  section: string;
  topic: string;
  className?: string;
}

export function RelatedTopics({ section, topic, className }: RelatedTopicsProps) {
  const related = getRelatedTopics(section, topic);
  if (related.length === 0) return null;

  return (
    <section className={className}>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Related topics
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {related.map((t) => {
          const Icon = FOUNDATIONS_SECTION_ICONS[t.section];
          return (
            <Link
              key={`${t.section}/${t.slug}`}
              to={`/learn/foundations/${t.section}/${t.slug}`}
              className="group flex items-start gap-3 rounded-xl border bg-card p-4 hover:border-primary/30 hover:shadow-md transition-all"
            >
              {Icon && (
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                </span>
              )}
              <span className="min-w-0">
                <span className={cn("block text-sm font-medium leading-snug group-hover:underline")}>
                  {t.label}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {t.buildsOnThis ? "Builds on this topic" : t.sectionLabel}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
