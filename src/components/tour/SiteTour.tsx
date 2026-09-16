import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import "./tour.css";

/**
 * Four-step site tour (driver.js). Fires only on the home page, only on a
 * first visit (localStorage flag), after a 2 second delay. "Skip" is visible
 * on every step; Escape and an overlay click both count as skip and set the
 * flag permanently. Focus is trapped inside the tour card while it is open
 * and returned to the previously focused element on close. Below the lg
 * breakpoint the steps render as a bottom sheet instead of anchored
 * tooltips (see tour.css), because the desktop nav elements are hidden.
 *
 * The footer's "Take the site tour" link goes to /?tour=1, which restarts the
 * tour regardless of the flag.
 */

const STORAGE_KEY = "tvn.tour.v1";
const DELAY_MS = 2000;
const MOBILE_QUERY = "(max-width: 1023px)";

function hasSeen(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "done";
  } catch {
    return true; // storage unavailable: never nag
  }
}

function markSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, "done");
  } catch {
    /* ignore */
  }
}

function steps(mobile: boolean): DriveStep[] {
  // On mobile the desktop nav is not in the DOM, so steps anchor to what is
  // visible (the menu button) or float as a bottom sheet with no element.
  const nav = mobile ? "#tour-menu" : "#tour-nav";
  return [
    {
      element: "#tour-logo",
      popover: {
        title: "The Valuation Node",
        description: "The logo always brings you back to the home page: the latest analysis, what changed this week, and where to start.",
      },
    },
    {
      element: nav,
      popover: {
        title: mobile ? "The menu" : "Four sections",
        description:
          "News & Trends for what is moving markets, Insights & Analysis for original research, ESG & Sustainability for green finance and governance, and The Vault for the reference library." +
          (mobile ? " Open the menu to browse each section and its topics." : " Hover a section to see its topics."),
      },
    },
    {
      element: mobile ? undefined : "#tour-vault",
      popover: {
        title: "The Vault",
        description:
          "Every definition, formula, concept guide, and calculator on the site lives here: 178 glossary terms, 49 ratios with formulas, 51 guides in nine tracks, and 18 interactive tools.",
      },
    },
    {
      element: "#tour-search",
      popover: {
        title: "Search",
        description: "The magnifier searches everything at once, with glossary and formula matches first. Ctrl+K or Cmd+K opens it from any page.",
      },
    },
  ];
}

export function SiteTour() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== "/") return;
    const forced = new URLSearchParams(location.search).get("tour") === "1";
    if (!forced && hasSeen()) return;

    let instance: ReturnType<typeof driver> | null = null;
    let restoreFocus: HTMLElement | null = null;
    let trapHandler: ((e: KeyboardEvent) => void) | null = null;

    const timer = window.setTimeout(() => {
      const mobile = window.matchMedia(MOBILE_QUERY).matches;
      restoreFocus = document.activeElement as HTMLElement | null;

      const finish = () => {
        markSeen();
        if (trapHandler) document.removeEventListener("keydown", trapHandler, true);
        if (forced) navigate("/", { replace: true });
        restoreFocus?.focus?.();
      };

      instance = driver({
        showProgress: true,
        allowClose: true, // overlay click and Escape close the tour
        overlayClickBehavior: "close",
        popoverClass: mobile ? "tvn-tour tvn-tour-sheet" : "tvn-tour",
        showButtons: ["next", "previous", "close"],
        nextBtnText: "Next",
        prevBtnText: "Back",
        doneBtnText: "Done",
        progressText: "{{current}} of {{total}}",
        stagePadding: 6,
        stageRadius: 6,
        onDestroyed: finish,
        onPopoverRender: (popover) => {
          // Skip is always visible: relabel the close control and move it into the footer.
          popover.closeButton.textContent = "Skip tour";
          popover.closeButton.setAttribute("aria-label", "Skip the tour");
          popover.footerButtons.prepend(popover.closeButton);
          // Focus trap inside the card
          const focusables = () =>
            Array.from(popover.wrapper.querySelectorAll<HTMLElement>("button, [href], [tabindex]:not([tabindex='-1'])")).filter(
              (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
            );
          if (trapHandler) document.removeEventListener("keydown", trapHandler, true);
          trapHandler = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;
            const list = focusables();
            if (list.length === 0) return;
            const first = list[0], last = list[list.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            } else if (!popover.wrapper.contains(document.activeElement)) {
              e.preventDefault();
              first.focus();
            }
          };
          document.addEventListener("keydown", trapHandler, true);
          window.setTimeout(() => (popover.nextButton as HTMLElement).focus(), 0);
        },
        steps: steps(mobile),
      });
      instance.drive();
    }, DELAY_MS);

    return () => {
      window.clearTimeout(timer);
      if (trapHandler) document.removeEventListener("keydown", trapHandler, true);
      if (instance?.isActive()) instance.destroy();
    };
  }, [location.pathname, location.search, navigate]);

  return null;
}
