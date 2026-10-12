# Aarav's macOS portfolio

React, Vite, Tailwind CSS, GSAP, and Zustand.

## Development

```sh
npm install
npm run dev
npm run build
```

The menu bar's chart icon opens Competitive Programming. Spotlight opens from the search icon or Ctrl/âŒ˜ K and searches applications, projects, experience, skills, and photos.

## Build Notes and Archive

The yellow Notes icon in the dock opens Build Notes. Its notebook has full-text search, pinned notes, and links back to the relevant project folders. Edit the copy or add entries in `src/data/build-notes.js`; entries marked `archived: true` start on the Archive shelf.

Archive opens from the dock's bin icon, the notebook sidebar, or Spotlight. It contains parked ideas and archived notes, with search, filtering, previews, and Restore to Build Notes. Nothing is permanently deleted. Pin/archive preferences are saved only in the visitor's browser (`macfolio-notebook-v1` in local storage); they never change the published content for other visitors.

## Coding profiles

Profiles are configured in `api/_lib/coding.js`: LeetCode and Codeforces `aarav_g_168`, CodeChef `aaravgupta1608`, and GitHub `aarav-g-168`.

`GET /api/coding?platform=leetcode|codeforces|codechef|github` reads public profile data without account credentials. Vite serves this route during development and preview; Vercel supports the root `api/` handler in production. Other hosting needs an equivalent server route to enable live refresh.

The API caches each profile for 15 minutes and spaces Codeforces requests by at least two seconds. LeetCode, CodeChef, and GitHub use public profile endpoints/page data, whose formats can change. On upstream failures or static hosting, the dashboard retains the dated snapshot in `src/data/coding-snapshot.json`.

To update that snapshot before a static deployment (requires internet):

```sh
npm run refresh:coding
```

Solved totals add each platform's count; problems appearing on multiple platforms are counted separately. Codeforces reports a solved count only while its complete submission history fits the request limit.

## Spotify listening activity

The black menu-bar notch shows current or most recent listening activity from Last.fm, with artist, available artwork, a Spotify search link, and refresh. Control Center uses the same activity. Last.fm provides listening history, not Spotify playback control or precise progress.

1. Connect **Spotify Scrobbling** in [Last.fmâ€™s application settings](https://www.last.fm/settings/applications).
2. Create `.env.local`, then set `LASTFM_API_KEY` to your Last.fm API key and `LASTFM_USERNAME` to `aarav-g-168`. No Shared Secret is needed.
3. Start or restart `npm run dev`, play something on Spotify, and open the notch. The client checks every 15 seconds while the tab is visible, and when the tab regains focus; Last.fm may take a little longer to report a listen.

The API key stays on the server. Never prefix it with `VITE_`, commit `.env.local`, or place it in client source. `GET /api/music` caches Last.fm results for 10 seconds, coalesces concurrent requests, and backs off on failures. If refresh fails, the last known track is marked stale rather than shown as live.

Development and `npm run preview` serve the API through Vite. Vercel can use the root `api/music.js` handler with `LASTFM_API_KEY` and `LASTFM_USERNAME` configured as server environment variables. A different production host needs an equivalent server route; uploading `dist/` alone cannot serve live music. Static hosting shows a graceful unavailable state. The Node runtime must support `fetch` and `AbortSignal.timeout`.

## Contact form

The existing Contact window (both navbar and dock) submits name, reply email, subject, and message to `guptaaarav987@gmail.com` using [FormSubmit AJAX](https://formsubmit.co/ajax-documentation). There are no email credentials in the client.

**Owner setup:** Submit one real message from the deployed site, then open the FormSubmit activation email in that inbox and confirm the form. Check spam if needed. Messages cannot be relied on for delivery before this step; inbox delivery has not been tested by the development checks.

Visitor submissions arrive in the Gmail inbox above, with a subject such as `Portfolio: An opportunity`. The visitor's email is the Reply-To address, so replying to the notification emails them directly. There is no separate messages dashboard in the portfolio.

If submission fails, the form distinguishes email activation, network/timeout errors, rate limiting, and service outages, and preserves the draft. Activation requires the inbox owner's confirmation; a successful service response is not a guarantee of inbox delivery.

The form includes required fields, a honeypot, a sending state, submission feedback, and keeps the draft after failures. Direct email and social links remain available. Native validation and layout can be tested locally without sending a message.

## Cloudflare Workers deployment

The repository includes `wrangler.jsonc` and `cloudflare/worker.js`. They deploy the Vite output in `dist/` and adapt the shared `/api/music` and `/api/coding` handlers to the Workers runtime. API requests run before the SPA fallback, so they return JSON rather than `index.html`.

Cloudflare Workers Builds settings:

- Worker name: `portfolio` (must match `name` in `wrangler.jsonc`).
- Build command: `npm run build`.
- Deploy command: `npx wrangler deploy`.
- Root directory: repository root.

In the Worker's **Settings â†’ Variables and Secrets**, add `LASTFM_API_KEY` as a **Secret**, using your Last.fm API key. This is a runtime secret; a build-only environment variable is insufficient. `LASTFM_USERNAME` is configured as `aarav-g-168` in Wrangler. Do not add the API key to Wrangler, Git, or a `VITE_` variable.

To validate the deployment bundle without publishing:

```sh
npm run build
npx wrangler deploy --dry-run
```

To test the Workers runtime locally, run `npx wrangler dev` after building. For music, optionally put `LASTFM_API_KEY` in an ignored `.dev.vars` file. Keep using `.env.local` for `npm run dev`. Check `/api/music` and `/api/coding?platform=codechef` after deploying; music reports `unconfigured` until the runtime secret is present. Public coding platforms can occasionally reject upstream requests; the portfolio retains its saved stats in that case.

## Direct résumé link

`/resume` and `/resume/` serve `public/resume.pdf` directly in Vite and Cloudflare Workers, without loading the desktop. The desktop résumé window and download still use the same PDF.

Spotify Scrobbling follows the connected account across devices. The notch shows the last played track with “Offline · Not listening” when Last.fm reports no current track. This is listening activity, not Spotify account presence; Last.fm can delay stop/start updates. Upstream failures show an unknown status instead of claiming the owner is offline.

## Portfolio entry points

Both `/` and `/desktop` open MacFolio directly. `/resume` remains PDF-only. The conventional portfolio source is retained for a future redesign but is not currently exposed. The laptop scroll animation is deferred.
