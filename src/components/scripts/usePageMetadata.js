import { useEffect } from 'react';
import { projects } from '../../data/portfolio';
const origin = 'https://rien-zi.aexis.space';
const homeDescription = 'Renzil Rodrigues builds reliable operational software, backend integrations, automation and applied AI. Explore selected projects and interactive walkthroughs.';
export default function usePageMetadata(page) {
  useEffect(() => {
    const project = page.startsWith('project:') ? projects.find((item) => item.id === page.slice(8)) : null;
    const missing = page.startsWith('project:') && !project;
    const title = missing ? 'Project not found | rien-zi' : project ? `${project.name} — Renzil Rodrigues` : page === 'games' ? 'Kyubee vs. Blobee — Portfolio Games' : 'Renzil Rodrigues — Technical Architect & Systems Builder';
    const description = project?.description ?? (page === 'games' ? 'Play a lightweight game of Tic Tac Toe with Kyubee and Blobee. Three difficulties, a little rivalry and a friendly portfolio companion.' : homeDescription);
    const url = `${origin}${project ? `/work/${project.id}` : page === 'games' ? '/games' : '/'}`;
    document.title = title;
    const set = (selector, value) => document.querySelector(selector)?.setAttribute('content', value);
    set('meta[name="description"]', description); set('meta[property="og:description"]', description); set('meta[name="twitter:description"]', description);
    set('meta[property="og:title"]', title); set('meta[name="twitter:title"]', title); set('meta[property="og:url"]', url);
    set('meta[name="robots"]', missing ? 'noindex, follow' : 'index, follow, max-image-preview:large');
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
  }, [page]);
}
