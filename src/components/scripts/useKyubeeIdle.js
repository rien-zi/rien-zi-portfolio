import { useEffect, useRef } from 'react';
import { animationPools, conversationSettings, nextGesture } from '../../data/kyubeeConversations';

export default function useKyubeeIdle(ready, canPlay, play, isReading) {
  const callbacks = useRef({ canPlay, play, isReading });
  useEffect(() => { callbacks.current = { canPlay, play, isReading }; }, [canPlay, play, isReading]);
  useEffect(() => {
    if (!ready) return;
    let timer;
    let lastActivity = Date.now();
    const idleBag = {};
    const readingBag = {};
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const activity = () => { lastActivity = Date.now(); };
    const schedule = () => {
      const { idleMinMs, idleMaxMs } = conversationSettings;
      timer = window.setTimeout(tick, idleMinMs + Math.random() * (idleMaxMs - idleMinMs));
    };
    const tick = () => {
      if (!media.matches && !document.hidden && Date.now() - lastActivity > conversationSettings.quietAfterInteractionMs && callbacks.current.canPlay()) {
        const reading = callbacks.current.isReading();
        callbacks.current.play(nextGesture(reading ? animationPools.reading : animationPools.idle, reading ? readingBag : idleBag));
      }
      schedule();
    };
    schedule();
    // Pointer movement alone should not make the companion appear lifeless.
    const events = ['pointerdown', 'keydown', 'scroll'];
    events.forEach((event) => window.addEventListener(event, activity, { passive: true }));
    document.addEventListener('visibilitychange', activity);
    return () => {
      window.clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, activity));
      document.removeEventListener('visibilitychange', activity);
    };
  }, [ready]);
}
