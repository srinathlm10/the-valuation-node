import { useQuery } from "@tanstack/react-query";
import { articleCommentService } from "@/services/articleCommentService";

/** "5 comments" / "1 comment" / "No comments yet", sized to sit inline with the read-time text. */
export function ArticleCommentCount({ articleSlug }: { articleSlug: string }) {
  const { data: count } = useQuery({
    queryKey: ["articleCommentCount", articleSlug],
    queryFn: () => articleCommentService.getCommentCount(articleSlug),
  });

  if (count === undefined) return null;
  return <span>{count === 0 ? "No comments yet" : `${count} comment${count === 1 ? "" : "s"}`}</span>;
}
