# Portfolio responsive review — 25 October 2026

Scope: the new portfolio and all three project case studies, using the local pre-rendered release build. The published MacFolio routes and deployment configuration were not changed.

## Changes

- Header links retain 44px height on phones. Decorative section numbers disappear below 361px so labels fit without shrinking the text.
- Project counter and feature toggle share the first row on compact phones; the dial and both arrows have a separate full-width row.
- Skills and competitive-programming cards stack at widths up to 1000px, avoiding compressed tablet columns.
- Tablet form fields use 16px text. Footer padding and scroll clearance keep the floating navigation clear of the last content.
- Floating navigation and content account for browser-provided safe-area insets.

## Verification

- Homepage viewport checks: 320×740, 360×800, 375×812, 430×932, 600×900, 701×900, 768×1024, 900×900, 1024×768, 1440×900, 1920×1080, and 844×390 landscape.
- Checked key content/control bounds, internal overflow, the hero, navigation, project controls, experience, skills, and contact layout. No horizontal overflow remained at these sizes.
- All three case studies checked at 320px, 768px, and 1440px: navigation, application diagrams, engineering decisions, and project links fit without clipping.
- Project features fit all three previews at 320px. Rechecked project selection, keyboard controls, both experience entries, skill selection, and desktop-only interaction gating.
- Empty contact submission used native validation without sending a message. In the short landscape viewport, focused fields and the footer remained above the floating navigation.
- `npm run lint`, `npm run build:portfolio`, and `npm run check:seo` passed.

These are browser viewport and interaction checks, rather than tests on physical devices.
