import { getPortfolioScrollMetrics } from './portfolioScroll';
import { useEffect, useRef, useState } from 'react';
import '../css/ContactCharacterSequence.css';
import useCharacterGlitch from './useCharacterGlitch';

// Reuse the original transparent sequence in a contained contact composition.
// Only a nearby window of decoded frames is retained, not the entire sequence.
export default function ContactCharacterSequence() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const redRef = useRef(null);
  const cyanRef = useRef(null);
  const scanRef = useRef(null);
  const [painted, setPainted] = useState(false);
  useCharacterGlitch(rootRef, canvasRef, redRef, cyanRef, scanRef, painted);
  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const section = root.closest('#contact');
    const context = canvas.getContext('2d');
    if (!context || !section) return;
    const abort = new AbortController();
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cache = new Map();
    const loading = new Set();
    let frames = [];
    let wanted = 0;
    let shown = -1;
    let queue = [];
    let frame = null;
    let nearby = false;
    let disposed = false;
    let manifestLoading = false;
    const width = window.innerWidth <= 760 ? 640 : 800;
    canvas.width = width;
    canvas.height = Math.round(width * 9 / 16);
    const trim = () => {
      const distant = [...cache.keys()].sort((a, b) => Math.abs(b - wanted) - Math.abs(a - wanted));
      while (cache.size > 32) {
        const index = distant.shift();
        cache.get(index)?.close();
        cache.delete(index);
      }
    };
    const paint = () => {
      if (!cache.size || disposed || media.matches) return;
      const nearest = cache.has(wanted) ? wanted : [...cache.keys()].reduce((a, b) => Math.abs(a - wanted) <= Math.abs(b - wanted) ? a : b);
      if (nearest === shown) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(cache.get(nearest), 0, 0, canvas.width, canvas.height);
      shown = nearest;
      setPainted(true);
    };
    const pump = () => {
      if (disposed || media.matches || !nearby) return;
      while (loading.size < 4 && queue.length) {
        const index = queue.shift();
        if (cache.has(index) || loading.has(index)) continue;
        loading.add(index);
        fetch(`/sequence/${frames[index].filename}`, { signal: abort.signal })
          .then((response) => { if (!response.ok) throw new Error('Sequence frame unavailable'); return response.blob(); })
          .then((blob) => createImageBitmap(blob, { resizeWidth: width, resizeHeight: canvas.height, resizeQuality: 'high' }))
          .then((bitmap) => {
            if (disposed) { bitmap.close(); return; }
            cache.set(index, bitmap);
            trim();
            paint();
          })
          .catch(() => { /* The original poster remains visible if decoding fails. */ })
          .finally(() => { loading.delete(index); pump(); });
      }
    };
    const update = () => {
      frame = null;
      if (disposed || !nearby || media.matches || !frames.length) return;
      const top = section.getBoundingClientRect().top + window.scrollY;
      const start = Math.max(0, top - window.innerHeight * .85);
      const end = Math.min(top + section.offsetHeight - window.innerHeight * .25, getPortfolioScrollMetrics().looping ? (document.querySelector("[data-portfolio-cycle]").getBoundingClientRect().top + window.scrollY + getPortfolioScrollMetrics().total - window.innerHeight) : document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, (window.scrollY - start) / Math.max(1, end - start)));
      wanted = Math.round(progress * (frames.length - 1));
      queue = [wanted];
      for (let distance = 1; distance <= 12; distance++) {
        if (wanted + distance < frames.length) queue.push(wanted + distance);
        if (wanted - distance >= 0) queue.push(wanted - distance);
      }
      paint();
      pump();
    };
    const schedule = () => { if (frame === null) frame = requestAnimationFrame(update); };
    const initialize = async () => {
      if (frames.length || manifestLoading || media.matches) { schedule(); return; }
      manifestLoading = true;
      try {
        const response = await fetch('/sequence/gsap-sequence.json', { signal: abort.signal });
        if (!response.ok) return;
        const manifest = await response.json();
        if (disposed || !Array.isArray(manifest.frames)) return;
        frames = manifest.frames;
        schedule();
      } catch { /* Keep the poster if the asset cannot be loaded. */ }
      finally { manifestLoading = false; }
    };
    const observer = new IntersectionObserver(([entry]) => {
      nearby = entry.isIntersecting;
      if (nearby) initialize();
      else queue = [];
    }, { rootMargin: '400px 0px' });
    observer.observe(root);
    const preferenceChanged = () => {
      if (media.matches) { setPainted(false); queue = []; }
      else { shown = -1; initialize(); }
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(section);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    media.addEventListener('change', preferenceChanged);
    return () => {
      disposed = true;
      abort.abort();
      observer.disconnect();
      resize.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      media.removeEventListener('change', preferenceChanged);
      cache.forEach((bitmap) => bitmap.close());
      cache.clear();
    };
  }, []);
  return <figure ref={rootRef} className="contact-character" data-cubee-obstacle aria-label="Animated character accompanying the contact section">
    <div className="contact-character-orbit" aria-hidden="true" />
    <img src="/sequence/theme-alpha-png/frame_000.png" loading="lazy" decoding="async" alt="" aria-hidden="true" style={{ visibility: painted ? 'hidden' : 'visible' }} />
    <canvas ref={canvasRef} aria-hidden="true" style={{ visibility: painted ? 'visible' : 'hidden' }} />
    <canvas ref={redRef} className="contact-glitch contact-glitch-red" aria-hidden="true" />
    <canvas ref={cyanRef} className="contact-glitch contact-glitch-cyan" aria-hidden="true" />
    <canvas ref={scanRef} className="contact-glitch contact-glitch-scan" aria-hidden="true" />
    <figcaption><span aria-hidden="true">✦</span> A familiar face, one last turn.</figcaption>
  </figure>;
}
