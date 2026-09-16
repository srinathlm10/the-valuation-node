import { Navigate, useLocation } from "react-router-dom";
import { rewriteLegacyPath } from "@/lib/routes";

/**
 * Client-side counterpart of the 301 rules in public/_redirects. Mounted on
 * every legacy path family; computes the new path from the current location
 * (query and hash preserved) and replaces history so Back does not loop.
 * If a path is not actually legacy (should not happen), it falls through to 404.
 */
export function LegacyRedirect() {
  const { pathname, search, hash } = useLocation();
  const target = rewriteLegacyPath(`${pathname}${search}${hash}`);
  if (target === `${pathname}${search}${hash}`) return <Navigate to="/404" replace />;
  return <Navigate to={target} replace />;
}
