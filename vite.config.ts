/// <reference types="vite-react-ssg" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Routes that should NOT be statically prerendered (auth-gated, admin, or
// otherwise SEO-irrelevant). Everything else, home, research (incl. the
// per-article pages via getStaticPaths), learn, tools, markets, about, is
// prerendered to static HTML with baked meta tags.
const NO_PRERENDER_EXACT = new Set([
  "/login",
  "/signup",
  "/admin-login",
  "/auth/callback",
  "/forgot-password",
  "/reset-password",
  "/dashboard",
  "/settings",
  "/migration",
]);
const NO_PRERENDER_PREFIX = ["/admin", "/community"];

// https://vitejs.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => ({
  ssgOptions: {
    // Prerender to per-route directories (…/research/slug/index.html).
    dirStyle: "nested",
    includedRoutes(paths: string[]) {
      return paths.filter((raw) => {
        const p = raw.startsWith("/") ? raw : `/${raw}`; // normalise leading slash
        return (
          !NO_PRERENDER_EXACT.has(p) &&
          !NO_PRERENDER_PREFIX.some((pre) => p === pre || p.startsWith(pre + "/"))
        );
      });
    },
  },
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // manualChunks only applies to the client build. During the SSR/SSG
        // build vite-react-ssg externalizes react/react-dom, which cannot be
        // placed into a manual chunk.
        manualChunks: isSsrBuild
          ? undefined
          : {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["@radix-ui/react-accordion", "@radix-ui/react-alert-dialog", "@radix-ui/react-aspect-ratio",
            "@radix-ui/react-avatar", "@radix-ui/react-checkbox", "@radix-ui/react-collapsible",
            "@radix-ui/react-context-menu", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-hover-card", "@radix-ui/react-label", "@radix-ui/react-menubar",
            "@radix-ui/react-navigation-menu", "@radix-ui/react-popover", "@radix-ui/react-progress",
            "@radix-ui/react-radio-group", "@radix-ui/react-scroll-area", "@radix-ui/react-select",
            "@radix-ui/react-separator", "@radix-ui/react-slider", "@radix-ui/react-slot",
            "@radix-ui/react-switch", "@radix-ui/react-tabs", "@radix-ui/react-toast",
            "@radix-ui/react-toggle", "@radix-ui/react-toggle-group", "@radix-ui/react-tooltip",
            "lucide-react", "class-variance-authority", "clsx", "tailwind-merge"],
          "vendor-utils": ["recharts", "date-fns", "zod", "react-hook-form", "@tanstack/react-query"],
          "vendor-supabase": ["@supabase/supabase-js"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
}));
