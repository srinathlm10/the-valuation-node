import { useCallback } from "react";

/**
 * Client-side spam guard shared by every comment form on the site (article
 * comments today; the community forum can adopt the same hook later instead
 * of duplicating this logic). Two checks, both best-effort:
 *
 *  - Honeypot: a form field real visitors never see or fill in. If it has a
 *    value, the submitter is almost certainly a bot; the caller should treat
 *    it as a silent success (no error shown) rather than reveal the trap.
 *  - Session rate limit: at most one comment per `cooldownMs` from this
 *    browser tab, tracked in sessionStorage so it resets per session and
 *    isn't tied to login state (applies to guests and logged-in users alike).
 *
 * Neither check is server-enforced: RLS allows any anonymous insert, so a
 * determined bot calling the API directly can bypass both. This is
 * reasonable friction against casual spam, not a security boundary. A
 * server-side check would need a Supabase edge function (the project already
 * has two, supabase/functions/chat and generate-embeddings, so the
 * infrastructure exists if this ever needs to move server-side).
 */

const STORAGE_PREFIX = "vn:lastCommentAt:";

export function useCommentRateLimit(scope: string, cooldownMs = 30_000) {
  const key = STORAGE_PREFIX + scope;

  const secondsRemaining = useCallback((): number => {
    try {
      const last = Number(sessionStorage.getItem(key) ?? 0);
      const elapsed = Date.now() - last;
      return elapsed >= cooldownMs ? 0 : Math.ceil((cooldownMs - elapsed) / 1000);
    } catch {
      // Private browsing or blocked storage: fail open, don't block posting.
      return 0;
    }
  }, [key, cooldownMs]);

  const recordSubmission = useCallback(() => {
    try {
      sessionStorage.setItem(key, String(Date.now()));
    } catch {
      // Ignore; the rate limit just won't persist this one time.
    }
  }, [key]);

  return { secondsRemaining, recordSubmission };
}

/** True if a honeypot field was filled in (real visitors leave it empty). */
export function isHoneypotTripped(value: string): boolean {
  return value.trim().length > 0;
}
