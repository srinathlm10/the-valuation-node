import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/**
 * Light/dark toggle. The two icons swap via CSS (dark:) rather than JS state,
 * so the prerendered HTML never mismatches during hydration; the inline script
 * in index.html applies the stored theme class before first paint.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark mode"
    >
      <Sun className="h-4 w-4 dark:hidden" />
      <Moon className="h-4 w-4 hidden dark:block" />
    </Button>
  );
}
