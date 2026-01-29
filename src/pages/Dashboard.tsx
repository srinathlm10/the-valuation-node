import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { useAuth } from "@/hooks/useAuth";
import { useBookmarks } from "@/hooks/useBookmarks";
import { supabase } from "@/integrations/supabase/client";
import { articles, getArticleById } from "@/data/articles";
import { BookOpen, Bookmark, ArrowRight, Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { bookmarks, loading: bookmarksLoading } = useBookmarks(user);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setDisplayName(data.display_name);
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="container flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  const bookmarkedArticles = bookmarks
    .map(id => getArticleById(id))
    .filter((article): article is NonNullable<typeof article> => article !== undefined);

  const suggestedArticles = articles.slice(0, 3);

  return (
    <Layout>
      <div className="container py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">
            Welcome back{displayName ? `, ${displayName}` : ""}!
          </h1>
          <p className="text-muted-foreground">
            Continue your financial education journey
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="card-hover">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Continue Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Explore more articles
                </p>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/learn">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                <Bookmark className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Saved Articles</h3>
                <p className="text-sm text-muted-foreground">
                  {bookmarks.length} {bookmarks.length === 1 ? "article" : "articles"} bookmarked
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookmarked Articles */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Bookmarks</h2>
            {bookmarkedArticles.length > 3 && (
              <Button variant="outline" size="sm">
                View All
              </Button>
            )}
          </div>
          {bookmarksLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : bookmarkedArticles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bookmarkedArticles.slice(0, 3).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Bookmark className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="mb-2 font-semibold">No bookmarks yet</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Start saving articles to read later
                </p>
                <Button asChild>
                  <Link to="/learn">Browse Articles</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Suggested Articles */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Suggested For You</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/learn">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {suggestedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
