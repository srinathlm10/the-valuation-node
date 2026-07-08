// Central chart styling for all recharts usage. Series colors are literal HSL
// values chosen to hold contrast on BOTH the light (warm paper) and dark (deep
// slate) backgrounds, since SVG presentation attributes cannot resolve CSS
// variables. Text and surfaces use CSS vars via inline styles, which DO resolve,
// so tooltips and axis labels adapt to the active theme automatically.

/** Brand teal for the primary data series. */
export const CHART_PRIMARY = "hsl(187, 55%, 42%)";

/** Amber for a second, contrasting series (comparisons). */
export const CHART_COMPARISON = "hsl(35, 85%, 55%)";

/** Neutral slate for reference/history series. */
export const CHART_NEUTRAL = "hsl(217, 12%, 58%)";

/** Muted fill for background bars (e.g. revenue behind profit). */
export const CHART_MUTED_FILL = "hsl(217, 14%, 74%)";

import type { CSSProperties } from "react";

/** Tooltip surface that follows the active theme. */
export const chartTooltipStyle: CSSProperties = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "0.5rem",
  color: "hsl(var(--foreground))",
  fontSize: "0.8125rem",
  boxShadow: "0 4px 10px -2px hsl(220 25% 15% / 0.12)",
};

/** Axis tick styling; "currentColor" inherits from a text-muted-foreground wrapper. */
export const chartTick = { fontSize: 11, fill: "currentColor" } as const;
