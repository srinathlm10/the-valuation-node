import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff, Trash2, ShieldOff } from "lucide-react";
import { communityService, Comment, CommentReport } from "@/services/communityService";
import { articleCommentService, type ArticleComment } from "@/services/articleCommentService";
import { researchPath } from "@/lib/routes";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

function truncate(text: string, max = 120) {
    return text.length > max ? text.slice(0, max) + "..." : text;
}

// Group pending reports by comment_id so each row = one reported comment
function groupReports(reports: CommentReport[]) {
    const map = new Map<string, { reports: CommentReport[]; comment: CommentReport["comments"] }>();
    for (const r of reports) {
        if (!map.has(r.comment_id)) {
            map.set(r.comment_id, { reports: [], comment: r.comments ?? null });
        }
        map.get(r.comment_id)!.reports.push(r);
    }
    // Sort by report count descending
    return Array.from(map.entries())
        .map(([commentId, { reports, comment }]) => ({ commentId, reports, comment }))
        .sort((a, b) => b.reports.length - a.reports.length);
}

export default function CommentsManager() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [tab, setTab] = useState("comments");

    const { data: allComments = [], isLoading: commentsLoading } = useQuery({
        queryKey: ["adminComments"],
        queryFn: communityService.getAdminComments,
    });

    const { data: allReports = [], isLoading: reportsLoading } = useQuery({
        queryKey: ["adminReports"],
        queryFn: communityService.getAdminReports,
    });

    const { data: allArticleComments = [], isLoading: articleCommentsLoading } = useQuery({
        queryKey: ["adminArticleComments"],
        queryFn: articleCommentService.getAdminComments,
    });

    const { data: allArticleReports = [], isLoading: articleReportsLoading } = useQuery({
        queryKey: ["adminArticleReports"],
        queryFn: articleCommentService.getAdminReports,
    });

    const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ["adminComments"] });
        queryClient.invalidateQueries({ queryKey: ["adminReports"] });
    };

    const refreshArticleComments = () => {
        queryClient.invalidateQueries({ queryKey: ["adminArticleComments"] });
        queryClient.invalidateQueries({ queryKey: ["adminArticleReports"] });
    };

    const hideMutation = useMutation({
        mutationFn: ({ id, hidden }: { id: string; hidden: boolean }) =>
            communityService.hideComment(id, hidden),
        onSuccess: (_d, vars) => {
            toast({ title: vars.hidden ? "Comment hidden" : "Comment restored" });
            refresh();
        },
        onError: () => toast({ title: "Action failed", variant: "destructive" }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => communityService.adminDeleteComment(id),
        onSuccess: () => {
            toast({ title: "Comment deleted" });
            refresh();
        },
        onError: () => toast({ title: "Delete failed", variant: "destructive" }),
    });

    const hideResolveMutation = useMutation({
        mutationFn: async (commentId: string) => {
            await communityService.hideComment(commentId, true);
            await communityService.resolveReports(commentId, "reviewed");
        },
        onSuccess: () => {
            toast({ title: "Comment hidden and reports resolved" });
            refresh();
        },
        onError: () => toast({ title: "Action failed", variant: "destructive" }),
    });

    const deleteResolveMutation = useMutation({
        mutationFn: async (commentId: string) => {
            // Deleting the comment cascades to comment_reports via FK
            await communityService.adminDeleteComment(commentId);
        },
        onSuccess: () => {
            toast({ title: "Comment deleted" });
            refresh();
        },
        onError: () => toast({ title: "Delete failed", variant: "destructive" }),
    });

    const dismissMutation = useMutation({
        mutationFn: (reportId: string) => communityService.dismissReport(reportId),
        onSuccess: () => {
            toast({ title: "Report dismissed" });
            refresh();
        },
        onError: () => toast({ title: "Dismiss failed", variant: "destructive" }),
    });

    // ── Article comments (separate table, articleCommentService) ───────────

    const hideArticleCommentMutation = useMutation({
        mutationFn: ({ id, hidden }: { id: string; hidden: boolean }) =>
            articleCommentService.hideComment(id, hidden),
        onSuccess: (_d, vars) => {
            toast({ title: vars.hidden ? "Comment hidden" : "Comment restored" });
            refreshArticleComments();
        },
        onError: () => toast({ title: "Action failed", variant: "destructive" }),
    });

    const deleteArticleCommentMutation = useMutation({
        mutationFn: (id: string) => articleCommentService.adminDeleteComment(id),
        onSuccess: () => {
            setConfirmingDeleteId(null);
            toast({ title: "Comment deleted" });
            refreshArticleComments();
        },
        onError: () => toast({ title: "Delete failed", variant: "destructive" }),
    });

    const dismissArticleReportMutation = useMutation({
        mutationFn: (reportId: string) => articleCommentService.dismissReport(reportId),
        onSuccess: () => {
            toast({ title: "Report dismissed" });
            refreshArticleComments();
        },
        onError: () => toast({ title: "Dismiss failed", variant: "destructive" }),
    });

    const hideResolveArticleReportMutation = useMutation({
        mutationFn: (commentId: string) => articleCommentService.hideAndResolveReports(commentId),
        onSuccess: () => {
            toast({ title: "Comment hidden and reports resolved" });
            refreshArticleComments();
        },
        onError: () => toast({ title: "Action failed", variant: "destructive" }),
    });

    const deleteResolveArticleReportMutation = useMutation({
        mutationFn: (commentId: string) => articleCommentService.adminDeleteComment(commentId),
        onSuccess: () => {
            toast({ title: "Comment deleted" });
            refreshArticleComments();
        },
        onError: () => toast({ title: "Delete failed", variant: "destructive" }),
    });

    const grouped = groupReports(allReports);
    const pendingCount = grouped.length;

    // Group article reports by comment_id, same shape as groupReports above.
    const articleGrouped = (() => {
        const map = new Map<string, { reports: typeof allArticleReports; comment: ArticleComment | null }>();
        for (const r of allArticleReports) {
            if (!map.has(r.comment_id)) {
                map.set(r.comment_id, { reports: [], comment: r.comment as unknown as ArticleComment | null });
            }
            map.get(r.comment_id)!.reports.push(r);
        }
        return Array.from(map.entries())
            .map(([commentId, { reports, comment }]) => ({ commentId, reports, comment }))
            .sort((a, b) => b.reports.length - a.reports.length);
    })();
    const articlePendingCount = articleGrouped.length;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Comments</h2>
                <p className="text-slate-400">Moderate community comments and review reports.</p>
            </div>

            <Tabs value={tab} onValueChange={setTab} className="space-y-4">
                <TabsList className="bg-slate-900 border border-slate-800">
                    <TabsTrigger value="comments" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                        All Comments
                    </TabsTrigger>
                    <TabsTrigger value="articleComments" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                        Article Comments
                    </TabsTrigger>
                    <TabsTrigger value="reports" className="data-[state=active]:bg-red-700 data-[state=active]:text-white">
                        Reports {(pendingCount + articlePendingCount) > 0 && (
                            <Badge variant="destructive" className="ml-2 text-xs">{pendingCount + articlePendingCount}</Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* All Comments Tab */}
                <TabsContent value="comments">
                    <Card className="border-slate-800 bg-slate-900/30">
                        <CardHeader>
                            <CardTitle className="text-white">All Comments</CardTitle>
                            <CardDescription className="text-slate-400">
                                {allComments.length} total. Hidden comments are shown dimmed.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {commentsLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                                </div>
                            ) : allComments.length === 0 ? (
                                <p className="text-slate-400 text-center py-8">No comments yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {allComments.map((c: Comment) => (
                                        <div
                                            key={c.id}
                                            className={`flex items-start gap-4 p-4 rounded-lg border ${
                                                c.is_hidden
                                                    ? "border-slate-700 bg-slate-900/20 opacity-60"
                                                    : "border-slate-700 bg-slate-900/40"
                                            }`}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-medium text-slate-200">
                                                        {(c as any).profiles?.display_name || "Anonymous"}
                                                    </span>
                                                    {c.is_hidden && (
                                                        <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                                                            Hidden
                                                        </Badge>
                                                    )}
                                                    <span className="text-xs text-slate-500">
                                                        {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-300">{truncate(c.content)}</p>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-slate-400 hover:text-white"
                                                    onClick={() => hideMutation.mutate({ id: c.id, hidden: !c.is_hidden })}
                                                    title={c.is_hidden ? "Restore" : "Hide"}
                                                >
                                                    {c.is_hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-red-400 hover:text-red-300"
                                                    onClick={() => deleteMutation.mutate(c.id)}
                                                    title="Delete permanently"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Article Comments Tab (article_comments table, separate from the community comments above) */}
                <TabsContent value="articleComments">
                    <Card className="border-slate-800 bg-slate-900/30">
                        <CardHeader>
                            <CardTitle className="text-white">Article Comments</CardTitle>
                            <CardDescription className="text-slate-400">
                                {allArticleComments.length} total, across research and analysis articles. Hidden comments are shown dimmed.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {articleCommentsLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                                </div>
                            ) : allArticleComments.length === 0 ? (
                                <p className="text-slate-400 text-center py-8">No article comments yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {allArticleComments.map((c) => (
                                        <div
                                            key={c.id}
                                            className={`flex items-start gap-4 p-4 rounded-lg border ${
                                                c.is_hidden
                                                    ? "border-slate-700 bg-slate-900/20 opacity-60"
                                                    : "border-slate-700 bg-slate-900/40"
                                            }`}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className="text-sm font-medium text-slate-200">{c.display_name}</span>
                                                    <Link
                                                        to={researchPath(c.article_slug)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-emerald-400 hover:underline"
                                                    >
                                                        {c.article_slug}
                                                    </Link>
                                                    {c.is_hidden && (
                                                        <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                                                            Hidden
                                                        </Badge>
                                                    )}
                                                    <span className="text-xs text-slate-500">
                                                        {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-300">{truncate(c.body)}</p>
                                            </div>
                                            <div className="flex gap-2 shrink-0 items-center">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-slate-400 hover:text-white"
                                                    onClick={() => hideArticleCommentMutation.mutate({ id: c.id, hidden: !c.is_hidden })}
                                                    title={c.is_hidden ? "Restore" : "Hide"}
                                                >
                                                    {c.is_hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                </Button>
                                                {confirmingDeleteId === c.id ? (
                                                    <span className="flex items-center gap-2 text-xs text-slate-300">
                                                        Delete?
                                                        <button
                                                            type="button"
                                                            className="font-medium text-red-400 hover:underline"
                                                            onClick={() => deleteArticleCommentMutation.mutate(c.id)}
                                                            disabled={deleteArticleCommentMutation.isPending}
                                                        >
                                                            Yes
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="hover:underline"
                                                            onClick={() => setConfirmingDeleteId(null)}
                                                        >
                                                            No
                                                        </button>
                                                    </span>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-red-400 hover:text-red-300"
                                                        onClick={() => setConfirmingDeleteId(c.id)}
                                                        title="Delete permanently"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Reports Tab */}
                <TabsContent value="reports">
                    <Card className="border-slate-800 bg-slate-900/30">
                        <CardHeader>
                            <CardTitle className="text-white">Pending Reports</CardTitle>
                            <CardDescription className="text-slate-400">
                                Sorted by number of reports. Comments auto-hide at 3 reports.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {reportsLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                                </div>
                            ) : grouped.length === 0 ? (
                                <p className="text-slate-400 text-center py-8">No pending reports.</p>
                            ) : (
                                <div className="space-y-4">
                                    {grouped.map(({ commentId, reports, comment }) => {
                                        const topReason = reports
                                            .map(r => r.reason)
                                            .sort((a, b) =>
                                                reports.filter(r => r.reason === b).length -
                                                reports.filter(r => r.reason === a).length
                                            )[0];

                                        return (
                                            <div key={commentId} className="border border-slate-700 rounded-lg p-4 bg-slate-900/40 space-y-3">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Badge variant="destructive" className="text-xs">
                                                                {reports.length} {reports.length === 1 ? "report" : "reports"}
                                                            </Badge>
                                                            <span className="text-xs text-slate-400 capitalize">
                                                                Top reason: {topReason.replace("_", " ")}
                                                            </span>
                                                            {comment?.is_hidden && (
                                                                <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                                                                    Already hidden
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-slate-200 font-medium mb-1">
                                                            By: {comment?.profiles?.display_name || "Anonymous"}
                                                        </p>
                                                        <p className="text-sm text-slate-300 bg-slate-800/50 rounded p-2">
                                                            {truncate(comment?.content ?? "")}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Individual report reasons */}
                                                <div className="space-y-1">
                                                    {reports.map(r => (
                                                        <div key={r.id} className="flex items-start justify-between text-xs text-slate-400 gap-2">
                                                            <span>
                                                                <span className="capitalize">{r.reason.replace("_", " ")}</span>
                                                                {r.details && ` - "${r.details}"`}
                                                                {" by "}
                                                                {r.profiles?.display_name || "Anonymous"}
                                                            </span>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-5 px-2 text-xs text-slate-500 hover:text-slate-200"
                                                                onClick={() => dismissMutation.mutate(r.id)}
                                                            >
                                                                <ShieldOff className="h-3 w-3 mr-1" />
                                                                Dismiss
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex gap-2 pt-1">
                                                    {!comment?.is_hidden && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-amber-700 text-amber-400 hover:bg-amber-900/20"
                                                            onClick={() => hideResolveMutation.mutate(commentId)}
                                                        >
                                                            <EyeOff className="h-3 w-3 mr-1" />
                                                            Hide + resolve
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-red-800 text-red-400 hover:bg-red-900/20"
                                                        onClick={() => deleteResolveMutation.mutate(commentId)}
                                                    >
                                                        <Trash2 className="h-3 w-3 mr-1" />
                                                        Delete comment
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Article Reports (article_comment_reports; no status column, so a
                        report row IS the pending state, "resolving" removes it). */}
                    <Card className="border-slate-800 bg-slate-900/30 mt-6">
                        <CardHeader>
                            <CardTitle className="text-white">Article Comment Reports</CardTitle>
                            <CardDescription className="text-slate-400">
                                Reports on research/analysis article comments, sorted by number of reports.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {articleReportsLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                                </div>
                            ) : articleGrouped.length === 0 ? (
                                <p className="text-slate-400 text-center py-8">No pending article comment reports.</p>
                            ) : (
                                <div className="space-y-4">
                                    {articleGrouped.map(({ commentId, reports, comment }) => {
                                        const topReason = reports
                                            .map(r => r.reason)
                                            .sort((a, b) =>
                                                reports.filter(r => r.reason === b).length -
                                                reports.filter(r => r.reason === a).length
                                            )[0];

                                        return (
                                            <div key={commentId} className="border border-slate-700 rounded-lg p-4 bg-slate-900/40 space-y-3">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                            <Badge variant="destructive" className="text-xs">
                                                                {reports.length} {reports.length === 1 ? "report" : "reports"}
                                                            </Badge>
                                                            <span className="text-xs text-slate-400 capitalize">
                                                                Top reason: {topReason.replace("_", " ")}
                                                            </span>
                                                            {comment && (
                                                                <Link
                                                                    to={researchPath(comment.article_slug)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-xs text-emerald-400 hover:underline"
                                                                >
                                                                    {comment.article_slug}
                                                                </Link>
                                                            )}
                                                            {comment?.is_hidden && (
                                                                <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                                                                    Already hidden
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-slate-200 font-medium mb-1">
                                                            By: {comment?.display_name ?? "Unknown"}
                                                        </p>
                                                        <p className="text-sm text-slate-300 bg-slate-800/50 rounded p-2">
                                                            {truncate(comment?.body ?? "")}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    {reports.map(r => (
                                                        <div key={r.id} className="flex items-start justify-between text-xs text-slate-400 gap-2">
                                                            <span>
                                                                <span className="capitalize">{r.reason.replace("_", " ")}</span>
                                                                {r.details && ` - "${r.details}"`}
                                                                {" by "}
                                                                {r.reporter_name || "Anonymous"}
                                                            </span>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-5 px-2 text-xs text-slate-500 hover:text-slate-200"
                                                                onClick={() => dismissArticleReportMutation.mutate(r.id)}
                                                            >
                                                                <ShieldOff className="h-3 w-3 mr-1" />
                                                                Dismiss
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex gap-2 pt-1">
                                                    {!comment?.is_hidden && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-amber-700 text-amber-400 hover:bg-amber-900/20"
                                                            onClick={() => hideResolveArticleReportMutation.mutate(commentId)}
                                                        >
                                                            <EyeOff className="h-3 w-3 mr-1" />
                                                            Hide + resolve
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-red-800 text-red-400 hover:bg-red-900/20"
                                                        onClick={() => deleteResolveArticleReportMutation.mutate(commentId)}
                                                    >
                                                        <Trash2 className="h-3 w-3 mr-1" />
                                                        Delete comment
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
