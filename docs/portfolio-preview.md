# Portfolio preview

Development happens on `codex/portfolio-preview`. The main portfolio is now ready to replace the MacFolio homepage. Merge this branch into Cloudflare's production branch when publishing.

## Local development

Run `npm run dev` and open `/` for the main portfolio. `/preview` remains a development alias. `/desktop` opens MacFolio with a return link; `/resume` still serves only the PDF.

## Separate preview deployment

Run `npm run build:preview`, then `npx wrangler deploy --config wrangler.preview.jsonc` when ready to publish a preview. This targets the separate `portfolio-preview` Worker with a workers.dev URL, with no custom domain or production routes. Its homepage opens the conventional portfolio; `/desktop` opens MacFolio.

The preview Worker needs its own `LASTFM_API_KEY` secret for music. Production secrets are not copied. Contact submissions still use the real email destination, so do not send test messages without intending to send an email.

Production builds use `npm run build` and `wrangler.jsonc`; `/` opens the main portfolio, `/projects/.../` opens case studies, and `/desktop/` opens MacFolio. Production output goes to `dist/`; preview builds stay separate in `dist-preview/`. Keep the Cloudflare build command `npm run build` and deploy command `npx wrangler deploy`.

## Creative portfolio

The preview has an editorial hero, a dimensional project turntable with a tuning dial, direct case-study/live/source links, and draggable internship/leadership role passes with spring-loaded SVG straps, a cable-driven skills patchboard, section navigation, and a working postcard-style contact form.

The portfolio and case-study pages use Lenis for gentle wheel easing and section-link transitions inside their own scroll container. Touch scrolling, keyboard scrolling, form controls and browser zoom retain native behavior. Reduced-motion preferences disable the smoothing, including when changed during a visit. Anchor links preserve URL history and move focus to the destination. Returning from MacFolio restores the previous position immediately.

The desktop showroom lazy-loads a lightweight original laptop model. Scroll only over the laptop itself to rotate and approach the display. Backward scrolling reverses progress; arrow keys provide the same interaction, Escape resets, and Enter directly bypasses animation. The final transition expands only the screen, then opens `/desktop`. Back to portfolio is available for both direct visits and laptop entry, returning to `/#desktop-preview` with scroll position restored.

Touch devices and screens under 1024px show a static MacFolio preview without an entry button. Reduced-motion desktop users get direct entry without the scroll interaction. All professional content is available without entering MacFolio.

Regenerate the original GLB with `node scripts/create-preview-laptop.mjs` if needed. It uses no external model. The display texture is an actual MacFolio screenshot.

Project case studies include a compact, pre-rendered Engineering decisions section with the problem, implementation choice, and trade-off. The homepage does not include a separate generic development-workflow section. Trade-offs describe implications of the documented architecture, without invented metrics or claims about alternatives considered.

## SEO and release checks

Both portfolio build modes pre-render the homepage and three project pages into full HTML. Each page has its own metadata and structured data, with responsive images and local licensed fonts. Unknown paths return a real 404. Preview pages intentionally carry `noindex`.

For an indexable local release audit, run `npm run build:portfolio`, `npm run check:seo`, and `npm run serve:portfolio`. This writes `dist-portfolio/` separately and does not publish it. Run `npm run check:seo:preview` after `npm run build:preview` to verify staging metadata. The SEO requirements and measured results are in `docs/SEO-REQUIREMENTS.md` and `docs/SEO-AUDIT.md`.

## Skills content

The preview skills list lives in `src/data/portfolio-skills.js`, independently of the published desktop list. It covers the résumé’s languages, web/mobile, backend/API, database/ORM, authentication, UI/animation, cloud/tooling and CS fundamentals, plus previously confirmed skills. All eight categories are pre-rendered; category buttons control visibility. Mobile uses a two-column category selector above the full-width skill list. The desktop cable height follows the category count.
