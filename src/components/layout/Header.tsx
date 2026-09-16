import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LayoutDashboard, LogOut, Menu, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { SearchOverlay } from "@/components/search/GlobalSearch";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SECTIONS, type Section } from "@/lib/taxonomy";
import { landingHasContent } from "@/lib/contentIndex";
import { paths } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * StickyNav, built from the prototype's <nav>: deep-navy bar, sticky, soft
 * shadow; logo on the left linking to /, the four content sections as
 * dropdown menus, About and the search icon on the right. The current
 * section is highlighted. On the home page the logo is not a live link.
 * Below lg the section links collapse into a hamburger sheet; the search
 * icon stays in the bar. Dropdowns are Radix NavigationMenu (keyboard and
 * screen-reader accessible). Sub-sections with no content are hidden.
 */

const CONTENT_SECTIONS = SECTIONS.filter((s) => s.inNav && s.id !== "about");
const ABOUT = SECTIONS.find((s) => s.id === "about")!;

/** Menu entries for a section: its live sub-sections, or the four Vault areas. */
function menuEntries(section: Section): { label: string; href: string; description: string }[] {
  if (section.id === "vault") {
    return section.subsections.map((s) => ({ label: s.label, href: `${section.path}/${s.id}`, description: s.description }));
  }
  return section.subsections
    .filter((s) => landingHasContent(section.id, s.id))
    .map((s) => ({ label: s.label, href: `${section.path}/${s.id}`, description: s.description }));
}

