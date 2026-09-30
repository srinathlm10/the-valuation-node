import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { articleCommentService, type ArticleComment } from "@/services/articleCommentService";
import { useCommentRateLimit, isHoneypotTripped } from "@/hooks/useCommentRateLimit";

export function ArticleCommentForm({ articleSlug }: { articleSlug: string }) {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { secondsRemaining, recordSubmission } = useCommentRateLimit(`article:${articleSlug}`);

  const [body, setBody] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "yourself";

  const handleSubmit = async () => {
    if (!body.trim()) return;
    setPosted(false);

    // Bots that blindly fill every field trip this; pretend it worked so the
    // trap stays invisible, but never actually write the row.
    if (isHoneypotTripped(honeypot)) {
      setBody("");
      setHoneypot("");
      setPosted(true);
      return;
    }

    const wait = secondsRemaining();
    if (wait > 0) {
      toast({ title: `Please wait ${wait}s before commenting again.`, variant: "destructive" });
      return;
    }

    setPosting(true);
    try {
      const comment: ArticleComment = await articleCommentService.postComment(articleSlug, body.trim(), user?.id ?? null);
      recordSubmission();
      setBody("");
      setPosted(true);

      const queryKey = ["articleComments", articleSlug];
      if (user) {
        // Logged in: append the confirmed row directly, no refetch needed.
        queryClient.setQueryData<ArticleComment[]>(queryKey, (old) => [...(old ?? []), comment]);
      } else {
        // Anonymous: refetch rather than splice in a locally-built row, since
        // there is no client-side object to trust as authoritative here.
        queryClient.invalidateQueries({ queryKey });
      }
      queryClient.invalidateQueries({ queryKey: ["articleCommentCount", articleSlug] });
    } catch (err) {
      toast({ title: "Failed to post comment", description: "Please try again.", variant: "destructive" });
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        {user ? (
          <>Commenting as <strong className="text-foreground">{displayName}</strong>.</>
        ) : (
          <>Commenting as Guest. <a href="/login" className="underline hover:text-foreground">Log in</a> to comment as yourself.</>
        )}
      </p>
      <Textarea
        placeholder="Add a comment..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="min-h-[80px]"
      />
      {/* Honeypot: left empty by real visitors, invisible and unreachable by tab. */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="flex items-center justify-between gap-3">
        {posted ? <p className="text-xs text-emerald-600">Comment posted.</p> : <span />}
        <Button size="sm" onClick={handleSubmit} disabled={!body.trim() || posting}>
          {posting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
          Post Comment
        </Button>
      </div>
    </div>
  );
}
