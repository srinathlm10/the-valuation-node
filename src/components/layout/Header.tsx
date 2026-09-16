import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, Settings, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { SearchOverlay } from "@/components/search/GlobalSearch";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SECTIONS } from "@/lib/taxonomy";
import { paths } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * Navigation bar, the prototype's <nav> structure exactly
 * (src/styles/prototype.css supplies the rules):
 *
 *   <nav class="site-nav">
 *     <div class="nav-container">
 *       <a class="logo">…</a>
 *       <ul class="nav-links"> News & Trends | Insights & Analysis | ESG & Sustainability | The Vault </ul>
 *       <div class="nav-actions"> About | 🔍 </div>
 *     </div>
 *   </nav>
 *
 * Differences from the prototype, all deliberate: the logo slot holds the
 * site's real mark + wordmark instead of the "NITR Capital" text; the search
 * button opens the existing SearchOverlay; the theme toggle and account menu
 * sit in .nav-actions because the site has them; below 900px the .nav-links
 * are hidden (prototype) and a hamburger sheet takes over. Elements keep
 * their tour anchor ids.
 */

const CONTENT_SECTIONS = SECTIONS.filter((s) => s.inNav && s.id !== "about");
const ABOUT = SECTIONS.find((s) => s.id === "about")!;

const iconBtn = "search-btn h-10 w-10 rounded-full transition-colors hover:bg-white/10";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const isHome = location.pathname === "/";
  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + "/");

  const handleLogout = async () => {
    await signOut();
    toast({ title: "You have been signed out." });
    navigate("/");
  };

  const logoInner = (
    <>
      <img src="/logo-on-dark.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" aria-hidden="true" />
      <img src="/logo-wordmark-dark.png" alt="The Valuation Node" width={173} height={26} className="h-[26px] w-auto" />
    </>
  );

  return (
    <nav className="site-nav" aria-label="Primary">
      <div className="nav-container">
        {isHome ? (
          <span id="tour-logo" className="logo" aria-current="page">
            {logoInner}
          </span>
        ) : (
          <Link id="tour-logo" to="/" className="logo" aria-label="The Valuation Node, home">
            {logoInner}
          </Link>
        )}

        <ul id="tour-nav" className="nav-links">
          {CONTENT_SECTIONS.map((section) => (
            <li key={section.id} id={section.id === "vault" ? "tour-vault" : undefined}>
              <Link to={section.path} aria-current={isActive(section.path) ? "page" : undefined}>
                {section.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <Link to={ABOUT.path} className="nav-about hidden lg:inline" aria-current={isActive(ABOUT.path) ? "page" : undefined}>
            {ABOUT.label}
          </Link>

          <span id="tour-search" className="inline-flex">
            <SearchOverlay variant="icon" />
          </span>

          <ThemeToggle className={cn(iconBtn, "text-white")} />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className={iconBtn} aria-label="Account menu">
                  <User className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-2">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/dashboard" className="flex items-center gap-2"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/settings" className="flex items-center gap-2"><Settings className="h-4 w-4" /> Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login" className="nav-about hidden lg:inline">
              Sign in
            </Link>
          )}

          {/* Below 900px the prototype hides .nav-links; this sheet replaces them. */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button id="tour-menu" type="button" className={cn(iconBtn, "lg:hidden")} aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] overflow-y-auto bg-[var(--primary-dark)] p-6 text-white [&>button]:text-white">
              <SheetTitle className="mb-6 flex items-center gap-2 text-left">
                <img src="/logo-on-dark.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" aria-hidden="true" />
                <img src="/logo-wordmark-dark.png" alt="The Valuation Node" width={147} height={22} className="h-[22px] w-auto" />
              </SheetTitle>
              <ul className="flex flex-col gap-1" aria-label="Mobile">
                {[...CONTENT_SECTIONS, ABOUT].map((section) => (
                  <li key={section.id}>
                    <SheetClose asChild>
                      <Link
                        to={section.path}
                        className={cn("block px-3 py-2 text-[0.95rem] font-medium text-[var(--nav-link)] hover:text-white", isActive(section.path) && "text-white")}
                        aria-current={isActive(section.path) ? "page" : undefined}
                      >
                        {section.label}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
                <li className="my-3 border-t border-white/15" aria-hidden="true" />
                <li>
                  <SheetClose asChild>
                    <Link to={paths.archive()} className="block px-3 py-2 text-sm text-[var(--nav-link)] hover:text-white">Archive</Link>
                  </SheetClose>
                </li>
                <li>
                  <SheetClose asChild>
                    <Link to={paths.tags()} className="block px-3 py-2 text-sm text-[var(--nav-link)] hover:text-white">Topics</Link>
                  </SheetClose>
                </li>
                <li className="my-3 border-t border-white/15" aria-hidden="true" />
                {user ? (
                  <>
                    <li><SheetClose asChild><Link to="/dashboard" className="block px-3 py-2 text-sm text-[var(--nav-link)] hover:text-white">Dashboard</Link></SheetClose></li>
                    <li><SheetClose asChild><Link to="/settings" className="block px-3 py-2 text-sm text-[var(--nav-link)] hover:text-white">Settings</Link></SheetClose></li>
                    <li>
                      <button type="button" onClick={() => { setIsOpen(false); handleLogout(); }} className="block w-full px-3 py-2 text-left text-sm text-[var(--nav-link)] hover:text-white">
                        Sign out
                      </button>
                    </li>
                  </>
                ) : (
                  <li><SheetClose asChild><Link to="/login" className="block px-3 py-2 text-sm text-[var(--nav-link)] hover:text-white">Sign in</Link></SheetClose></li>
                )}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
