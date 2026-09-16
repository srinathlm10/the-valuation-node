# Alt text and images to review

Generated 2026-09-16 during Phase 3, Step 6. A scan of all 400 prerendered pages found
**0 `<img>` elements without an `alt` attribute** and 0 without explicit width and height.
Nothing is blocking. The items below are judgement calls for the owner.

## Decorative images (alt="" on purpose)

| Where | Image | Why decorative |
|---|---|---|
| Header, footer, mobile menu | `/logo.png` (the mark) | The wordmark image next to it carries the accessible name "The Valuation Node" |
| ArticleCard placeholder | `/logo.png` watermark on the gradient | Purely visual; the card headline is the link text |

## Images that carry text (alt should match the words)

| Where | Image | Current alt |
|---|---|---|
| Header, footer, mobile menu | `/logo-wordmark.png`, `/logo-wordmark-dark.png` | "The Valuation Node" (correct) |

## Missing images (not alt problems, but visible gaps)

1. **Article featured images.** Every research piece uses the site-wide `/og-image.png`,
   so cards show the gradient placeholder and social shares show the generic image. Adding a
   `featuredImage` and `imageAlt` to a research file's front-matter is enough; the card,
   the Open Graph tags, and the Article schema all read from it. Write the alt as a plain
   description of what is in the picture, not the article title.
2. **Author photo.** `src/pages/AboutAuthor.tsx` still has `AUTHOR_PHOTO = null` and shows
   the "SG" placeholder. The `<img>` already has descriptive alt text ready for when a file is
   supplied. Preferred: a square JPEG or WebP, at least 400 px.

## Format note

No raster content images exist yet, so there was nothing to convert to WebP. The brand
assets are PNG because they need transparency and are small (the mark is 98 KB, the
wordmarks 38 to 85 KB). If featured images are added, prefer WebP at 1200 x 675 (16:9) to
match the card box.
