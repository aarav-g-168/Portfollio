# SEO is a release requirement

The creative portfolio must remain discoverable and fast as components are added. Target **95+ Lighthouse SEO**, **90+ accessibility**, and strong Core Web Vitals on the release build. These are quality targets, not guarantees of search rankings. Record actual audit results separately from targets.

## Required foundation

- Pre-render the homepage and every project page into real HTML. Core content and links must work without waiting for JavaScript.
- Give every page a unique descriptive title, description, canonical URL, social metadata and valid Person/ProfilePage or CreativeWork/BreadcrumbList structured data. Do not invent metrics or reviews for rich results.
- Keep all three projects linked with ordinary anchor URLs. Tabs, hover, diagrams and dialogs enhance the content; they cannot be the only route to it.
- Maintain responsive images with dimensions, local WOFF2 fonts, font-display swap, meaningful image alternatives, one useful H1 per page, labelled controls and reduced-motion support.
- Lazy-load the desktop 3D engine below the fold. No WebGL or desktop-only entry controls on phones.
- Keep correct robots.txt, sitemap.xml and genuine 404 handling for the static portfolio deployment. Keep API URLs out of the sitemap.

## Staging versus release

`npm run build:preview` produces pre-rendered `dist-preview/` with **noindex** metadata. This intentional staging restriction lowers the Lighthouse crawlability result; do not remove it to inflate a preview score.

`npm run build:portfolio` produces indexable `dist-portfolio/` for release audits. Run `npm run serve:portfolio` to inspect it locally. It does not deploy or replace `dist/`. Canonicals currently target `https://aarav.site`; update the public `VITE_SITE_URL` value before releasing under a different domain.

`npm run build` remains the existing MacFolio production build. Do not switch the production Worker/domain to the new portfolio until the owner decides to launch it.

Audit the release homepage and project pages. After deployment, repeat on the real HTTPS domain and connect Google Search Console to submit the sitemap and monitor indexing. Local Lighthouse scores cannot establish live indexing or guarantee rankings.
