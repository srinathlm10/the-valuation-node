import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { useAuth } from "@/hooks/useAuth";
import { useBookmarks } from "@/hooks/useBookmarks";
import { supabase } from "@/integrations/supabase/client";
import { contentService } from "@/services/contentService";
import { progressService } from "@/services/progressService";
import { BookOpen, Bookmark, ArrowRight, Loader2, Trophy, Flame, Star, Award } from "lucide-react";
import { gamificationService } from "@/services/gamificationService";
import { BadgeCard } from "@/components/gamification/BadgeCard";
import { Article } from "@/data/articles";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { bookmarks, loading: bookmarksLoading } = useBookmarks(user);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch articles from Supabase
  const { data: articles = [], isLoading: articlesLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: contentService.getArticles,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Fetch user progress
  const { data: completedIds = [] } = useQuery({
    queryKey: ['progress'],
    queryFn: progressService.getUserProgress,
    enabled: !!user,
  });

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

  const { data: badges = [] } = useQuery({
    queryKey: ['userBadges'],
    queryFn: gamificationService.getUserBadges,
    enabled: !!user
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', user!.id).single();
      return data;
    },
    enabled: !!user
  });

  useEffect(() => {
    gamificationService.checkStreak();
  }, [user]);

  if (data) {
    setDisplayName(data.display_name);
  }

  if (authLoading || (user && bookmarksLoading)) {
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

  // Filter bookmarks from loaded articles
  const bookmarkedArticles = bookmarks
    .map(id => articles.find(a => a.id === id))
    .filter((article): article is Article => article !== undefined);

  // Get suggested articles (first 3 for now)
  const suggestedArticles = articles.slice(0, 3);

  // Calculate Progress
  const totalArticles = articles.length;
  const completedCount = completedIds.length;
  const progressPercentage = totalArticles > 0 ? Math.round((completedCount / totalArticles) * 100) : 0;

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



        {/* Gamification Stats */}
        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-orange-400/10 to-red-400/10 border-orange-200/50">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Daily Streak</p>
                <h3 className="text-2xl font-bold">{profile?.streak_count || 0} Days</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-400/10 to-indigo-400/10 border-blue-200/50">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Star className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                <h3 className="text-2xl font-bold">{profile?.total_points || 0} XP</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badges Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              Your Badges
            </h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/settings">View All</Link>
            </Button>
          </div>
          {badges.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {badges.map(badge => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Start learning to earn your first badge!</p>
          )}
        </section>

        {/* Quick Actions */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Progress Card */}
          <Card className="card-hover border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col justify-center p-6 h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Your Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    {completedCount} of {totalArticles} articles read
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs text-right text-muted-foreground">{progressPercentage}% Complete</p>
              </div>
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

          <Card className="card-hover">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Explore</h3>
                <p className="text-sm text-muted-foreground">
                  Browse new topics
                </p>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/learn">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
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
          {articlesLoading ? (
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
          {articlesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {suggestedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
