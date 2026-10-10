import { useEffect } from 'react';
import gsap from 'gsap';

// Original RGB slice / scanline treatment, masked to the character's alpha.
export default function useCharacterGlitch(rootRef, sourceRef, redRef, cyanRef, scanRef, enabled) {
  useEffect(() => {
    if (!enabled) return;
    const source = sourceRef.current;
    const layers = [redRef.current, cyanRef.current, scanRef.current];
    if (!source || layers.some((layer) => !layer)) return;
    const contexts = layers.map((layer) => layer.getContext('2d'));
    if (contexts.some((context) => !context)) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let timer;
    let timeline;
    const random = (min, max) => min + Math.random() * (max - min);
    const clear = () => {
      contexts.forEach((context, index) => context.clearRect(0, 0, layers[index].width, layers[index].height));
      gsap.set(layers, { opacity: 0 });
    };
    const glitch = () => {
      const width = source.width;
      const height = source.height;
      layers.forEach((layer) => { layer.width = width; layer.height = height; });
      clear();
      const count = Math.floor(random(8, 19));
      for (let index = 0; index < count; index++) {
        const y = Math.floor(random(0, height));
        const sliceHeight = Math.min(height - y, Math.max(2, Math.floor(height * random(.008, .045))));
        const displacement = Math.floor(width * random(.012, .155)) * (index % 2 ? -1 : 1);
        contexts[0].drawImage(source, 0, y, width, sliceHeight, displacement, y, width, sliceHeight);
        contexts[1].drawImage(source, 0, y, width, sliceHeight, -displacement, y, width, sliceHeight);
      }
      for (let index = 0; index < Math.floor(random(3, 9)); index++) {
        const y = Math.floor(random(0, height));
        const sliceHeight = Math.min(height - y, Math.max(2, Math.floor(random(2, height * .008))));
        contexts[2].drawImage(source, 0, y, width, sliceHeight, random(-width * .035, width * .035), y, width, sliceHeight);
      }
      contexts.forEach((context) => {
        context.globalCompositeOperation = 'destination-in';
        context.drawImage(source, 0, 0);
        context.globalCompositeOperation = 'source-over';
      });
      timeline?.kill();
      timeline = gsap.timeline({ onComplete: clear })
        .to(layers, { opacity: random(.45, .8), duration: .035 })
        .to(layers, { opacity: 0, duration: random(.07, .14) });
    };
    function schedule() {
      clearTimeout(timer);
      if (!visible || document.hidden || media.matches) return;
      timer = window.setTimeout(() => {
        if (visible && !document.hidden && !media.matches && Math.random() <= .65) glitch();
        schedule();
      }, random(700, 2500));
    }
    const reset = () => { timeline?.kill(); clear(); schedule(); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; reset(); }, { threshold: .12 });
    observer.observe(rootRef.current);
    media.addEventListener('change', reset);
    document.addEventListener('visibilitychange', reset);
    return () => {
      clearTimeout(timer);
      timeline?.kill();
      observer.disconnect();
      media.removeEventListener('change', reset);
      document.removeEventListener('visibilitychange', reset);
      clear();
    };
  }, [rootRef, sourceRef, redRef, cyanRef, scanRef, enabled]);
}
