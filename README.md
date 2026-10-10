# rien-zi portfolio

A React portfolio with a multilingual welcome loader, theme-aware Kyubee companion and a detailed professional profile.

## Development

```sh
npm ci
npm run dev
npm run build
npm run lint
```

## Content and reference

Public content is maintained in `src/data/portfolio.js`. ME.md and the old full-screen hero implementation were removed at your request.

Career dates, project status and impact descriptions should be checked against that reference when editing. Impact figures are self-reported; projected or associated savings are labelled and should not be summed into a total. Personal ratings and private guide details are not public portfolio copy.

## Kyubee

- `src/data/kyubeeConversations.json`: Configured answer nodes, follow-up questions, leading paths, section navigation, reactions and multilingual greetings. Edit `answer`, `question` and `choices` to expand a branch; `choices[].next` names another node, `reaction` names a source animation, and optional `section` scrolls to that section. Work/capability replies use `sectionLink` for their “see more” page links; game choices can also supply `difficulty`.
- `src/data/kyubeeConversations.js`: adapts the JSON and shuffles gesture bags without immediate repeats. No text input, LLM calls or chat backend.
- `src/data/cubeeHero.js`: one-shot greetings, reading poses and brief adaptations of all 23 original animation patterns. The original loops remain available.
- `src/components/scripts/Cubee.jsx`: drag rotation, greeting/reset control, theme colors and conversations.
- `useCubeeFollower.js` and `cubeeJourney.js`: section context, random corner preferences and collision filtering for text, controls and the contact artwork. Kyubee stays visible through scrolling, follows more slowly and retains a clear corner during the scroll gesture. A small reserved edge gutter holds a compact companion when the viewport is crowded. Quiet corner changes occur periodically (16–28 seconds) and ease into their destination. Movement pauses while a conversation is open.
- `useKyubeeIdle.js`: random gestures at 5–10 second checks after a short interaction pause, with quieter listening/thinking/blinking while a conversation is open. Automatic gestures stop during scrolling, dragging, active animations, hidden tabs and reduced-motion preferences.

The JSON `settings` configures idle cadence (milliseconds) and random corner changes (16–28 seconds). `animationPools` controls the character of automatic, reading, hover and travel reactions. All 23 patterns are reachable through conversation choices; theatrical moods such as angry, scared and sad are explicit choices rather than random idle behavior. The conversation supports back navigation, ten topics, Escape and outside-click dismissal.

The avatar body uses the theme accent; its eyes use the theme background. Colors and matte surfaces are defined in `src/index.css`.

`ContactCharacterSequence.jsx` reuses the original transparent sequence at Let’s connect. It loads near the section, scrolls forward or backward, holds the final pose at the page bottom and retains at most 32 decoded frames plus in-flight requests. RGB slice and scanline glitches reuse the original masked treatment while the character is visible. Glitches pause offscreen, in hidden tabs and for reduced motion. A static poster remains available for reduced motion or asset-loading failures. The language welcome loader remains active.

Selected work and capability tech pills share a stronger staggered accent glow. Reduced-motion preferences disable that animation. Theme colors remain editable in `src/index.css`.

The avatar renderer packages are `@bible-strong/avatar-core` and `@bible-strong/avatar-react` 0.1.0; their published package metadata declares AGPL-3.0-only.


## Navigation and games

The navbar floats at a fixed viewport position, uses a thin RIEN wordmark and displays portfolio scroll progress from 0–100%. The Utilities menu’s gamepad opens the dedicated `/games` page. On that page the navbar offers Exit game. `usePageNavigation.js` handles navigation and browser back/forward without extra dependencies; exit restores the previous portfolio scroll position. Kyubee can navigate to work, capabilities, games and the portfolio through configured choices.

`GamesSection.jsx` renders the standalone game page: you play as Kyubee, the Strobi-inspired opponent is named Blobee, and you start each round. `ticTacToe.js` owns turn validation, win/draw detection and difficulty logic:

- Easy: a random available square.
- Normal: take a winning move, block an immediate loss 80% of the time, otherwise choose randomly.
- Hard: minimax planning with random selection among equally optimal moves.

The board supports keyboard buttons and arrow-key navigation, a short bot thinking delay, highlighted winning lines, rematches and session scores. New rounds and difficulty changes cancel pending bot moves. Kyubee reacts to moves and results. `GameAvatar.jsx` supplies lightweight square and round character tokens using theme colors.

