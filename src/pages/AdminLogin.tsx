import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldAlert } from "lucide-react";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Check if user is admin
            if (data.session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', data.session.user.id)
                    .single();

                if ((profile as any)?.role !== 'admin') {
                    // Sign out if not admin
                    await supabase.auth.signOut();
                    throw new Error("Access denied. Admin privileges required.");
                }

                toast({
                    title: "Admin Access Granted",
                    description: "Welcome to the command center.",
                });

                navigate("/admin");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast({
                title: "Access Denied",
                description: error instanceof Error ? error.message : "Invalid credentials",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container flex min-h-[calc(100vh-16rem)] items-center justify-center py-12">
                <Card className="w-full max-w-md border-red-500/20 shadow-lg bg-red-50/5 dark:bg-red-900/5">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-red-100 dark:bg-red-900/20 p-3 rounded-full w-fit mb-4">
                            <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold font-display text-red-700 dark:text-red-400">
                            Admin Portal
                        </CardTitle>
                        <CardDescription>
                            Restricted access. Authorized personnel only.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Admin Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@finbot.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="border-red-200 focus-visible:ring-red-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="border-red-200 focus-visible:ring-red-500"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Authenticate
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
