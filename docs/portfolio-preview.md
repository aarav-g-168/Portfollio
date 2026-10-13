# Portfolio preview

Development happens on `codex/portfolio-preview`. Keep Cloudflare's production build connected to `main`; do not deploy this branch to the `portfolio` Worker.

## Local development

Run `npm run dev` and open `/preview` to work on the conventional portfolio. `/` and `/desktop` still open MacFolio. `/resume` still serves only the PDF.

## Separate preview deployment

Run `npm run build:preview`, then `npx wrangler deploy --config wrangler.preview.jsonc` when ready to publish a preview. This targets the separate `portfolio-preview` Worker with a workers.dev URL, with no custom domain or production routes. Its homepage opens the conventional portfolio; `/desktop` opens MacFolio.

The preview Worker needs its own `LASTFM_API_KEY` secret for music. Production secrets are not copied. Contact submissions still use the real email destination, so do not send test messages without intending to send an email.

Normal production builds use `npm run build` and the existing `wrangler.jsonc`; their homepage stays MacFolio. Preview builds go to `dist-preview/`, while production builds go to `dist/`, so preview assets never replace the production output.

No laptop scroll transition is included in this setup.
