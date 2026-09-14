import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Scrolls to the top of the page whenever the route changes via a client-side
 * navigation (a <Link> click or navigate() call), so following a Related
 * Topic, a Continue Reading card, a breadcrumb, or a nav link always lands
 * the reader at the top of the new page rather than wherever the previous
 * page happened to be scrolled to.
 *
 * Back/forward browser navigation (POP) is deliberately left alone so the
 * browser's native scroll restoration can put the reader back where they
 * were on that page.
 *
 * Renders nothing; mount once near the root, inside the router.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [pathname, navigationType]);

  return null;
}
