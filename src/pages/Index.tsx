import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { CategoryCard } from "@/components/articles/CategoryCard";
import { articles, categories, getArticlesByCategory } from "@/data/articles";
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Target,
  BookOpen,
  Users,
  Award,
} from "lucide-react";

const benefits = [
  {
    icon: BookOpen,
    title: "Learn at Your Pace",
    description: "Comprehensive articles from beginner to advanced levels",
  },
  {
    icon: Shield,
    title: "Trustworthy Content",
    description: "Expert-reviewed information you can rely on",
  },
  {
    icon: Target,
    title: "Practical Knowledge",
    description: "Real-world strategies you can apply today",
  },
];

const stats = [
  { value: "50+", label: "Educational Articles" },
  { value: "10k+", label: "Active Learners" },
  { value: "5", label: "Topic Categories" },
];

const Index = () => {
  const featuredArticles = articles.slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-20 lg:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--navy-dark)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--navy-dark)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              Master Your{" "}
              <span className="text-gradient">Financial Future</span>
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/80 sm:text-xl">
              Build wealth, reduce debt, and achieve financial freedom with expert-crafted 
              educational content. Start your journey to financial literacy today.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/learn">
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link to="/signup">Create Free Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-secondary/50 py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Why Learn With Us?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              We make financial education accessible, engaging, and actionable for everyone.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-secondary/30 py-16 lg:py-24">
        <div className="container">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold">Browse by Topic</h2>
              <p className="text-muted-foreground">
                Explore our comprehensive financial education categories
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link to="/categories">
                View All Categories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                articleCount={getArticlesByCategory(category.id).length}
              />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link to="/categories">View All Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold">Featured Articles</h2>
              <p className="text-muted-foreground">
                Start with our most popular educational content
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link to="/learn">
                View All Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link to="/learn">View All Articles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground sm:text-4xl">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/80">
              Join thousands of learners building their financial future. 
              Create a free account to bookmark articles and track your progress.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
