import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

export function useBookmarks(user: User | null) {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    } else {
      setBookmarks([]);
      setLoading(false);
    }
  }, [user]);

  const fetchBookmarks = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("article_id")
        .eq("user_id", user.id);

      if (error) throw error;
      setBookmarks(data?.map(b => b.article_id) || []);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (articleId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark articles.",
        variant: "destructive",
      });
      return;
    }

    const isBookmarked = bookmarks.includes(articleId);

    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("article_id", articleId);

        if (error) throw error;
        setBookmarks(prev => prev.filter(id => id !== articleId));
        toast({
          title: "Bookmark removed",
          description: "Article removed from your bookmarks.",
        });
      } else {
        const { error } = await supabase
          .from("bookmarks")
          .insert({ user_id: user.id, article_id: articleId });

        if (error) throw error;
        setBookmarks(prev => [...prev, articleId]);
        toast({
          title: "Bookmarked!",
          description: "Article added to your bookmarks.",
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast({
        title: "Error",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isBookmarked = (articleId: string) => bookmarks.includes(articleId);

  return { bookmarks, loading, toggleBookmark, isBookmarked };
}
