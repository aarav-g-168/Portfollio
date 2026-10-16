# Portfolio preview

Development happens on `codex/portfolio-preview`. Keep Cloudflare's production build connected to `main`; do not deploy this branch to the `portfolio` Worker.

## Local development

Run `npm run dev` and open `/preview` to work on the conventional portfolio. `/` and `/desktop` still open MacFolio. `/resume` still serves only the PDF.

## Separate preview deployment

Run `npm run build:preview`, then `npx wrangler deploy --config wrangler.preview.jsonc` when ready to publish a preview. This targets the separate `portfolio-preview` Worker with a workers.dev URL, with no custom domain or production routes. Its homepage opens the conventional portfolio; `/desktop` opens MacFolio.

The preview Worker needs its own `LASTFM_API_KEY` secret for music. Production secrets are not copied. Contact submissions still use the real email destination, so do not send test messages without intending to send an email.

Normal production builds use `npm run build` and the existing `wrangler.jsonc`; their homepage stays MacFolio. Preview builds go to `dist-preview/`, while production builds go to `dist/`, so preview assets never replace the production output.

## Creative portfolio

The preview has an editorial hero, three stacking project sheets with inline build inspectors and direct case-study/live/source links, a tabbed experience field notebook for internship and leadership, a cable-driven skills patchboard, a tactile build machine with printed receipts, section navigation, and a working postcard-style contact form.

The desktop showroom lazy-loads a lightweight original laptop model. Scroll only over the laptop itself to rotate and approach the display. Backward scrolling reverses progress; arrow keys provide the same interaction, Escape resets, and Enter directly bypasses animation. The final transition expands only the screen, then opens `/desktop?from=preview`. Back to portfolio is shown only for this preview entry; the ordinary MacFolio homepage has no exit button.

Touch devices and screens under 1024px show a static MacFolio preview without an entry button. Reduced-motion desktop users get direct entry without the scroll interaction. All professional content is available without entering MacFolio.

Regenerate the original GLB with `node scripts/create-preview-laptop.mjs` if needed. It uses no external model. The display texture is an actual MacFolio screenshot.

## SEO and release checks

Both portfolio build modes pre-render the homepage and three project pages into full HTML. Each page has its own metadata and structured data, with responsive images and local licensed fonts. Unknown paths return a real 404. Preview pages intentionally carry `noindex`.

For an indexable local release audit, run `npm run build:portfolio`, `npm run check:seo`, and `npm run serve:portfolio`. This writes `dist-portfolio/` separately and does not publish it. Run `npm run check:seo:preview` after `npm run build:preview` to verify staging metadata. The SEO requirements and measured results are in `docs/SEO-REQUIREMENTS.md` and `docs/SEO-AUDIT.md`.
