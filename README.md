# Aarav's macOS portfolio

React, Vite, Tailwind CSS, GSAP, and Zustand.

## Development

```sh
npm install
npm run dev
npm run build
```

The menu bar's chart icon opens Competitive Programming. Spotlight opens from the search icon or Ctrl/⌘ K and searches applications, projects, experience, skills, and photos.

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

## Contact form

The existing Contact window (both navbar and dock) submits name, reply email, subject, and message to `guptaaarav987@gmail.com` using [FormSubmit AJAX](https://formsubmit.co/ajax-documentation). There are no email credentials in the client.

**Owner setup:** Submit one real message from the deployed site, then open the FormSubmit activation email in that inbox and confirm the form. Check spam if needed. Messages cannot be relied on for delivery before this step; inbox delivery has not been tested by the development checks.

Visitor submissions arrive in the Gmail inbox above, with a subject such as `Portfolio: An opportunity`. The visitor's email is the Reply-To address, so replying to the notification emails them directly. There is no separate messages dashboard in the portfolio.

If submission fails, the form distinguishes email activation, network/timeout errors, rate limiting, and service outages, and preserves the draft. Activation requires the inbox owner's confirmation; a successful service response is not a guarantee of inbox delivery.

The form includes required fields, a honeypot, a sending state, submission feedback, and keeps the draft after failures. Direct email and social links remain available. Native validation and layout can be tested locally without sending a message.