function Logo({ isHome }: { isHome: boolean }) {
  const inner = (
    <>
      <img src="/logo.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" aria-hidden="true" />
      {/* Navy bar in both themes, so the off-white wordmark is always the right one. */}
      <img src="/logo-wordmark-dark.png" alt="The Valuation Node" width={173} height={26} className="h-[26px] w-auto" />
    </>
  );
  const cls = "flex shrink-0 items-center gap-2";
  return isHome ? (
    <span id="tour-logo" className={cls} aria-current="page">
      {inner}
    </span>
  ) : (
    <Link id="tour-logo" to="/" className={cls} aria-label="The Valuation Node, home">
      {inner}
    </Link>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const isHome = location.pathname === "/";

  const handleLogout = async () => {
    await signOut();
    toast({ title: "You have been signed out." });
    navigate("/");
  };

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + "/");

  const linkBase = "text-[0.95rem] font-medium transition-colors";
  const linkIdle = "text-[#d1d5db] hover:text-white";
  const linkActive = "text-white";

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-navy text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo isHome={isHome} />

        {/* Desktop: the four content sections as dropdowns */}
        <NavigationMenu id="tour-nav" className="hidden lg:flex" aria-label="Primary">
          <NavigationMenuList className="gap-2">
            {CONTENT_SECTIONS.map((section) => {
              const entries = menuEntries(section);
              const active = isActive(section.path);
              return (
                <NavigationMenuItem key={section.id} id={section.id === "vault" ? "tour-vault" : undefined}>
                  <NavigationMenuTrigger
                    className={cn(
                      "h-9 bg-transparent px-3 hover:bg-white/10 focus:bg-white/10 data-[state=open]:bg-white/10",
                      linkBase,
                      active ? linkActive : linkIdle,
                      "hover:text-white focus:text-white data-[state=open]:text-white"
                    )}
                    aria-current={active ? "true" : undefined}
                    onClick={(e) => {
                      // Click goes to the section landing; hover/keyboard opens the menu.
                      e.preventDefault();
                      navigate(section.path);
                    }}
                  >
                    {section.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[560px] p-4">
                      <NavigationMenuLink asChild>
                        <Link
                          to={section.path}
                          className="mb-3 block border-b border-border pb-3 text-sm font-semibold uppercase tracking-wider text-foreground hover:text-brand-green"
                        >
                          All {section.label}
                        </Link>
                      </NavigationMenuLink>
                      <ul className="grid gap-1 sm:grid-cols-2">
                        {entries.map((e) => (
                          <li key={e.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={e.href}
                                className="block rounded-md p-3 transition-colors hover:bg-accent focus:bg-accent"
                              >
                                <span className="block text-sm font-semibold text-foreground">{e.label}</span>
                                <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-muted-foreground">
                                  {e.description}
                                </span>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right: About, search, theme, account */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to={ABOUT.path}
            className={cn("hidden px-2 lg:inline-block", linkBase, isActive(ABOUT.path) ? linkActive : linkIdle)}
            aria-current={isActive(ABOUT.path) ? "page" : undefined}
          >
            {ABOUT.label}
          </Link>

          <span id="tour-search">
            <SearchOverlay variant="icon" />
          </span>

          <ThemeToggle className="text-[#d1d5db] hover:bg-white/10 hover:text-white" />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-[#d1d5db] hover:bg-white/10 hover:text-white" aria-label="Account menu">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-2">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login" className={cn("hidden px-2 lg:inline-block", linkBase, linkIdle)}>
              Sign in
            </Link>
          )}

          {/* Mobile: hamburger (search icon above stays visible in the bar) */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button id="tour-menu" variant="ghost" size="icon" className="text-[#d1d5db] hover:bg-white/10 hover:text-white lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] overflow-y-auto p-6">
              <SheetTitle className="mb-6 flex items-center gap-2 text-left font-bold">
                <img src="/logo.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" aria-hidden="true" />
                <img src="/logo-wordmark.png" alt="The Valuation Node" width={147} height={22} className="h-[22px] w-auto dark:hidden" />
                <img src="/logo-wordmark-dark.png" alt="The Valuation Node" width={147} height={22} className="hidden h-[22px] w-auto dark:block" />
              </SheetTitle>
              <nav aria-label="Mobile" className="flex flex-col gap-1">
                {CONTENT_SECTIONS.map((section) => (
                  <MobileSection key={section.id} section={section} active={isActive(section.path)} />
                ))}
                <SheetClose asChild>
                  <Link to={ABOUT.path} className={cn("rounded-md px-3 py-2 text-sm font-medium hover:bg-muted", isActive(ABOUT.path) && "bg-muted")}>
                    {ABOUT.label}
                  </Link>
                </SheetClose>
                <div className="my-3 border-t" />
                <SheetClose asChild>
                  <Link to={paths.archive()} className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted">Archive</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to={paths.tags()} className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted">Topics</Link>
                </SheetClose>
                <div className="my-3 border-t" />
                {user ? (
                  <>
                    <SheetClose asChild><Link to="/dashboard" className="rounded-md px-3 py-2 text-sm hover:bg-muted">Dashboard</Link></SheetClose>
                    <SheetClose asChild><Link to="/settings" className="rounded-md px-3 py-2 text-sm hover:bg-muted">Settings</Link></SheetClose>
                    <button onClick={() => { setIsOpen(false); handleLogout(); }} className="rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-muted">Sign out</button>
                  </>
                ) : (
                  <SheetClose asChild><Link to="/login" className="rounded-md px-3 py-2 text-sm hover:bg-muted">Sign in</Link></SheetClose>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function MobileSection({ section, active }: { section: Section; active: boolean }) {
  const [open, setOpen] = useState(active);
  const entries = menuEntries(section);
  return (
    <div>
      <div className="flex items-center">
        <SheetClose asChild>
          <Link to={section.path} className={cn("flex-1 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted", active && "bg-muted")}>
            {section.label}
          </Link>
        </SheetClose>
        {entries.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={`${open ? "Collapse" : "Expand"} ${section.label}`}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted"
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
          </button>
        )}
      </div>
      {open && entries.length > 0 && (
        <ul className="mb-1 ml-3 border-l pl-3">
          {entries.map((e) => (
            <li key={e.href}>
              <SheetClose asChild>
                <Link to={e.href} className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                  {e.label}
                </Link>
              </SheetClose>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
