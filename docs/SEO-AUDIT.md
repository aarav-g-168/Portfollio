# Portfolio release audit

## Current tactile-component revision

Re-audited after adding the project X-ray, cinematic reel, patchboard, build machine, postcard form and micro-interactions. Local release homepage, Lighthouse 13.5.0, default mobile simulation: **95 performance / 100 accessibility / 100 best practices / 100 SEO**. FCP 2.1 s, LCP 2.6 s, total blocking time 0 ms, CLS 0. Report: `studio-home.report.html` in the task's external `seo-audit/` artifact directory. Builds still pre-render all four pages; the SEO validation script passes. These are lab results, not field Core Web Vitals or search-ranking guarantees.

## Earlier baseline

Measured on 15 October 2026 with Lighthouse 13.5.0, Chrome headless, mobile emulation and default simulated throttling. Target: the local indexable release build at `http://127.0.0.1:4175/`, built with `npm run build:portfolio`. These scores describe this build, not the currently published MacFolio.

| Page | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Homepage | 96 | 100 | 100 | 100 |
| HackGrid case study | Not audited | 100 | 100 | 100 |
| Contest Manager case study | Not audited | 100 | 100 | 100 |
| iOS Fusion case study | Not audited | 100 | 100 | 100 |

Homepage lab metrics: FCP 2.0 s, LCP 2.4 s, total blocking time 0 ms, cumulative layout shift 0. These are lab observations; field Core Web Vitals require real traffic.

Reports are stored outside the repository in the Codex task's `seo-audit/` artifact directory. Lighthouse checks only part of accessibility and SEO. Manual QA also checked phone-width layouts, project navigation, interactive maps and process controls, hydration, and MacFolio entry/return.

The normal `npm run build` output and live domain retain MacFolio. Staging intentionally uses `noindex`. Before launching the new portfolio, audit the deployed HTTPS domain, verify canonical URLs and 404 responses, and submit its sitemap to Google Search Console. A Lighthouse score does not guarantee indexing or rankings.
