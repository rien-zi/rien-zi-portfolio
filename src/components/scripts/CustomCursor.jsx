import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../css/CustomCursor.css';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  useEffect(() => {
    const cursor = cursorRef.current;
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let highlighted = false;
    let pointer = null;
    let frame;
    const xTo = gsap.quickTo(cursor, 'x', { duration: .12, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: .12, ease: 'power3.out' });
    const highlight = (target) => {
      const next = Boolean(target?.closest?.('[data-cursor-highlight]')) && !target?.closest?.('[data-cursor-normal], .games-section');
      if (highlighted === next) return;
      highlighted = next;
      cursor.classList.toggle('is-highlighted', next);
      gsap.to(cursor, { scale: next ? 2.5 : 1, duration: reduced.matches ? 0 : .22, overwrite: 'auto' });
    };
    const move = (event) => {
      if (!fine.matches || event.pointerType === 'touch') return;
      pointer = { x: event.clientX, y: event.clientY };
      if (reduced.matches) gsap.set(cursor, { x: pointer.x, y: pointer.y });
      else { xTo(pointer.x); yTo(pointer.y); }
      gsap.set(cursor, { opacity: 1 });
      highlight(event.target);
    };
    const reset = () => { highlighted = false; cursor.classList.remove('is-highlighted'); gsap.set(cursor, { scale: 1 }); };
    const hide = () => { reset(); gsap.set(cursor, { opacity: 0 }); };
    const sync = () => { document.documentElement.classList.toggle('has-custom-cursor', fine.matches); hide(); };
    const refresh = () => {
      if (frame != null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        if (pointer && fine.matches) highlight(document.elementFromPoint(pointer.x, pointer.y));
      });
    };
    // React can replace or disable a hovered game square without a pointerout.
    const observer = new MutationObserver(refresh);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled'] });
    sync();
    document.addEventListener('pointermove', move, true);
    document.addEventListener('pointerdown', reset, true);
    document.addEventListener('mouseleave', hide);
    window.addEventListener('blur', hide);
    window.addEventListener('scroll', refresh, { passive: true });
    window.addEventListener('portfolio:page-change', reset);
    fine.addEventListener('change', sync);
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame);
      document.documentElement.classList.remove('has-custom-cursor');
      document.removeEventListener('pointermove', move, true);
      document.removeEventListener('pointerdown', reset, true);
      document.removeEventListener('mouseleave', hide);
      window.removeEventListener('blur', hide);
      window.removeEventListener('scroll', refresh);
      window.removeEventListener('portfolio:page-change', reset);
      fine.removeEventListener('change', sync);
      xTo.tween.kill(); yTo.tween.kill(); gsap.killTweensOf(cursor);
    };
  }, []);
  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true"><span /></div>;
}
