import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, Bot, User, LogOut, ChevronDown, Settings } from "lucide-react";
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

interface NavItem {
  label: string;
  href?: string;
  items?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: "Learn",
    items: [
      { label: "Financial Wiki", href: "/learn" },
      { label: "Fundamental Analysis", href: "/learn/fundamental-analysis" },
      { label: "Technical Analysis", href: "/learn/technical-analysis" },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "Calculators", href: "/calculators" },
      { label: "Stock Market", href: "/stocks" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Community", href: "/community" },
      { label: "Compliance & Regulations", href: "/compliance" },
      { label: "Investment Migration", href: "/migration" }, // Added for easy access during dev
    ],
  },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

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
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-slate">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold text-foreground">FinBot</span>
            <span className="text-lg font-light text-muted-foreground ml-1">India</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.items ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors outline-none ${isActive(item)
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {item.items.map((subItem) => (
                      <DropdownMenuItem key={subItem.href} asChild>
                        <Link
                          to={subItem.href}
                          className={`w-full ${location.pathname === subItem.href ? "bg-accent" : ""
                            }`}
                        >
                          {subItem.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  to={item.href!}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${location.pathname === item.href
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Global Search */}
        <div className="hidden md:block flex-1 max-w-md">
          <GlobalSearch />
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-2 lg:flex shrink-0">
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <SheetTitle className="text-left">Menu</SheetTitle>
            <nav className="mt-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <div key={item.label} className="flex flex-col gap-2">
                  {item.items ? (
                    <>
                      <div className="text-lg font-medium text-foreground">
                        {item.label}
                      </div>
                      <div className="flex flex-col gap-2 pl-4 border-l-2 ml-1">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.href}
                            to={subItem.href}
                            onClick={() => setIsOpen(false)}
                            className={`text-base font-medium transition-colors ${location.pathname === subItem.href
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                              }`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.href!}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium transition-colors ${location.pathname === item.href
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="my-4 h-px bg-border" />
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-muted-foreground hover:text-foreground"
                  >
                    Dashboard
                  </Link>
                  <Button variant="outline" onClick={() => { handleLogout(); setIsOpen(false); }}>
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-muted-foreground hover:text-foreground"
                  >
                    Log In
                  </Link>
                  <Button asChild>
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
