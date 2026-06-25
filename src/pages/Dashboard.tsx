import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { useAuth } from "@/contexts/AuthContext";
import { useBookmarks } from "@/hooks/useBookmarks";
import { supabase } from "@/integrations/supabase/client";
import { contentService } from "@/services/contentService";
import { BookOpen, Bookmark, Loader2, ArrowRight } from "lucide-react";
import { Article } from "@/data/articles";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { bookmarks, loading: bookmarksLoading } = useBookmarks(user);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: articles = [], isLoading: articlesLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: contentService.getArticles,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login?next=/dashboard");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.display_name) setDisplayName(data.display_name);
        });
    }
  }, [user]);

  if (authLoading || (user && bookmarksLoading)) {
    return (
      <Layout>
        <div className="container flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  const bookmarkedArticles = bookmarks
    .map((id) => (articles as Article[]).find((a) => a.id === id))
    .filter((a): a is Article => a !== undefined);

  return (
    <Layout>
      <Helmet>
        <title>Dashboard — The Valuation Node</title>
      </Helmet>

      <div className="container max-w-4xl py-12">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">
            Welcome back{displayName ? `, ${displayName}` : ""}
          </h1>
          <p className="mt-1 text-muted-foreground">Your reading list and account.</p>
        </div>

        {/* Bookmarks */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Bookmark className="h-5 w-5" />
              Bookmarks
            </h2>
          </div>

          {articlesLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </div>
          ) : bookmarkedArticles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bookmarkedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">No bookmarks yet.</p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/research">Browse research <ArrowRight className="ml-2 h-3.5 w-3.5" /></Link>
              </Button>
            </div>
          )}
        </section>

        {/* Reading History placeholder */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
            <BookOpen className="h-5 w-5" />
            Reading history
          </h2>
          <p className="text-sm text-muted-foreground">
            Recently viewed articles will appear here.
            {/* TODO: Implement reading history tracking */}
          </p>
        </section>

        {/* Profile section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <div className="rounded-xl border bg-muted/10 p-6 space-y-3">
            <p className="text-sm">
              <span className="text-muted-foreground">Email: </span>
              {user.email}
            </p>
            {displayName && (
              <p className="text-sm">
                <span className="text-muted-foreground">Name: </span>
                {displayName}
              </p>
            )}
            <div className="pt-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/settings">Edit profile</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
