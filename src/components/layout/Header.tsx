import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import {
  Menu, Bot, User, LogOut, ChevronDown, Settings,
  BookOpen, BarChart3, LineChart, Calculator, TrendingUp,
  Users, FileText, Globe, LayoutDashboard
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href?: string;
  items?: { label: string; href: string; icon: React.ElementType }[];
}

const navItems: NavItem[] = [
  {
    label: "Learn",
    items: [
      { label: "Financial Wiki", href: "/learn", icon: BookOpen },
      { label: "Basics of Stock Market", href: "/learn/basics", icon: TrendingUp },
      { label: "Fundamental Analysis", href: "/learn/fundamental-analysis", icon: BarChart3 },
      { label: "Technical Analysis", href: "/learn/technical-analysis", icon: LineChart },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "Calculators", href: "/calculators", icon: Calculator },
      { label: "Stock Market", href: "/stocks", icon: TrendingUp },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Community", href: "/community", icon: Users },
      { label: "Compliance & Regulations", href: "/compliance", icon: FileText },
      { label: "Investment Migration", href: "/migration", icon: Globe },
    ],
  },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    }
  };

  const isActive = (item: NavItem) => {
    if (item.href) {
      return location.pathname === item.href;
    }
    if (item.items) {
      return item.items.some((subItem) => location.pathname === subItem.href);
    }
    return false;
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-border shadow-sm supports-[backdrop-filter]:bg-background/60"
          : "bg-background/95 border-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-navy shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">FinBot</span>
            <span className="text-xl font-medium text-slate-500 ml-1">India</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.items ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 outline-none select-none",
                      isActive(item)
                        ? "bg-primary/10 text-primary hover:bg-primary/15"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-56 p-2 rounded-xl shadow-xl border-border/50 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
                    {item.items.map((subItem) => (
                      <DropdownMenuItem key={subItem.href} asChild className="rounded-lg cursor-pointer">
                        <Link
                          to={subItem.href}
                          className={cn(
                            "flex items-center gap-3 w-full p-2.5",
                            location.pathname === subItem.href && "bg-accent/50 text-accent-foreground"
                          )}
                        >
                          <div className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-md",
                            location.pathname === subItem.href ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                          )}>
                            <subItem.icon className="h-4 w-4" />
                          </div>
                          <span className="font-medium">{subItem.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  to={item.href!}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                    location.pathname === item.href
                      ? "bg-primary/10 text-primary hover:bg-primary/15"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Global Search */}
        <div className="hidden md:block flex-1 max-w-sm mx-4">
          <GlobalSearch />
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 lg:flex shrink-0">
          {user ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="rounded-full">
                <Link to="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-border/60 hover:bg-accent/50">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl">
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link to="/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="rounded-full hover:bg-muted/60">
                <Link to="/login">Log In</Link>
              </Button>
              <Button size="sm" asChild className="rounded-full px-5 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[350px] p-6">
            <SheetTitle className="text-left flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-navy">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">Menu</span>
            </SheetTitle>
            <nav className="flex flex-col gap-6">
              {navItems.map((item) => (
                <div key={item.label} className="flex flex-col gap-3">
                  {item.items ? (
                    <>
                      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">
                        {item.label}
                      </div>
                      <div className="flex flex-col gap-1">
                        {item.items.map((subItem) => (
                          <SheetClose asChild key={subItem.href}>
                            <Link
                              to={subItem.href}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border border-transparent",
                                location.pathname === subItem.href
                                  ? "bg-primary/5 text-primary border-primary/10"
                                  : "text-foreground/80 hover:bg-muted hover:text-foreground"
                              )}
                            >
                              <div className={cn(
                                "flex items-center justify-center w-6 h-6 rounded",
                                location.pathname === subItem.href ? "text-primary" : "text-muted-foreground"
                              )}>
                                <subItem.icon className="h-4 w-4" />
                              </div>
                              {subItem.label}
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    </>
                  ) : (
                    <SheetClose asChild key={item.href}>
                      <Link
                        to={item.href!}
                        className={cn(
                          "text-lg font-medium px-2 py-1",
                          location.pathname === item.href ? "text-primary" : "text-foreground"
                        )}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  )}
                </div>
              ))}

              <div className="my-2 h-px bg-border/50" />

              {user ? (
                <div className="flex flex-col gap-2">
                  <SheetClose asChild>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </SheetClose>
                  <Button variant="outline" className="w-full justify-start gap-3 mt-2 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive" onClick={() => { handleLogout(); setIsOpen(false); }}>
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" asChild className="rounded-xl">
                    <SheetClose asChild>
                      <Link to="/login">Log In</Link>
                    </SheetClose>
                  </Button>
                  <Button asChild className="rounded-xl gradient-navy">
                    <SheetClose asChild>
                      <Link to="/signup">Get Started</Link>
                    </SheetClose>
                  </Button>
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
