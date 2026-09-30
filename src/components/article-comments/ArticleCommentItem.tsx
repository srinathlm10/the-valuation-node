import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Pencil, Trash2, Flag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { articleCommentService, type ArticleComment, type ReportReason } from "@/services/articleCommentService";
import { ReportCommentDialog } from "@/components/community/ReportCommentDialog";

const ARTICLE_REPORT_REASONS = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment" },
  { value: "off_topic", label: "Off-topic" },
  { value: "misinformation", label: "Misinformation" },
  { value: "other", label: "Other" },
] as const;

export function ArticleCommentItem({
  comment,
  articleSlug,
  currentUserId,
}: {
  comment: ArticleComment;
  articleSlug: string;
  currentUserId: string | null;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const queryKey = ["articleComments", articleSlug];

  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(comment.body);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [reporting, setReporting] = useState(false);

  const isOwn = !!currentUserId && currentUserId === comment.user_id;
  const canReport = !!currentUserId && !isOwn;

  const editMutation = useMutation({
    mutationFn: (body: string) => articleCommentService.editComment(comment.id, body),
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey });
      toast({ title: "Comment updated" });
    },
    onError: () => toast({ title: "Failed to update comment", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => articleCommentService.deleteComment(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({ title: "Comment deleted" });
    },
    onError: () => toast({ title: "Failed to delete comment", variant: "destructive" }),
  });

  return (
    <div className="flex gap-3 py-4 border-b last:border-0">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback><User className="h-3.5 w-3.5" /></AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">{comment.display_name}</p>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
          </span>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="min-h-[70px] text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => editMutation.mutate(editBody)} disabled={!editBody.trim() || editMutation.isPending}>
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setIsEditing(false); setEditBody(comment.body); }}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-foreground/90 whitespace-pre-line">{comment.body}</p>
        )}

        {!isEditing && (
          <div className="flex items-center gap-1 pt-1">
            {isOwn && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-3 w-3 mr-1" /> Edit
                </Button>
                {confirmingDelete ? (
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    Delete this comment?
                    <button
                      type="button"
                      className="font-medium text-destructive hover:underline"
                      onClick={() => deleteMutation.mutate()}
                      disabled={deleteMutation.isPending}
                    >
                      Yes
                    </button>
                    <button type="button" className="hover:underline" onClick={() => setConfirmingDelete(false)}>
                      No
                    </button>
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                    onClick={() => setConfirmingDelete(true)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                  </Button>
                )}
              </>
            )}
            {canReport && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setReporting(true)}
              >
                <Flag className="h-3 w-3 mr-1" /> Report
              </Button>
            )}
          </div>
        )}
      </div>

      {reporting && (
        <ReportCommentDialog
          commentId={comment.id}
          contentSlug={articleSlug}
          open={reporting}
          onOpenChange={(open) => setReporting(open)}
          reasons={ARTICLE_REPORT_REASONS}
          onSubmit={(reason, details) =>
            currentUserId
              ? articleCommentService.reportComment(comment.id, currentUserId, reason as ReportReason, details)
              : Promise.reject(new Error("Log in to report a comment."))
          }
        />
      )}
    </div>
  );
}
