import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getPortfolioScrollMetrics } from './portfolioScroll';
import { getPageLocation } from './pageNavigation';
export default function usePageNavigation() {
  const [page, setPage] = useState(getPageLocation);
  const [difficulty, setDifficulty] = useState('easy');
  const saved = useRef({ scrollY: 0, hash: '#hero' });
  const destination = useRef(null);
  useEffect(() => {
    const scrollSection = (section, behavior = 'smooth') => {
      const target = document.getElementById(section);
      target?.setAttribute('tabindex', '-1');
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : behavior, block: 'start' });
    };
    const navigate = (event) => {
      const { section, project, difficulty: mode } = event.detail ?? {};
      const current = getPageLocation();
      if (project || section === 'games') {
        const next = project ? `project:${project}` : 'games';
        if (current === 'portfolio') saved.current = { scrollY: getPortfolioScrollMetrics().position, hash: window.location.hash };
        if (next !== current) {
          history.pushState(null, '', project ? `/work/${encodeURIComponent(project)}` : '/games');
          destination.current = { scrollY: 0 }; setPage(next);
        }
        if (mode) { setDifficulty(mode); window.dispatchEvent(new CustomEvent('kyubee:game-config', { detail: { difficulty: mode } })); }
      } else if (current.startsWith('project:') && section === 'project-demo') {
        scrollSection(section);
      } else if (current !== 'portfolio') {
        history.pushState(null, '', `/${section === 'portfolio' ? saved.current.hash : `#${section || 'hero'}`}`);
        destination.current = section === 'portfolio' ? { scrollY: saved.current.scrollY } : { section };
        setPage('portfolio');
      } else {
        const id = section === 'portfolio' ? 'hero' : section;
        history.replaceState(null, '', `/#${id}`); scrollSection(id);
      }
    };
    const pop = () => { destination.current = getPageLocation() === 'portfolio' ? { section: window.location.hash.slice(1) || 'hero' } : { scrollY: 0 }; setPage(getPageLocation()); };
    window.addEventListener('portfolio:navigate', navigate); window.addEventListener('popstate', pop);
    return () => { window.removeEventListener('portfolio:navigate', navigate); window.removeEventListener('popstate', pop); };
  }, []);
  useLayoutEffect(() => {
    const target = destination.current; destination.current = null;
    if (target?.section) document.getElementById(target.section)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    else if (target) window.scrollTo({ top: target.scrollY, behavior: 'instant' });
    window.dispatchEvent(new Event('portfolio:page-change'));
  }, [page]);
  return { page, gamePage: page === 'games', projectId: page.startsWith('project:') ? page.slice(8) : null, difficulty };
}
