# Auth Testing Checklist — The Valuation Node

## Pre-test setup

1. Apply migrations:
   - `supabase/migrations/20260624_001_research_article_fields.sql`
   - `supabase/migrations/20260624_002_rls_policies.sql`
   - `supabase/migrations/20260624_003_profile_trigger.sql`
2. Confirm Supabase dashboard settings (see checklist below).

## Supabase Dashboard Settings to Verify Manually

- [ ] **Email confirmation:** Enabled (users must verify email before full access)
- [ ] **Password requirements:** Minimum 8 characters, at least one letter and one number
- [ ] **Email rate limiting:** Enabled
- [ ] **JWT expiry:** 1 hour for access tokens
- [ ] **Refresh token rotation:** Enabled
- [ ] **Refresh token reuse interval:** 10 seconds
- [ ] **Session timeout:** 7 days inactivity
- [ ] **OAuth providers:** Google, GitHub, LinkedIn — configured with:
  - Redirect URL for production: `https://thevaluationnode.com/auth/callback`
  - Redirect URL for development: `http://localhost:5173/auth/callback`
- [ ] **Site URL:** Set to `https://thevaluationnode.com`
- [ ] **Allowed redirect URLs:** Both production and localhost variants added

## Auth Flow Test Results

Mark each test as pass/fail/skip. Update after testing.

| Test | Status | Notes |
|------|--------|-------|
| Sign up with email/password → receives confirmation email → confirms → can log in | — | |
| Sign up with Google → profile row created → lands on dashboard | — | |
| Sign up with GitHub → profile row created → lands on dashboard | — | |
| Sign up with LinkedIn → profile row created → lands on dashboard | — | |
| Sign in with email/password → lands on dashboard | — | |
| Sign in with wrong password → clear error message, no redirect | — | |
| Sign in with unconfirmed email → "Email not confirmed" error | — | |
| Forgot password → email arrives → link works → password updated → can sign in | — | |
| Sign out → session cleared → /dashboard redirects to /login | — | |
| Access /dashboard while signed out → redirects to /login?next=/dashboard | — | |
| After login from /login?next=/dashboard → lands on /dashboard | — | |
| Non-admin user tries /admin/* → redirected to / | — | |
| Admin user accesses /admin → loads admin panel | — | |
| Session persists across page refresh | — | |
| Session persists across browser restart | — | |
| OAuth callback handles errors gracefully (user denies permission) | — | |
| RLS: User A cannot read User B's bookmarks or chat history | — | |

## Environment Variables Required in Production

```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
```

## OAuth Client ID / Secret Checklist

For each OAuth provider, set up in Supabase Dashboard → Authentication → Providers:

- [ ] Google: Client ID + Client Secret from Google Cloud Console
- [ ] GitHub: Client ID + Client Secret from GitHub OAuth App settings
- [ ] LinkedIn: Client ID + Client Secret from LinkedIn Developer Portal (use OIDC provider)

## RLS Policies Tightened (Potential Breakage)

The following changes in `20260624_002_rls_policies.sql` may break existing functionality:

1. `articles` — Only `status = 'published'` rows visible publicly. Draft articles no longer visible without admin session.
2. `profiles` — Users can only read/update their own profile. Code that reads another user's profile will fail. Admin-only reads are scoped to role='admin'.
3. `bookmarks`, `chat_sessions`, `chat_messages` — Only own rows accessible. Any admin view of these tables will need a separate admin policy.

Verify each of these in the Supabase dashboard after applying.
