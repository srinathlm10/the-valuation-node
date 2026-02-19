import { supabase } from "@/integrations/supabase/client";
import { Article, Category } from "@/data/articles";
import localDefinitions from "@/data/definitions.json";

// Types for Supabase response (snake_case)
interface SupabaseArticle {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category_id: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    reading_time: number;
    author: string;
    published_at: string;
    image_url: string;
    key_takeaways: string[];
    related_article_ids: string[];
}

interface SupabaseDefinition {
    id: string;
    term: string;
    full_name: string;
    category: string;
    definition: string;
    formula: string | null;
    why_it_matters: string | null;
    example: string | null;
    related_terms: string[];
}

export const contentService = {
    // Fetch all articles
    async getArticles(): Promise<Article[]> {
        const { data, error } = await supabase
            .from("articles")
            .select("*")
            .order("published_at", { ascending: false });

        if (error) {
            console.error("Error fetching articles:", error);
            // Fallback to local articles if DB fails
            const localArticles = (await import("@/data/articles")).articles;
            return localArticles;
        }

        const remoteArticles = (data as unknown as SupabaseArticle[]).map(mapArticleFromDb);
        const localArticles = (await import("@/data/articles")).articles;

        // Merge: Remote first, then local (or vice versa depending on priority)
        // Here we'll just combine them. We might want to deduplicate by ID if we sync them later.
        // For now, simple contact.
        // Filter out local articles that might already be in remote (by ID)
        const remoteIds = new Set(remoteArticles.map(a => a.id));
        const uniqueLocalArticles = localArticles.filter(a => !remoteIds.has(a.id));

        return [...remoteArticles, ...uniqueLocalArticles];
    },

    // Fetch single article by ID
    async getArticleById(id: string): Promise<Article | null> {
        const { data, error } = await supabase
            .from("articles")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.error(`Error fetching article ${id}:`, error);
            return null;
        }

        return mapArticleFromDb(data as unknown as SupabaseArticle);
    },

    // Fetch definitions
    async getDefinitions() {
        // Start with local definitions
        const localDefs = localDefinitions.map(def => ({
            id: def.id,
            term: def.term,
            fullName: def.fullName,
            category: def.category,
            definition: def.definition,
            formula: def.formula || "",
            whyItMatters: def.whyItMatters || "",
            example: def.example || "",
            relatedTerms: def.relatedTerms || []
        }));

        try {
            const { data, error } = await supabase
                .from("definitions")
                .select("*")
                .order("term", { ascending: true });

            if (error) {
                console.error("Error fetching definitions from Supabase:", error);
                return localDefs;
            }

            const remoteDefs = (data as unknown as SupabaseDefinition[]).map((def) => ({
                id: def.id,
                term: def.term,
                fullName: def.full_name,
                category: def.category,
                definition: def.definition,
                formula: def.formula || "",
                whyItMatters: def.why_it_matters || "",
                example: def.example || "",
                relatedTerms: def.related_terms || []
            }));

            // Combine both, prioritizing remote if IDs conflict (though they shouldn't usually)
            // or just merge them. Since we want to ensure our local ones are definitely there:
            const allDefs = [...remoteDefs, ...localDefs];

            // Deduplicate by ID if needed, preferring local for this specific task ensuring update
            // But let's simple concat for now as IDs are likely unique
            return allDefs;
        } catch (e) {
            console.error("Exception fetching definitions:", e);
            return localDefs;
        }
    },

    // Fetch stocks
    async getStocks() {
        const { data, error } = await supabase
            .from("stocks")
            .select("*")
            .order("market_cap", { ascending: false });

        if (error) {
            console.error("Error fetching stocks:", error);
            return [];
        }

        return data.map((stock: any) => ({
            id: stock.id,
            name: stock.name,
            sector: stock.sector,
            marketCap: stock.market_cap,
            pe: stock.pe_ratio,
            pb: stock.pb_ratio,
            roe: stock.roe,
            debtToEquity: stock.debt_to_equity,
            dividendYield: stock.dividend_yield,
            eps: stock.eps,
            revenueGrowth5Y: stock.revenue_growth_5y,
            profitGrowth5Y: stock.profit_growth_5y,
            currentPrice: stock.current_price,
            weekHigh52: stock.week_high_52,
            weekLow52: stock.week_low_52
        }));
    }
};

// Helper: Map DB snake_case to UI camelCase
function mapArticleFromDb(dbArticle: SupabaseArticle): Article {
    return {
        id: dbArticle.id,
        title: dbArticle.title,
        excerpt: dbArticle.excerpt,
        content: dbArticle.content,
        category: dbArticle.category_id as Category, // We store 'investing' etc in category_id
        difficulty: dbArticle.difficulty,
        readingTime: dbArticle.reading_time,
        author: dbArticle.author,
        publishedAt: dbArticle.published_at,
        imageUrl: dbArticle.image_url,
        keyTakeaways: dbArticle.key_takeaways,
        relatedArticleIds: dbArticle.related_article_ids
    };
}
