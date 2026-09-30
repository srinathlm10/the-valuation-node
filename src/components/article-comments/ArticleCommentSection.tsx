import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { articleCommentService } from "@/services/articleCommentService";
import { ArticleCommentForm } from "@/components/article-comments/ArticleCommentForm";
import { ArticleCommentItem } from "@/components/article-comments/ArticleCommentItem";

/**
 * Comment section for a research/analysis article, separate from the
 * community forum. Comments post immediately (no moderation hold); the
 * auto-hide trigger in the article_comments migration handles abuse
 * reactively once a comment collects 3 reports.
 */
export function ArticleCommentSection({ articleSlug }: { articleSlug: string }) {
  const { user } = useAuth();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["articleComments", articleSlug],
    queryFn: () => articleCommentService.fetchComments(articleSlug),
  });

  return (
    <section className="mt-14" aria-labelledby="article-comments-heading">
      <h2 id="article-comments-heading" className="text-xl font-semibold tracking-tight">
        Discussion
      </h2>

      <div className="mt-5">
        <ArticleCommentForm articleSlug={articleSlug} />
      </div>

      <Separator className="my-6" />

      {isLoading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-3 py-2">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div>
          {comments.map((comment) => (
            <ArticleCommentItem key={comment.id} comment={comment} articleSlug={articleSlug} currentUserId={user?.id ?? null} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-8">No comments yet. Be the first.</p>
      )}
    </section>
  );
}
