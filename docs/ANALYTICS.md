# Analytics Events — The Valuation Node

All events are tracked via Umami (`umami.track()`).
Umami setup: add the script to `index.html` once Umami is deployed.
Replace `YOUR_UMAMI_URL` and `YOUR_WEBSITE_ID` in `index.html`.

## Standard Events (auto-tracked by Umami)

| Event | Trigger |
|-------|---------|
| Pageview | Every page navigation |

## Custom Events

| Event name | Fired from | Props |
|------------|-----------|-------|
| `Newsletter Signup` | `NewsletterSignup.tsx` on successful POST | — |
| `Model Download` | `ResearchArticle.tsx` on download button click | `{ article_slug: string }` |
| `Article Read Complete` | `ResearchArticle.tsx` on 90% scroll | `{ article_slug: string }` |
| `Foundations Page Read Complete` | `FoundationsLeaf.tsx` on 90% scroll | `{ section: string, topic: string }` |
| `Tool Used` | `ToolPage.tsx` on calculator interaction | `{ tool_name: string }` |
| `Glossary Term Viewed` | `GlossaryEntry.tsx` on mount | `{ term_slug: string }` |
| `Learn-by-Doing Module Started` | `LearnByDoingModule.tsx` on start | `{ module_slug: string }` |
| `Learn-by-Doing Module Completed` | `LearnByDoingModule.tsx` on completion | `{ module_slug: string }` |
| `Auth Error` | `AuthCallback.tsx` on error | `{ message: string }` |

## Implementation note

Events are fired with:

```ts
if (typeof (window as any).umami !== "undefined") {
  (window as any).umami.track("Event Name", { ...props });
}
```

The guard prevents errors when Umami is not loaded (e.g., ad blockers, localhost without Umami).
