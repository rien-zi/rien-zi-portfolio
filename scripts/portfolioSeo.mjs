import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { profile, projects, career, skills, education } from '../src/data/portfolio.js';
export const site = 'https://rien-zi.aexis.space';
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
export const description = 'Renzil Rodrigues builds reliable operational software, backend integrations, automation and applied AI. Explore selected projects and interactive walkthroughs.';
export const routes = [
  { path: '/', title: 'Renzil Rodrigues — Technical Architect & Systems Builder', description },
  ...projects.map((project) => ({ path: `/work/${project.id}`, title: `${project.name} — Renzil Rodrigues`, description: project.description, project })),
  { path: '/games', title: 'Kyubee vs. Blobee — Portfolio Games', description: 'Play a lightweight game of Tic Tac Toe with Kyubee and Blobee. Three difficulties, a little rivalry and a friendly portfolio companion.' },
];
function content(route) {
  if (route.project) {
    const p = route.project;
    return `<a href="/#work">← Selected work</a><h1>${escape(p.name)}</h1><p>${escape(p.description)}</p><h2>The problem</h2><p>${escape(p.problem)}</p><h2>The response</h2><p>${escape(p.solution)}</p><h2>The workflow</h2><ol>${p.flow.map((stage) => `<li>${escape(stage)}</li>`).join('')}</ol><h2>My contribution</h2><ul>${p.contributions.map((item) => `<li>${escape(item)}</li>`).join('')}</ul><h2>Outcomes</h2><p>${escape(p.outcome)}</p>${p.next ? `<p>In progress: ${escape(p.next)}</p>` : ''}<p>Enable JavaScript for the interactive local walkthrough.</p>`;
  }
  if (route.path === '/games') return '<h1>Kyubee vs. Blobee</h1><p>Three in a row wins. Enable JavaScript to play Tic Tac Toe.</p><a href="/">Return to the portfolio</a>';
  return `<h1>${escape(profile.name)}</h1><p>${escape(profile.headline)}</p><p>${escape(profile.about)}</p><h2>Selected work</h2>${projects.map((p) => `<article><h3><a href="/work/${p.id}">${escape(p.name)}</a></h3><p>${escape(p.description)}</p><p>${escape(p.outcome)}</p></article>`).join('')}<h2>Career</h2>${career.map((r) => `<article><h3>${escape(r.title)}</h3><p>${escape(r.company)} · ${escape(r.date)}</p><p>${escape(r.summary)}</p></article>`).join('')}<h2>Capabilities</h2>${skills.map((s) => `<h3>${escape(s.name)}</h3><p>${escape(s.tools.join(', '))}</p>`).join('')}<h2>Education</h2>${education.map((e) => `<p>${escape(e.title)} · ${escape(e.institution)}</p>`).join('')}<h2>Let’s connect</h2><p><a href="mailto:${profile.email}">Email Renzil</a> · <a href="https://wa.me/917259540700" rel="noopener noreferrer">Contact Renzil on WhatsApp</a></p>`;
}
function metadata(html, route) {
  const schema = route.project ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'CreativeWork', name: route.project.name, description: route.description, url: site + route.path, creator: { '@type': 'Person', name: profile.name, url: site + '/' } }).replaceAll('<', '\u003c')}</script>` : '';
  return html.replace('</head>', `${schema}</head>`).replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(route.title)}</title>`)
    .replace(/(<meta\s+(?:name|property)="(?:description|og:description|twitter:description)"\s+content=")[^"]*("\s*\/>)/g, `$1${escape(route.description)}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*("\s*\/>)/g, `$1${escape(route.title)}$2`)
    .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*("\s*\/>)/g, `$1${escape(route.title)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*("\s*\/>)/, `$1${site}${route.path}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*("\s*\/>)/, `$1${site}${route.path}$2`)
    .replace('<div id="root"></div>', `<div id="root"><main class="static-portfolio">${content(route)}</main></div>`);
}
export function portfolioSeo() {
  let output;
  let building = false;
  return {
    name: 'portfolio-static-seo',
    configResolved(config) { output = resolve(config.root, config.build.outDir); building = config.command === 'build'; },
    transformIndexHtml(html) { return metadata(html, routes[0]); },
    async closeBundle() {
      if (!building) return;
      const index = { source: await readFile(resolve(output, 'index.html'), 'utf8') };
      const emit = async (fileName, source) => { const path = resolve(output, fileName); await mkdir(dirname(path), { recursive: true }); await writeFile(path, source); };
      // Reuse the built entry with route-specific static content and metadata.
      const base = String(index.source).replace(/<div id="root">[\s\S]*?<\/main><\/div>/, '<div id="root"></div>');
      const pages = [String(index.source)];
      for (const route of routes.slice(1)) { const html = metadata(base, route); pages.push(html); await emit(`${route.path.slice(1)}/index.html`, html); }
      const hashes = [...pages.join('\n').matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((match) => `'sha256-${createHash('sha256').update(match[1]).digest('base64')}'`);
      const scriptHashes = [...new Set(hashes)].join(' ');
      const policy = `default-src 'self'; script-src 'self' ${scriptHashes}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'self'; upgrade-insecure-requests`;
      const headers = [['Content-Security-Policy', policy], ['X-Content-Type-Options', 'nosniff'], ['Referrer-Policy', 'strict-origin-when-cross-origin'], ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()'], ['Strict-Transport-Security', 'max-age=31536000'], ['X-Frame-Options', 'SAMEORIGIN']];
      await emit('_headers', '/*\n' + headers.map(([key, value]) => `  ${key}: ${value}`).join('\n') + '\n');
      await emit('customHttp.yml', 'customHeaders:\n  - pattern: "**"\n    headers:\n' + headers.map(([key, value]) => `      - key: ${key}\n        value: "${value}"`).join('\n') + '\n');
    },
  };
}
