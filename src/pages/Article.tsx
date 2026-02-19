import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { getArticleById, getRelatedArticles } from "@/data/articles";
import { useAuth } from "@/hooks/useAuth";
import { useBookmarks } from "@/hooks/useBookmarks";
import { ArrowLeft, Clock, BookOpen, Bookmark, BookmarkCheck, CheckCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Quiz } from "@/components/quiz/Quiz";

const difficultyColors = {
  beginner: "bg-success/10 text-success border-success/20",
  intermediate: "bg-warning/10 text-warning border-warning/20",
  advanced: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Article() {
  const { articleId } = useParams<{ articleId: string }>();
  const article = articleId ? getArticleById(articleId) : undefined;
  const relatedArticles = articleId ? getRelatedArticles(articleId) : [];
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks(user);

  if (!article) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Article Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            The article you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/learn">Browse Articles</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const bookmarked = isBookmarked(article.id);

  return (
    <Layout>
      <article className="container py-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/learn">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Link>
        </Button>

        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {article.category}
            </Badge>
            <Badge variant="outline" className={difficultyColors[article.difficulty]}>
              {article.difficulty}
            </Badge>
          </div>
          <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          <p className="mb-6 text-lg text-muted-foreground">{article.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              By {article.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {article.readingTime} min read
            </span>
            <span>
              Published {new Date(article.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-8 overflow-hidden rounded-lg">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-64 w-full object-cover sm:h-80 lg:h-96"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Article Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-primary">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>

            {/* Quiz Section */}
            <div className="mt-12">
              <Quiz articleId={article.id} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Bookmark Button */}
            <Button
              variant={bookmarked ? "secondary" : "outline"}
              className="w-full"
              onClick={() => toggleBookmark(article.id)}
            >
              {bookmarked ? (
                <>
                  <BookmarkCheck className="mr-2 h-4 w-4" />
                  Bookmarked
                </>
              ) : (
                <>
                  <Bookmark className="mr-2 h-4 w-4" />
                  Bookmark Article
                </>
              )}
            </Button>

            {/* Key Takeaways */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-4 text-lg font-semibold">Key Takeaways</h3>
                <ul className="space-y-3">
                  {article.keyTakeaways.map((takeaway, index) => (
                    <li key={index} className="flex gap-3 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Related Articles</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard key={relatedArticle.id} article={relatedArticle} />
              ))}
            </div>
          </section>
        )}
      </article>
    </Layout>
  );
}