## Cursor and layering

The default fine-pointer cursor is a white ring and center dot with difference blending. Only `[data-cursor-highlight]` text expands it into a filled highlight; `[data-cursor-normal]` regions (including the game board) keep its normal shape. React replacements, disabled squares and page navigation reset/recheck hover state. Native cursors remain available on touch/coarse-pointer devices.

Kyubee’s conversation panel uses z-index 900, above the floating navbar at 750. The cursor remains above both. Light-theme work cards use the darker `--surface` shade against the matte `--bg`.


## Project synopses and local walkthroughs

Selected Work presents Resolute (including PHP modernization), Middleware Integration, RAG & Document Intelligence and Campaign Management. Each opens its own `/work/{id}` synopsis with context, architecture, contributions, outcomes and an interactive local demo. Unfinished personal projects are omitted.

- Resolute: step through a fictional resolution workflow and a review gate.
- Middleware: queue events, simulate a timeout, retry and see duplicate IDs rejected.
- Document intelligence: search fictional document snippets with metadata filters and inspect references. This is a keyword illustration, not a vector database or live AI response.
- Campaign Management: generate a preset HTML email, revise it, manually edit the markup, preview it in a sandboxed frame, run a local review check and confirm sample metadata. No email, upload or AI request is sent. Sample intent rules illustrate the production gate; they are not production security controls.

Campaign reach (350,000+ people across multiple campaigns) and the 14% click/interaction increase are self-reported. No percentage basis or unique-recipient count is inferred. Project details live in `src/data/portfolio.js`; walkthroughs are lazy-loaded from `src/components/scripts/projects/`.

`src/data/kyubeePrompts.json` configures section-specific invitations, project prompts and cheerful game suggestions. Prompt labels rotate while the visitor is settled; clicking opens the matching conversation. Idle landings vary every 16–28 seconds, with occasional fade-and-reappear transitions. Conversations and focused controls pause relocation; scrolling preserves the current landing preference. Crowded views use several positions in the reserved edge gutter. Reduced motion disables automatic relocation.

## Scroll loop and WhatsApp contact

Infinite mode defaults to on. The Utilities menu provides Games and an infinity toggle (accent when enabled); Kyubee can enable or disable the same setting. The footer no longer contains a checkbox. Project and game pages remain finite.

The portfolio has a single interactive cycle with matching visual copies before and after it. Native scrolling crosses the ending into the next hero; the scroll position is recycled by exactly one cycle height while equivalent content stays aligned in the viewport. There is no wheel interception, boundary delay or percentage jump. Progress measures one cycle. Kyubee follows the nearest hero across the seam rather than the absolute document offset. Copies have no duplicate IDs or keyboard tab stops, are hidden from assistive technology, and forward pointer interaction to the original controls. Form values and contact artwork are mirrored. Disabling removes the copies and restores the equivalent finite-page position.

The contact form collects name, one of five purposes, an optional validated email and a required description. Each purpose plays a corresponding Kyubee reaction. Submitting opens `https://wa.me/917259540700` with an encoded message. It does not send automatically: the visitor reviews and sends in WhatsApp. No form data is stored or posted to the old contact API. A fallback link remains available if the new tab does not open.

## Visibility, mobile icons and deployment security

The canonical production origin is `https://rien-zi.aexis.space`. Change it consistently in index.html, scripts/portfolioSeo.mjs, usePageMetadata.js, robots.txt and sitemap.xml if the public hostname changes.

The build generates readable HTML, route-specific titles/descriptions/canonicals/social metadata and project CreativeWork structured data for all four `/work/{id}` pages and `/games`. The homepage has Person structured data. React enhances these pages after JavaScript loads. Sitemap entries use real page URLs rather than section fragments; robots allows public pages and excludes `/api/` from crawling. Robots rules are crawler hints, not access control.

Mobile assets include existing favicons/Apple touch icon plus 192/512 PNG icons, a maskable icon and `site.webmanifest`. The browser theme color follows theme switching. This is an add-to-home-screen foundation, not an offline application: no service worker or offline cache is installed.

