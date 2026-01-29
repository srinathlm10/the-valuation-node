import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CategoryCard } from "@/components/articles/CategoryCard";
import { categories, getArticlesByCategory } from "@/data/articles";

export default function Categories() {
  return (
    <Layout>
      <div className="container py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl">
            Financial Education Topics
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Choose a topic to explore. Each category contains carefully curated
            articles to help you build your financial knowledge.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              articleCount={getArticlesByCategory(category.id).length}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
