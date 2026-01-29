import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Button } from "@/components/ui/button";
import { categories, getArticlesByCategory, type Category as CategoryType } from "@/data/articles";
import { ArrowLeft, TrendingUp, Wallet, Receipt, Landmark, CreditCard, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  Wallet,
  Receipt,
  Landmark,
  CreditCard,
};

export default function Category() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = categories.find((c) => c.id === categoryId);
  const articles = categoryId ? getArticlesByCategory(categoryId as CategoryType) : [];

  if (!category) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Category Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            The category you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/categories">Browse Categories</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const Icon = iconMap[category.icon] || TrendingUp;

  return (
    <Layout>
      <div className="container py-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            All Categories
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">{category.name}</h1>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
          </div>
        </div>

        {/* Articles */}
        {articles.length > 0 ? (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              {articles.length} {articles.length === 1 ? "article" : "articles"} in this category
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No articles in this category yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
