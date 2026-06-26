import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, BookOpen, BrainCircuit, Activity } from "lucide-react";

interface Stats {
    totalUsers: number;
    totalQuizzesTaken: number;
    avgScore: number;
    totalArticles: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalQuizzesTaken: 0,
        avgScore: 0,
        totalArticles: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                setLoading(true);

                const [
                    { count: userCount },
                    { data: quizData },
                    { count: articleCount },
                ] = await Promise.all([
                    supabase.from("profiles").select("*", { count: "exact", head: true }),
                    supabase.from("user_quiz_attempts").select("score"),
                    supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
                ]);

                const quizCount = quizData?.length ?? 0;
                const totalScore = quizData?.reduce((acc, curr) => acc + (curr.score || 0), 0) ?? 0;
                const avgScore = quizCount > 0 ? Math.round(totalScore / quizCount) : 0;

                setStats({
                    totalUsers: userCount ?? 0,
                    totalQuizzesTaken: quizCount,
                    avgScore,
                    totalArticles: articleCount ?? 0,
                });
            } catch (e) {
                console.error("Dashboard fetch error:", e);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    const statCards = [
        {
            label: "Total Users",
            value: loading ? "-" : stats.totalUsers,
            sub: "Registered accounts",
            icon: Users,
            color: "text-emerald-500",
        },
        {
            label: "Quiz Attempts",
            value: loading ? "-" : stats.totalQuizzesTaken,
            sub: "Total quizzes completed",
            icon: BrainCircuit,
            color: "text-blue-500",
        },
        {
            label: "Avg Quiz Score",
            value: loading ? "-" : `${stats.avgScore}%`,
            sub: "Average user performance",
            icon: Activity,
            color: "text-amber-500",
        },
        {
            label: "Published Articles",
            value: loading ? "-" : stats.totalArticles,
            sub: "Live on the site",
            icon: BookOpen,
            color: "text-purple-500",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
                <p className="text-slate-400">Platform usage at a glance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map(({ label, value, sub, icon: Icon, color }) => (
                    <Card key={label} className="bg-slate-900 border-slate-800 text-slate-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{label}</CardTitle>
                            <Icon className={`h-4 w-4 ${color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{value}</div>
                            <p className="text-xs text-slate-400">{sub}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
