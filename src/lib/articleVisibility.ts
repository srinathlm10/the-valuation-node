import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// The `hidden_articles` table holds the slugs of articles that are currently
// hidden. Presence of a row = hidden. This is a runtime check so an admin can
// hide/unhide instantly, from any device, with no redeploy.
//
// The table isn't in the generated Supabase types, so we cast the client loosely.
const db = supabase as unknown as {
  from: (t: string) => any;
};

const HIDDEN_KEY = ["hidden-articles"] as const;

export function useHiddenSlugs() {
  return useQuery({
    queryKey: HIDDEN_KEY,
    queryFn: async (): Promise<Set<string>> => {
      const { data, error } = await db.from("hidden_articles").select("slug");
      // Fail open: if the table doesn't exist yet (migration not run) or the read
      // fails, treat nothing as hidden so the site keeps working.
      if (error) return new Set<string>();
      return new Set<string>((data ?? []).map((r: { slug: string }) => r.slug));
    },
    staleTime: 30_000,
  });
}

export function useToggleHidden() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug, hide }: { slug: string; hide: boolean }) => {
      if (hide) {
        const { error } = await db.from("hidden_articles").insert({ slug });
        // 23505 = unique_violation (already hidden) — safe to ignore.
        if (error && error.code !== "23505") throw error;
      } else {
        const { error } = await db.from("hidden_articles").delete().eq("slug", slug);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: HIDDEN_KEY }),
  });
}
