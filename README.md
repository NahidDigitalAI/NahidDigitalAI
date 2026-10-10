# NahidDigitalAI — Professional Portfolio Website

Brand: **NahidDigitalAI**  
Owner: **MD Nahid Hasan Sheikh**  
Focus: AI strategy, digital marketing, local SEO, Python automation, content and lead generation.

## Pages
- `index.html` — Home
- `ranking.html` — About
- `portfolio.html` — Portfolio / solution areas
- `blog.html` — Blog
- `admin.html` — Blog Studio
- `ai-strategy.html`
- `lead-generation.html`
- `automation.html`
- `content-solutions.html`
- `local-seo.html`
- `consulting.html`
- `free-audit.html`
- `gemini-code-1790428950524.html`
- `404.html`

## Easy blog management
Open `admin.html`.

Studio PIN: `NAHID2026`

You can:
- add a title
- choose a category/date
- add an image URL or upload a small image
- write an excerpt
- write full content
- edit posts
- delete posts
- preview posts
- export `blog-data.js`
- export/import JSON

### Publish a new article
1. Open `admin.html`.
2. Create/edit/delete the post.
3. Click **Export blog-data.js**.
4. Replace `assets/blog-data.js` in the project with the downloaded file.
5. Deploy/push the changed file to Vercel.

The browser editor is intentionally local-first because this project is a static site. It is not a secure multi-user CMS. The PIN is only a convenience lock, not authentication.

## Telegram
The current static version keeps the Telegram bot token in frontend JavaScript because the owner requested a working frontend-only integration. This exposes the token to visitors. For production, move the token to a Vercel serverless/API route and keep it in an environment variable.

## SEO
The site includes:
- unique page titles/descriptions
- canonical URLs
- Open Graph metadata
- JSON-LD structured data on core/service pages
- semantic headings
- internal links
- `robots.txt`
- `sitemap.xml`
- responsive/mobile UX
- lightweight shared CSS/JS

Ranking cannot be guaranteed. Search visibility depends on content quality, technical health, indexing, authority, competition and ongoing publishing.

## Production Telegram setup (recommended)
The project now includes `api/contact.js`. On Vercel, add these Environment Variables:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

The frontend tries `/api/contact` first and falls back to the existing frontend Telegram configuration so the static build remains usable. For production, keep the server-side variables configured and rotate any bot token that has ever been exposed publicly.

## Free Growth Audit
`free-audit.html` includes a lead form that posts to `/api/contact` with an `audit` type. The same Telegram notification channel can be used for audit requests.

## New production files
- `api/contact.js` — server-side Telegram delivery
- `.env.example` — environment variable template
- `privacy.html` — basic privacy information
- `site.webmanifest` — installable web app metadata
- `vercel.json` — security/cache headers and clean URLs

## Appearance personalization (updated)
- Visitors can choose Cyan Tech, Electric Violet, Lime Pop, Coral Sunset, or Digital Blue.
- Light/dark mode and the selected accent palette are saved in this browser with `localStorage`, so the preference remains on later visits and across site pages on the same device/browser.
- The Appearance panel includes an optional “Surprise me” action; the chosen palette is saved rather than changing randomly on every visit.
- Visitors can clear site data/browser storage to reset their saved preference. Preferences are device/browser-specific and are not synced between devices.

## Telegram contact security
- The browser code no longer contains the Telegram Bot Token or calls the Telegram Bot API directly.
- Configure `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` as Vercel Environment Variables for `/api/contact`.
- If a token was ever published in source code, revoke it in Telegram BotFather and use a new token.



## Rajshahi & Bangladesh local SEO content update
- Homepage and Local SEO page now emphasize Rajshahi, Bangladesh, and genuine service coverage.
- Added a user-provided Bangladesh city-street photo with descriptive alt text and responsive presentation.
- Keep every location claim accurate; do not create doorway/location pages for places you do not genuinely serve.
- No ranking position is guaranteed. Set up Google Search Console, submit `sitemap.xml`, inspect indexing, and measure queries and enquiries after deployment.
