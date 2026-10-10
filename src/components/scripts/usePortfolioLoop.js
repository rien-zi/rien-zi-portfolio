import { useEffect, useLayoutEffect, useState } from 'react';
export default function usePortfolioLoop(page, ready, cycleRef, beforeRef, afterRef) {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    const toggle = (event) => setEnabled((previous) => typeof event.detail?.enabled === 'boolean' ? event.detail.enabled : !previous);
    window.addEventListener('portfolio:toggle-loop', toggle);
    return () => window.removeEventListener('portfolio:toggle-loop', toggle);
  }, []);
  useLayoutEffect(() => {
    window.dispatchEvent(new CustomEvent('portfolio:loop-state', { detail: { enabled } }));
    const cycle = cycleRef.current;
    const before = beforeRef.current;
    const after = afterRef.current;
    if (!ready || page !== 'portfolio' || !enabled || !cycle || !before || !after) return;
    let height = 0;
    let copying = false;
    let frame;
    let rebasing = false;
    let disposed = false;
    let rebaseFrame;
    const copies = new Map();
    const removeCopies = () => {
      for (const copy of copies.values()) copy.remove();
      copies.clear();
    };
    const instant = (top) => window.scrollTo({ top, behavior: 'instant' });
    const snapshot = () => {
      if (disposed || !cycle.isConnected) return;
      copying = true;
      for (const holder of [before, after]) {
        const copy = cycle.cloneNode(true);
        copy.removeAttribute('data-portfolio-cycle');
        copy.dataset.portfolioReplica = 'true';
        copy.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
        copy.querySelectorAll('a,button,input,textarea,select,summary').forEach((node, index) => { node.dataset.loopControl = index; node.tabIndex = -1; });
        copy.querySelectorAll('input,textarea,select').forEach((node, index) => {
          const original = cycle.querySelectorAll('input,textarea,select')[index];
          node.value = original.value;
          if ('checked' in node) node.checked = original.checked;
        });
        const originals = cycle.querySelectorAll('canvas');
        copy.querySelectorAll('canvas').forEach((canvas, index) => {
          try { canvas.getContext('2d')?.drawImage(originals[index], 0, 0); } catch { /* The poster remains the loading fallback. */ }
        });
        copies.get(holder)?.remove();
        holder.appendChild(copy);
        copies.set(holder, copy);
      }
      copying = false;
    };
    const refresh = () => {
      if (disposed || !cycle.isConnected) return;
      const previous = height;
      const start = cycle.getBoundingClientRect().top + window.scrollY;
      const logical = window.scrollY - start;
      height = cycle.getBoundingClientRect().height;
      before.style.height = `${height}px`;
      after.style.height = `${height}px`;
      snapshot();
      if (!previous) instant(window.scrollY + height);
      else if (Math.abs(previous - height) > 1) instant(height + logical);
      window.dispatchEvent(new Event('portfolio:loop-layout'));
    };
    const syncArt = () => {
      const originals = cycle.querySelectorAll('canvas');
      const images = cycle.querySelectorAll('.contact-character img');
      for (const holder of [before, after]) {
        holder.querySelectorAll('canvas').forEach((canvas, index) => { try { const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(originals[index], 0, 0); } catch { /* Poster fallback. */ } });
        holder.querySelectorAll('.contact-character img').forEach((image, index) => { image.style.visibility = images[index]?.style.visibility ?? ''; });
      }
    };
    const scroll = () => {
      if (disposed || rebasing || !height || !cycle.isConnected) return;
      const start = cycle.getBoundingClientRect().top + window.scrollY;
      const relative = window.scrollY - start;
      if (relative < window.innerHeight || relative > height - window.innerHeight * 2) syncArt();
      if (relative < -1 || relative >= height) {
        rebasing = true;
        // The equivalent viewport in the neighbouring copy is pixel-aligned.
        instant(start + ((relative % height + height) % height));
        window.dispatchEvent(new Event('portfolio:rebase'));
        rebaseFrame = requestAnimationFrame(() => { rebasing = false; });
      }
    };
    const scheduleSnapshot = () => {
      if (!disposed && !copying && frame == null) frame = requestAnimationFrame(() => { frame = null; snapshot(); });
    };
    let relocatedField;
    const forwarded = (event) => {
      const control = event.target.closest('[data-loop-control]') ?? event.target.closest('label')?.querySelector('[data-loop-control]');
      if (!control) return;
      const original = cycle.querySelectorAll('a,button,input,textarea,select,summary')[Number(control.dataset.loopControl)];
      if (!original) return;
      event.preventDefault();
      const editable = ['TEXTAREA', 'SELECT'].includes(original.tagName) || (original.tagName === 'INPUT' && !['radio', 'checkbox', 'submit', 'button'].includes(original.type));
      if (event.type === 'pointerdown' && !editable) { relocatedField = null; return; }
      if (event.type === 'click' && relocatedField === control) { relocatedField = null; return; }
      const shift = original.getBoundingClientRect().top - control.getBoundingClientRect().top;
      instant(window.scrollY + shift);
      if (event.type === 'pointerdown') {
        relocatedField = control;
        original.focus({ preventScroll: true });
        if (original.tagName === 'SELECT') { try { original.showPicker?.(); } catch { /* Native select remains available after relocation. */ } }
      } else { original.focus({ preventScroll: true }); original.click(); }
    };
    for (const holder of [before, after]) { holder.addEventListener('pointerdown', forwarded); holder.addEventListener('click', forwarded); }
    document.documentElement.dataset.portfolioLoop = 'true';
    refresh();
    const resize = new ResizeObserver(() => { if (Math.abs(cycle.getBoundingClientRect().height - height) > 1) refresh(); });
    resize.observe(cycle);
    const mutations = new MutationObserver(scheduleSnapshot);
    mutations.observe(cycle, { childList: true, subtree: true, attributes: true, attributeFilter: ['open', 'class', 'src'] });
    cycle.addEventListener('input', scheduleSnapshot);
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', scheduleSnapshot);
    return () => {
      disposed = true;
      const start = cycle.getBoundingClientRect().top + window.scrollY;
      const logical = height ? ((window.scrollY - start) % height + height) % height : window.scrollY;
      resize.disconnect(); mutations.disconnect(); cancelAnimationFrame(frame); cancelAnimationFrame(rebaseFrame);
      window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scheduleSnapshot); cycle.removeEventListener('input', scheduleSnapshot);
      for (const holder of [before, after]) { holder.removeEventListener('pointerdown', forwarded); holder.removeEventListener('click', forwarded); }
      removeCopies(); before.style.height = '0px'; after.style.height = '0px';
      delete document.documentElement.dataset.portfolioLoop;
      if (page === 'portfolio' && document.contains(cycle)) instant(logical);
      window.dispatchEvent(new Event('portfolio:loop-layout'));
    };
  }, [page, ready, enabled, cycleRef, beforeRef, afterRef]);
  return { enabled, setEnabled };
}
