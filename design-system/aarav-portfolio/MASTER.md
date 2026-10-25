# Aarav portfolio — design direction

Preview-only creative portfolio. The published MacFolio route stays independent.

## Visual language

Editorial composition: warm paper (#f4f1e9), near-black olive ink (#23251f), accessible functional orange (#bc3c12), brighter orange artwork (#d84617), neutral dividers (#d6d5ca). Self-hosted Archivo for oversized display typography, self-hosted Space Grotesk for readable content, system monospace for small metadata. Use Georgia italics as a deliberate editorial counterpoint in section headings.

Keep large type, generous space, asymmetric hero composition and visible rules. Project screenshots carry the color in the work section. The project turntable and laptop showroom use the same dark olive stage language; the surrounding content stays light and editorial. Avoid adding unrelated neon, glass cards, or extra competing background effects.

## Interaction

Motion supports the hierarchy: clipped title reveal, restrained magnetic primary action, gentle project tilt, project crossfades, build-note dialogs, expandable experience and skill category selection. Never hide essential information behind hover. Respect reduced motion, native dialog focus, visible focus rings and semantic controls.

Use the dimensional project turntable, physical role passes, skills patchboard to explain the work. The turntable has layered CSS perspective screens, a native tuning slider, arrow buttons and keyboard tabs. Keep a direct, visible link index for visitors who want case studies immediately. Role passes use Motion springs and SVG straps; dragging must not accidentally select a role, and keyboard selection must still work after a drag. Turn off pass dragging on coarse pointers, small screens and reduced motion. Preserve the approved MacBook showroom and everything below it when refining work and experience. Keep every project summary and both role details pre-rendered, with no invented outcomes or metrics.


The laptop scroll interaction applies only within the projected laptop bounds. Forward and backward input must remain reversible before entry. Keyboard arrows, Escape, reset, direct entry and a skip link are available. The screen transitions into live MacFolio; only preview entrants get a return button.

## Mobile

Complete professional content, native scrolling, accessible projects and forms. Simplify the hero artwork, stack columns, allow tags to wrap and keep inputs at 16px. No WebGL or unusable desktop entry control on touch/small-screen devices. Reduced-motion desktop visitors receive direct entry without the scroll scene.

## Content

Use a professional, direct voice. Introduce Aarav by name and role; make navigation, section headings and actions explicit. Describe project purpose, implementation and responsibilities using verified details. Avoid self-congratulatory slogans, playful filler, exaggerated outcomes and invented metrics. Keep preview copy separate from the published MacFolio content.

Give each hero element a distinct purpose: name, role, education/location, work focus, and complementary skill highlights. Avoid repeating the role or the same framework list across the introduction, illustration labels, and skill strip. React Native is a confirmed skill; retain the wider language, backend, database, and tooling skills as well.

SEO is a non-negotiable release requirement. Follow `docs/SEO-REQUIREMENTS.md` for pre-rendering, metadata, crawlable project routes, performance budgets and measured audits when adding components.

The skill dataset returned no verified match for the specific progressive-disclosure query. General implementation guidance here is to preserve complete linked project content and use native buttons/dialogs for optional details.

Use existing project and experience data. Do not invent employment outcomes, usage metrics, availability claims or testimonials. Coding profile links open the actual public accounts. Contact uses the already activated email form integration.

UI/UX Pro Max research: personal portfolio creative / scroll-triggered storytelling. The editorial palette and restrained motion above are intentional project-specific decisions rather than literal adoption of a generic recommended theme.
