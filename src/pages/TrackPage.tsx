import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { ContentList } from "@/components/content/ContentList";
import { staticMeta } from "@/lib/contentModel";
import { itemsInTrack } from "@/lib/contentIndex";
import { getTrack, TRACKS } from "@/lib/taxonomy";
import { paths } from "@/lib/routes";
import { breadcrumbLd } from "@/lib/seo";
import { FOUNDATIONS_SECTION_ICONS } from "@/lib/siteIcons";

/** Landing for one Concept Guide track (former Foundations section), e.g. /vault/guides/accounting. */
export default function TrackPage({ trackId }: { trackId: string }) {
  const track = getTrack(trackId)!;
  const items = itemsInTrack(trackId);
  const path = paths.track(trackId);
  const Icon = FOUNDATIONS_SECTION_ICONS[trackId];
  const idx = TRACKS.findIndex((t) => t.id === trackId);
  const prev = idx > 0 ? TRACKS[idx - 1] : undefined;
  const next = idx < TRACKS.length - 1 ? TRACKS[idx + 1] : undefined;

  return (
    <Layout>
      <Seo
        meta={staticMeta({ title: `${track.label} Guides`, slug: trackId, section: "vault", subsection: "guides", summary: track.description })}
        path={path}
        titleTag={`${track.label}: Concept Guides - The Valuation Node`}
        jsonLd={[
          breadcrumbLd([
            { name: "The Vault", path: paths.vault() },
            { name: "Concept Guides", path: paths.guides() },
            { name: track.label, path },
          ]),
        ]}
      />
      <nav aria-label="Breadcrumb" className="border-b">
        <ol className="container flex max-w-5xl flex-wrap items-center gap-2 py-3 text-sm text-muted-foreground">
          <li><Link to={paths.vault()} className="hover:text-foreground">The Vault</Link></li>
          <li>/</li>
          <li><Link to={paths.guides()} className="hover:text-foreground">Concept Guides</Link></li>
          <li>/</li>
          <li className="font-medium text-foreground">{track.label}</li>
        </ol>
      </nav>
      <div className="container max-w-5xl py-14">
        <div className="flex items-start gap-3">
          {Icon && (
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{track.label}</h1>
            <p className="mt-2 max-w-3xl text-lg text-muted-foreground">{track.description}</p>
            <p className="mt-2 text-sm text-muted-foreground">{items.length} guides. Read in order, or jump to what you need.</p>
          </div>
        </div>
        <ContentList items={items} showTags={false} className="mt-10" />
        <nav aria-label="Other tracks" className="mt-12 grid gap-3 border-t pt-6 sm:grid-cols-2">
          {prev ? (
            <Link to={paths.track(prev.id)} className="rounded-lg border p-4 transition-colors hover:bg-muted/40">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Previous track</span>
              <p className="mt-1 font-medium">{prev.label}</p>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={paths.track(next.id)} className="rounded-lg border p-4 text-right transition-colors hover:bg-muted/40">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Next track</span>
              <p className="mt-1 font-medium">{next.label}</p>
            </Link>
          )}
        </nav>
      </div>
    </Layout>
  );
}
