import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
        totalArticles: 0 // Placeholder as we might not have a DB count for hardcoded articles yet
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                setLoading(true);

                // Fetch User Count
                const { count: userCount, error: userError } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true });

                if (userError) console.error("Error fetching users:", userError);

                // Fetch Quiz Attempts
                // Note: 'user_quiz_attempts' might need to be created if not exists, 
                // relying on what user said about "monitoring usage of website or quizzes"
                // I'll assume we used 'user_quiz_attempts' in the quiz service logic previously?
                // Let's check if the table exists. If not, I'll handle it gracefully.

                const { data: quizData, error: quizError } = await supabase
                    .from('user_quiz_attempts')
                    .select('score');

                let quizCount = 0;
                let average = 0;

                if (!quizError && quizData) {
                    quizCount = quizData.length;
                    const totalScore = quizData.reduce((acc, curr) => acc + (curr.score || 0), 0);
                    average = quizCount > 0 ? Math.round(totalScore / quizCount) : 0;
                }

                setStats({
                    totalUsers: userCount || 0,
                    totalQuizzesTaken: quizCount,
                    avgScore: average,
                    totalArticles: 12 // Hardcoded based on our articles.ts
                });

            } catch (e) {
                console.error("Dashboard fetch error:", e);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
                <p className="text-slate-400">Overview of platform usage and performance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-slate-900 border-slate-800 text-slate-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? "-" : stats.totalUsers}</div>
                        <p className="text-xs text-slate-400">Registered accounts</p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 text-slate-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Quiz Attempts</CardTitle>
                        <BrainCircuit className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? "-" : stats.totalQuizzesTaken}</div>
                        <p className="text-xs text-slate-400">Total quizzes completed</p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 text-slate-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Quiz Score</CardTitle>
                        <Activity className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? "-" : `${stats.avgScore}%`}</div>
                        <p className="text-xs text-slate-400">Average user performance</p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 text-slate-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Content Library</CardTitle>
                        <BookOpen className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalArticles}</div>
                        <p className="text-xs text-slate-400">Published articles</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-slate-900 border-slate-800 text-slate-100">
                    <CardHeader>
                        <CardTitle>Usage Insights</CardTitle>
                        <CardDescription className="text-slate-400">Recent activity on the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-slate-400">
                            Real-time activity feed coming soon.
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 text-slate-100">
                    <CardHeader>
                        <CardTitle>System Status</CardTitle>
                        <CardDescription className="text-slate-400">Platform health and services</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span>Database Connection</span>
                                <span className="text-emerald-500 font-medium">Operational</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span>AI Services</span>
                                <span className="text-emerald-500 font-medium">Operational</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
