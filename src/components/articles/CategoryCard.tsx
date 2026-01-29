import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Wallet, Receipt, Landmark, CreditCard, LucideIcon } from "lucide-react";
import type { Category } from "@/data/articles";

interface CategoryCardProps {
  category: {
    id: Category;
    name: string;
    description: string;
    icon: string;
  };
  articleCount: number;
}

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  Wallet,
  Receipt,
  Landmark,
  CreditCard,
};

export function CategoryCard({ category, articleCount }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || TrendingUp;

  return (
    <Link to={`/categories/${category.id}`}>
      <Card className="group h-full card-hover">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary">
            <Icon className="h-7 w-7 text-primary transition-colors group-hover:text-primary-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">{category.name}</h3>
          <p className="mb-3 text-sm text-muted-foreground">{category.description}</p>
          <span className="text-xs font-medium text-accent">
            {articleCount} {articleCount === 1 ? "article" : "articles"}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
