# Portfolio preview

Development happens on `codex/portfolio-preview`. Keep Cloudflare's production build connected to `main`; do not deploy this branch to the `portfolio` Worker.

## Local development

Run `npm run dev` and open `/preview` to work on the conventional portfolio. `/` and `/desktop` still open MacFolio. `/resume` still serves only the PDF.

## Separate preview deployment

Run `npm run build:preview`, then `npx wrangler deploy --config wrangler.preview.jsonc` when ready to publish a preview. This targets the separate `portfolio-preview` Worker with a workers.dev URL, with no custom domain or production routes. Its homepage opens the conventional portfolio; `/desktop` opens MacFolio.

The preview Worker needs its own `LASTFM_API_KEY` secret for music. Production secrets are not copied. Contact submissions still use the real email destination, so do not send test messages without intending to send an email.

Normal production builds use `npm run build` and the existing `wrangler.jsonc`; their homepage stays MacFolio. Preview builds go to `dist-preview/`, while production builds go to `dist/`, so preview assets never replace the production output.

## Creative portfolio

The preview has an editorial hero, project tabs with build-note dialogs, expandable experience entries, an interactive skills toolbench, and the shared contact form.

The desktop showroom lazy-loads a lightweight original laptop model. Scroll only over its stage to rotate and approach the display. Backward scrolling reverses progress; arrow keys provide the same interaction, Escape resets, and Enter directly bypasses animation. The final transition expands only the screen, then opens `/desktop?from=preview`. Back to portfolio is shown only for this preview entry; the ordinary MacFolio homepage has no exit button.

Touch devices and screens under 1024px show a static MacFolio preview without an entry button. Reduced-motion desktop users get direct entry without the scroll interaction. All professional content is available without entering MacFolio.

Regenerate the original GLB with `node scripts/create-preview-laptop.mjs` if needed. It uses no external model. The display texture is an actual MacFolio screenshot.