Build artifacts include `dist/_headers` and `dist/customHttp.yml`. These contain a CSP with local scripts and hashes for the first-paint bootstrap and generated JSON-LD, local images/fonts/connections, sandbox-compatible same-origin frames, blocked objects, restricted base/form actions, plus nosniff, referrer policy, permissions policy, HTTPS HSTS and same-origin frame protection. Inline styles remain allowed because GSAP, theme variables and HTML-email demos use them. The campaign preview still has an empty sandbox and cannot execute scripts. An external image pasted into its HTML will be blocked by the deployed CSP.

**Hosting must apply these headers.** For AWS Amplify, use the generated customHttp.yml configuration in the hosting custom-header settings or your deployment workflow, and apply public/redirects.json rewrites so `/work/{id}` serves its generated HTML. For a host supporting `_headers`, deploy the generated artifact. Merely uploading a YAML file does not establish that response headers are active. Confirm live HTTPS response headers and real project URLs after deployment, and submit the sitemap in Search Console. No production settings or WhatsApp messages were changed from this workspace.

Accessibility additions include a skip link, labelled form fields and radio group, optional email validation, status feedback, visible focus states and reduced-motion handling for the border animation. Native keyboard scrolling remains available, and visitors can disable the scroll loop. Browser/screen-reader and physical mobile review remains a separate deployment check.

The user-approved cleanup is complete. The two-page résumé at public/resume.pdf reflects the current career timeline, four projects and labelled self-reported outcomes.

The accessibility pass also separates readable accent text (`--accent-ink`) from avatar/glow accent color and increases muted-text contrast on matte surfaces. Both production and development dependency audits reported zero known vulnerabilities on 2026-10-10. This is a registry audit, not proof against every security issue.

The initial HTML includes a small theme-aware Hello screen before React downloads. Loader removes it in a layout effect after the multilingual loader mounts. Static SEO content stays behind that screen during startup; if JavaScript is disabled it is visible immediately, and if startup fails it is revealed after 12 seconds. Reapply generated hosting headers when deploying because the inline bootstrap has its own CSP hash.

## Release review

See RELEASE_REVIEW.md for the latest local verification and deployment checks. Use Node.js 22.12+ (or a supported newer release), install with `npm ci`, build with `npm run build`, and publish `dist/`. Hosting on a custom domain root is assumed; a GitHub Pages repository subpath requires a different base and routing setup. GitHub Pages does not apply `_headers` or Amplify `customHttp.yml`; configure security headers on a supporting host or proxy.

The avatar schema validator is compiled during the Vite build by `scripts/avatarCsp.mjs`. This retains validation without requiring `unsafe-eval` in the deployed CSP. The adapter deliberately fails the build if the pinned package structure changes, so dependency upgrades require a review.

## Current Cloudflare Pages deployment

Source repository: https://github.com/rien-zi/rien-zi-portfolio

- Production hostname: `rien-zi.aexis.space`.
- Build command: `npm run build`.
- Build output directory: `dist`.
- Root directory: repository root.
- Node version: 22 (`.node-version`).
- The build writes `_headers` directly into dist; Cloudflare Pages applies this to static responses.
- Generated project and game directories serve their own HTML. There is deliberately no wildcard `_redirects` rule to overwrite these pages with the homepage. Cloudflare Pages supplies SPA fallback for remaining routes when no top-level 404.html is present.
- `public/redirects.json` and generated `customHttp.yml` are retained legacy Amplify artifacts; Cloudflare Pages does not use them.
- Verify the custom domain, production branch and build settings in Cloudflare before merging: a push to the configured production branch can trigger a deployment.

References: https://developers.cloudflare.com/pages/configuration/headers/ and https://developers.cloudflare.com/pages/configuration/serving-pages/ .

## License and source

Portfolio code is Copyright 2026 Renzil Rodrigues and licensed under AGPL-3.0-only; see LICENSE. Third-party libraries and fonts retain their original terms in public/third-party-notices.txt, including the avatar renderer’s AGPL license and GSAP’s separate standard license. Personal content, images and branding are excluded from the portfolio code license unless otherwise stated.

The deployed footer links to https://github.com/rien-zi/rien-zi-portfolio, containing the source, pinned dependency lockfile and build instructions. Avatar upstream source: https://github.com/smontlouis/bible-strong-avatar-lab . Preserve licensing and notices when redistributing.
