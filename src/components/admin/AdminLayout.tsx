import { Link, Outlet, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    FileText,
    Database,
    ArrowLeft,
    Settings,
    Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function AdminLayout() {
    const location = useLocation();

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/content", label: "Content Manager", icon: FileText },
        { href: "/admin/embeddings", label: "Embeddings", icon: Database },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-50">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 bg-slate-900/50 hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-2 font-bold text-xl text-emerald-400">
                        <LayoutDashboard className="h-6 w-6" />
                        <span>Admin Panel</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link key={item.href} to={item.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-3",
                                        isActive
                                            ? "bg-slate-800 text-white"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Link to="/dashboard">
                        <Button variant="outline" className="w-full gap-2 border-slate-700 bg-transparent text-slate-300 hover:text-white hover:bg-slate-800">
                            <ArrowLeft className="h-4 w-4" />
                            Back to App
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="h-16 border-b border-slate-800 flex items-center px-8 bg-slate-900/20 backdrop-blur">
                    <h1 className="text-lg font-medium text-slate-200">
                        {navItems.find(i => i.href === location.pathname)?.label || "Admin"}
                    </h1>
                </header>
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
