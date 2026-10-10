# Release review — 2026-10-10

## Production URL

Canonical origin: https://rien-zi.aexis.space (the existing rien-zi subdomain is preserved).
Updated HTML canonical, Open Graph, Twitter image, Person structured data, runtime metadata, static project generator, robots, sitemap and README. The build regenerates deployment assets.

## Completed checks and fixes

- Production build and lint pass, including a clean npm ci in the separate release checkout.
- Fixed a production startup failure under CSP: the pinned avatar validator is now compiled at build time by scripts/avatarCsp.mjs; unsafe-eval remains blocked.
- npm audit: zero known vulnerabilities across production and development dependencies.
- All 175 sequence manifest frame references exist.
- Production Chrome review covered all six routes at 1280×900, 390×844 and 820×1180, with the generated security headers active: direct page loads, campaign template preview, game move and exit, route metadata, missing assets and horizontal overflow.
- All generated inline scripts match their CSP hashes.
- No old domain remains in source, public assets or rebuilt dist.
- All four project pages contain their new canonical URL in generated HTML.
- OG image is 1200 × 630. Favicons, Apple touch icon and manifest PNGs now match their declared dimensions.
- Theme persistence tolerates browsers that deny localStorage access.
- Git ignore excludes environment secrets, node_modules and build output.
- Removed stale README references to a deleted cleanup report and updated utility navigation description.
- Contact opens a visitor-reviewed WhatsApp message; no message was sent during review.

## Before publishing

1. Target repository: https://github.com/rien-zi/rien-zi-portfolio ; hosting: Cloudflare free tier. A separate release checkout preserves the existing Git history. Confirm Pages build command `npm run build`, output `dist`, repository root, Node 22 and the intended production branch.
2. Licensing recorded for @bible-strong/avatar-core and avatar-react 0.1.0, both declared AGPL-3.0-only. Preserve notices and determine the applicable corresponding-source and licensing requirements for the deployed combination. A generic permissive license for this repository must not imply that these dependencies have the same license. Reference: https://www.gnu.org/licenses/agpl-3.0.html and upstream https://github.com/smontlouis/bible-strong-avatar-lab . The user approved AGPL-3.0-only licensing for portfolio code. LICENSE, a source link and third-party notices are included; third-party components retain their own terms. The user authorized making the existing repository public, and GitHub visibility has been updated. The footer source link is publicly accessible.
3. Build with a supported Node version (22.12+), `npm ci`, and `npm run build`; publish dist at the domain root.
4. Configure the new hostname in hosting, DNS and HTTPS settings. Redirect the old hostname permanently to the same path on the new hostname if you still control it.
5. Apply generated security headers and route configuration in the hosting service. public/redirects.json is Amplify configuration, not a universal rewrite file. GitHub Pages needs its own domain/deployment setup and does not consume Amplify header settings.
6. After deployment, check real HTTPS headers, homepage and all project/game deep links, icon and resume downloads, social previews, WhatsApp handoff on a real phone, and submit the new sitemap in Search Console.

## Remaining limits

- Main JavaScript bundle is about 549 kB minified / 159 kB gzip; Vite reports its 500 kB warning. Project demos are lazy-loaded. Further avatar/conversation splitting is a performance improvement, not a build failure.
- Automated Chrome viewport checks do not certify screen-reader behavior or physical mobile devices.
- No offline cache/service worker is provided.
- Legacy /api proxy rules were retained as previously requested; the contact form does not use them.
