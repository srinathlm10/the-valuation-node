import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import {
  Menu, Search, User, LogOut, Settings, LayoutDashboard, Bell,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Research", href: "/research" },
  { label: "Learn", href: "/learn" },
  { label: "Tools", href: "/tools" },
  { label: "Markets", href: "/markets" },
  { label: "About", href: "/about" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    toast({ title: "You have been signed out." });
    navigate("/");
  };

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Wordmark */}
        <Link to="/" className="shrink-0 flex items-center gap-2 group">
          <img
            src="/logo.png"
            alt="The Valuation Node"
            className="h-9 w-9 object-contain"
          />
          <span className="font-bold text-foreground tracking-tight text-lg">
            The Valuation Node
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-colors",
                isActive(item.href)
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <ThemeToggle />

          {/* Search icon */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Subscribe button (desktop) */}
          <Button size="sm" asChild className="hidden md:inline-flex rounded-full px-5">
            <a href="#newsletter">Subscribe</a>
          </Button>

          {/* Authenticated user menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-9 w-9 border-border/60"
                  aria-label="User menu"
                >
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl">
                <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                  <Link to="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="rounded-full">
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-6">
              <SheetTitle className="text-left font-bold mb-6 flex items-center gap-2">
                <img src="/logo.png" alt="" className="h-8 w-8 object-contain" aria-hidden="true" />
                The Valuation Node
              </SheetTitle>
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      to={item.href}
                      className={cn(
                        "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                <div className="my-2 h-px bg-border" />
                <SheetClose asChild>
                  <a
                    href="#newsletter"
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    Subscribe
                  </a>
                </SheetClose>
                {user ? (
                  <>
                    <SheetClose asChild>
                      <Link
                        to="/dashboard"
                        className="px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-2"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/settings"
                        className="px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </SheetClose>
                    <button
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      className="px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 text-left flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <SheetClose asChild>
                    <Link
                      to="/login"
                      className="px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      Sign in
                    </Link>
                  </SheetClose>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search bar (collapsible) */}
      {searchOpen && (
        <div className="border-t px-4 py-3 bg-background">
          <GlobalSearch />
        </div>
      )}
    </header>
  );
}
