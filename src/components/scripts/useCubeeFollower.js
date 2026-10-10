import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { getPortfolioScrollMetrics } from './portfolioScroll';
import { conversationSettings } from '../../data/kyubeeConversations';
import { CUBEE_CORNERS, getCubeeJourney } from './cubeeJourney';

export default function useCubeeFollower(anchorRef, followerRef, ready, onJourney, onContext, page = "portfolio") {
  const callbacks = useRef({ onJourney, onContext });
  useLayoutEffect(() => { callbacks.current = { onJourney, onContext }; }, [onJourney, onContext]);
  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const follower = followerRef.current;
    if (!ready || !anchor || !follower) return;
    const hero = anchor.closest('.clean-hero');
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = null;
    let settleTimer;
    let cornerTimer;
    let movement;
    let corner;
    let contextKey;
    let initialized = false;
    let scrolling = false;
    let lastScroll = 0;
    let journeyKey = 0;
    let preferredCorner = CUBEE_CORNERS[Math.floor(Math.random() * CUBEE_CORNERS.length)];
    let previousTarget;
    const reroll = () => {
      const pool = CUBEE_CORNERS.filter((candidate) => candidate !== corner);
      preferredCorner = pool[Math.floor(Math.random() * pool.length)];
      journeyKey++;
    };
    const update = () => {
      frame = null;
      const readingLine = window.innerHeight * .35;
      const sections = Array.from(document.querySelectorAll('[data-guide-section]'));
      const active = sections.filter((section) => section.getBoundingClientRect().top <= readingLine).at(-1) ?? sections[0];
      const section = page !== 'portfolio' ? page : active?.dataset.guideSection ?? 'hero';
      const metrics = getPortfolioScrollMetrics();
      const heroes = Array.from(document.querySelectorAll('.clean-hero'));
      const nearestHero = metrics.looping ? heroes.sort((a, b) => Math.abs(a.getBoundingClientRect().top) - Math.abs(b.getBoundingClientRect().top))[0] : hero;
      const heroTop = nearestHero?.getBoundingClientRect().top ?? 0;
      const exitDistance = (nearestHero?.offsetHeight ?? window.innerHeight) * .5;
      const heroTravel = metrics.looping ? Math.max(0, Math.min(1, heroTop > 0 ? heroTop / (window.innerHeight * .65) : -heroTop / exitDistance)) : undefined;
      const compact = page !== 'portfolio' || (metrics.looping ? heroTravel > .05 : window.scrollY > 24);
      const nextContext = `${section}-${compact}`;
      follower.dataset.compact = String(compact);
      follower.dataset.scrolling = String(scrolling);
      if (nextContext !== contextKey) {
        contextKey = nextContext;
        callbacks.current.onContext?.({ section, compact, scrolling });
      }
      if (follower.dataset.dragging === 'true' || follower.dataset.conversationOpen === 'true') return;
      const bounds = (nearestHero?.querySelector(".cubee-anchor") ?? anchor).getBoundingClientRect();
      const obstacles = Array.from(document.querySelectorAll('main a, main button, main input, main textarea, main label, main fieldset, main h1, main h2, main h3, main h4, main p, main li, main summary, main .cv-tags, main .cv-resolution, main .cv-education article, main .cv-profile-line, main [data-cubee-obstacle], .hero-navbar, .nav-overlay, .nav-utilities-panel'))
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
        }).filter((rect) => rect.height > 0 && rect.y < window.innerHeight && rect.y + rect.height > 0);
      const target = getCubeeJourney({
        scrollY: metrics.position, heroTravel,
        maxScroll: metrics.total,
        heroHeight: hero?.offsetHeight ?? window.innerHeight,
        anchor: { x: bounds.left, y: bounds.top, width: bounds.width },
        viewport: { width: window.innerWidth, height: window.visualViewport?.height ?? window.innerHeight },
        obstacles, previousCorner: corner, preferredCorner, journeyKey,
        compactOnly: page !== "portfolio", keepCorner: scrolling,
      });
      follower.dataset.occluded = String(target.occluded);
      follower.dataset.rail = String(target.rail);
      follower.dataset.docked = String(target.docked);
      follower.dataset.corner = target.corner;
      follower.inert = target.occluded;
      follower.setAttribute('aria-hidden', String(target.occluded));
      const position = { x: target.x, y: target.y, width: target.width };
      const changed = !previousTarget || Math.abs(previousTarget.x - target.x) > 2 || Math.abs(previousTarget.y - target.y) > 2 || previousTarget.width !== target.width;
      if (changed || !initialized) {
        movement?.kill();
        if (!initialized || media.matches) gsap.set(follower, { ...position, opacity: 1 });
        else if (!scrolling && target.corner !== corner && Math.random() < .3) {
          movement = gsap.timeline().to(follower, { opacity: 0, duration: .3 }).set(follower, position).to(follower, { opacity: 1, duration: .6 });
        } else movement = gsap.to(follower, { ...position, opacity: 1, duration: scrolling ? .85 : 1.6, ease: "power2.out", overwrite: "auto" });
        if (initialized && target.corner !== corner && !scrolling && !media.matches) callbacks.current.onJourney?.(target.phase);
      }
      corner = target.corner;
      previousTarget = target;
      initialized = true;
    };
    const schedule = () => { if (frame === null) frame = requestAnimationFrame(update); };
    const onScroll = () => {
      lastScroll = Date.now();
      scrolling = true;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        scrolling = false;
        // Retain the landing after scroll; idle rerolls are infrequent.
        schedule();
      }, conversationSettings.scrollSettleMs ?? 1000);
      schedule();
    };
    const scheduleCorner = () => {
      const { cornerMinMs, cornerMaxMs } = conversationSettings;
      cornerTimer = window.setTimeout(() => {
        if (!scrolling && Date.now() - lastScroll > 2000 && !document.hidden && !media.matches && (page !== "portfolio" || window.scrollY > 24)
          && follower.dataset.conversationOpen !== 'true' && follower.dataset.dragging !== 'true'
          && !follower.matches(':hover, :has(:focus-visible)')) { reroll(); schedule(); }
        scheduleCorner();
      }, cornerMinMs + Math.random() * (cornerMaxMs - cornerMinMs));
    };
    update();
    scheduleCorner();
    const resize = new ResizeObserver(schedule);
    resize.observe(anchor);
    const main = document.querySelector('main');
    if (main) resize.observe(main);
    const attributes = new MutationObserver(schedule);
    attributes.observe(follower, { attributes: true, attributeFilter: ['data-conversation-open', 'data-dragging'] });
    for (const menu of document.querySelectorAll('.nav-menu, .nav-utilities')) attributes.observe(menu, { attributes: true, attributeFilter: ['aria-expanded'] });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('portfolio:loop-layout', schedule);
    window.addEventListener('portfolio:rebase', schedule);
    window.addEventListener('pointerup', schedule);
    window.visualViewport?.addEventListener('resize', schedule);
    media.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settleTimer);
      clearTimeout(cornerTimer);
      resize.disconnect();
      attributes.disconnect();
      movement?.kill();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('portfolio:loop-layout', schedule);
      window.removeEventListener('portfolio:rebase', schedule);
      window.removeEventListener('pointerup', schedule);
      window.visualViewport?.removeEventListener('resize', schedule);
      media.removeEventListener('change', schedule);
    };
  }, [anchorRef, followerRef, ready, page]);
}
