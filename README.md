# Aarav's macOS portfolio

React, Vite, Tailwind CSS, GSAP, and Zustand.

## Development

```sh
npm install
npm run dev
npm run build
```

The menu bar's trophy opens Competitive Programming. Spotlight opens from the search icon or Ctrl/⌘ K and searches applications, projects, experience, skills, and photos.

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

The form includes required fields, a honeypot, a sending state, submission feedback, and keeps the draft after failures. Direct email and social links remain available. Native validation and layout can be tested locally without sending a message.
