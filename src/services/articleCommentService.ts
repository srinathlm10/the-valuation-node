import { supabase } from "@/integrations/supabase/client";

// article_comments and article_comment_reports aren't in the generated
// Supabase types (supabase/migrations/20260930_008_article_comments.sql
// hasn't been run against a project when `supabase gen types` was last used),
// so the client is cast loosely here, the same pattern as
// src/lib/articleVisibility.ts uses for hidden_articles.
const db = supabase as unknown as {
  from: (table: string) => any;
};

export type ReportReason = "spam" | "harassment" | "off_topic" | "misinformation" | "other";

export interface ArticleComment {
  id: string;
  article_slug: string;
  user_id: string | null;
  body: string;
  created_at: string;
  is_hidden: boolean;
  report_count: number;
  /** "Guest" for anonymous comments, or the commenter's profile display name (falls back to "Anonymous"). */
  display_name: string;
}

function resolveDisplayName(row: { user_id: string | null; author_label: string | null; profiles?: { display_name: string | null } | null }): string {
  if (row.user_id === null) return row.author_label || "Guest";
  return row.profiles?.display_name || "Anonymous";
}

export const articleCommentService = {
  /** Visible comments for one article, oldest first. Never throws; a failed or not-yet-migrated table reads as empty. */
  async fetchComments(articleSlug: string): Promise<ArticleComment[]> {
    const { data, error } = await db
      .from("article_comments")
      .select("id, article_slug, user_id, author_label, body, created_at, is_hidden, report_count, profiles(display_name)")
      .eq("article_slug", articleSlug)
      .eq("is_hidden", false)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching article comments:", error);
      return [];
    }
    return (data ?? []).map((row: any) => ({
      id: row.id,
      article_slug: row.article_slug,
      user_id: row.user_id,
      body: row.body,
      created_at: row.created_at,
      is_hidden: row.is_hidden,
      report_count: row.report_count,
      display_name: resolveDisplayName(row),
    }));
  },

  /** Count of visible comments, for the header pill. Fails to 0 rather than throwing. */
  async getCommentCount(articleSlug: string): Promise<number> {
    const { count, error } = await db
      .from("article_comments")
      .select("id", { count: "exact", head: true })
      .eq("article_slug", articleSlug)
      .eq("is_hidden", false);
    if (error) {
      console.error("Error counting article comments:", error);
      return 0;
    }
    return count ?? 0;
  },

  /** userId null posts as Guest (author_label "Guest"); otherwise posts under that user's own profile. */
  async postComment(articleSlug: string, body: string, userId: string | null): Promise<ArticleComment> {
    const { data, error } = await db
      .from("article_comments")
      .insert({
        article_slug: articleSlug,
        user_id: userId,
        author_label: userId ? null : "Guest",
        body,
      })
      .select("id, article_slug, user_id, author_label, body, created_at, is_hidden, report_count, profiles(display_name)")
      .single();
    if (error) throw error;
    return {
      id: data.id,
      article_slug: data.article_slug,
      user_id: data.user_id,
      body: data.body,
      created_at: data.created_at,
      is_hidden: data.is_hidden,
      report_count: data.report_count,
      display_name: resolveDisplayName(data),
    };
  },

  /** RLS restricts this to the comment's own author. */
  async editComment(commentId: string, body: string): Promise<void> {
    const { error } = await db.from("article_comments").update({ body }).eq("id", commentId);
    if (error) throw error;
  },

  /** RLS restricts this to the comment's own author (or an admin, see adminDeleteComment). */
  async deleteComment(commentId: string): Promise<void> {
    const { error } = await db.from("article_comments").delete().eq("id", commentId);
    if (error) throw error;
  },

  async reportComment(commentId: string, reporterId: string, reason: ReportReason, details?: string): Promise<void> {
    const { error } = await db.from("article_comment_reports").insert({
      comment_id: commentId,
      reporter_id: reporterId,
      reason,
      details: details ?? null,
    });
    if (error) {
      if (error.code === "23505") throw new Error("You have already reported this comment.");
      throw error;
    }
  },

  // ── Admin moderation (all RLS-gated to role = 'admin') ──────────────────

  async getAdminComments(): Promise<ArticleComment[]> {
    const { data, error } = await db
      .from("article_comments")
      .select("id, article_slug, user_id, author_label, body, created_at, is_hidden, report_count, profiles(display_name)")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching admin article comments:", error);
      return [];
    }
    return (data ?? []).map((row: any) => ({
      id: row.id,
      article_slug: row.article_slug,
      user_id: row.user_id,
      body: row.body,
      created_at: row.created_at,
      is_hidden: row.is_hidden,
      report_count: row.report_count,
      display_name: resolveDisplayName(row),
    }));
  },

  async hideComment(commentId: string, isHidden: boolean): Promise<void> {
    const { error } = await db.from("article_comments").update({ is_hidden: isHidden }).eq("id", commentId);
    if (error) throw error;
  },

  async adminDeleteComment(commentId: string): Promise<void> {
    // Cascades to article_comment_reports via ON DELETE CASCADE.
    const { error } = await db.from("article_comments").delete().eq("id", commentId);
    if (error) throw error;
  },

  /**
   * article_comment_reports has no status column (unlike the community
   * comment_reports table): a report row is the pending state, so "reviewing"
   * one means removing it from the queue, either by dismissing it alone or
   * by resolving it alongside hiding the comment (below).
   */
  async getAdminReports(): Promise<Array<{ id: string; comment_id: string; reason: ReportReason; details: string | null; created_at: string; reporter_name: string | null; comment: { id: string; article_slug: string; body: string; is_hidden: boolean; display_name: string } | null }>> {
    const { data, error } = await db
      .from("article_comment_reports")
      .select(`
        id, comment_id, reason, details, created_at,
        profiles!reporter_id (display_name),
        article_comments (id, article_slug, body, is_hidden, user_id, author_label, profiles(display_name))
      `)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching article comment reports:", error);
      return [];
    }
    return (data ?? []).map((r: any) => ({
      id: r.id,
      comment_id: r.comment_id,
      reason: r.reason,
      details: r.details,
      created_at: r.created_at,
      reporter_name: r.profiles?.display_name ?? null,
      comment: r.article_comments
        ? {
            id: r.article_comments.id,
            article_slug: r.article_comments.article_slug,
            body: r.article_comments.body,
            is_hidden: r.article_comments.is_hidden,
            display_name: resolveDisplayName(r.article_comments),
          }
        : null,
    }));
  },

  /** Removes one report from the queue without touching the comment. */
  async dismissReport(reportId: string): Promise<void> {
    const { error } = await db.from("article_comment_reports").delete().eq("id", reportId);
    if (error) throw error;
  },

  /** Hides the comment and clears every report against it (there is no "reviewed" status to set instead). */
  async hideAndResolveReports(commentId: string): Promise<void> {
    const { error: hideError } = await db.from("article_comments").update({ is_hidden: true, report_count: 0 }).eq("id", commentId);
    if (hideError) throw hideError;
    const { error: clearError } = await db.from("article_comment_reports").delete().eq("comment_id", commentId);
    if (clearError) throw clearError;
  },
};
