import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { greetings } from "../../data/greetings";

const MIN_MS = 4500;
const HOLD_S = 0.4; // pause at 100% before sliding
const EXIT_S = 1.1; // slide-up duration
const W = 1000; // svg viewBox width
const MAX_DEPTH = 100; // curve depth at the start (viewBox units)

const fillPath = (d) => `M0 0 H${W} Q${W / 2} ${2 * d} 0 0 Z`;
const linePath = (d) => `M0 0 Q${W / 2} ${2 * d} ${W} 0`;

export default function Loader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const rootRef = useRef(null);
  const fillRef = useRef(null);
  const lineRef = useRef(null);

  useLayoutEffect(() => {
    window.clearTimeout(window.__portfolioBootTimer);
    document.getElementById("bootstrap-loader")?.remove();
    document.documentElement.removeAttribute("data-app-booting");
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const start = performance.now();
    let raf, tl;

    const exit = () => {
      const root = rootRef.current;
      const travel = root.offsetHeight + 4; // +4px so the flat line fully leaves the screen
      const state = { p: 0 };

      tl = gsap.timeline({ delay: HOLD_S, onComplete: onDone });
      tl.to(state, {
        p: 1,
        duration: EXIT_S,
        ease: "power3.inOut",
        onUpdate: () => {
          const d = MAX_DEPTH * (1 - state.p); // flat exactly when it reaches the top
          gsap.set(root, { y: -travel * state.p });
          fillRef.current.setAttribute("d", fillPath(d));
          lineRef.current.setAttribute("d", linePath(d));
        },
      });
    };

    const tick = (now) => {
      const p = Math.min((now - start) / MIN_MS, 1);
      setProgress(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else exit();
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      tl?.kill();
      document.body.style.overflow = "";
    };
  }, [onDone]);

  const count = Array.isArray(greetings) ? greetings.length : 0;
  const idx = count ? Math.min(Math.floor(progress / 5), count - 1) : 0;
  const g = greetings[idx] ?? { text: "", script: "latin" };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 bg-bg text-fg font-light will-change-transform"
    >
      <div className="loader-glow" aria-hidden="true" />

      {/* greeting */}
      <div className="absolute inset-0 grid place-items-center px-4">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
          <p
            key={idx}
            className="text-center leading-tight text-[clamp(2.25rem,4.75vw,6rem)]"
            data-script={g.script}
          >
            {g.text}
          </p>
        </div>
      </div>

      {/* loading cue */}
      <div className="absolute left-[1.8vw] bottom-[2vw] max-sm:left-6 max-sm:top-6 max-sm:bottom-auto flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.35em] text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-accent/60 animate-pulse" />
        Loading Web Portfolio...
      </div>

      {/* counter */}
      <div className="absolute right-[2.2vw] bottom-[0.8vw] flex items-end leading-none">
        <span className="font-light tabular-nums tracking-tight text-[clamp(5rem,12.5vw,15rem)]">
          {progress}
        </span>
        <span className="mb-[2vw] ml-[0.4vw] font-light text-accent text-[clamp(1.25rem,2.6vw,3.25rem)]">
          %
        </span>
      </div>

      {/* elastic bottom edge: hangs below the loader, flattens as it rises */}
      <svg
        className="pointer-events-none absolute left-0 w-full h-[max(10vw,56px)] overflow-visible"
        style={{ top: "calc(100% - 1px)" }}
        viewBox={`0 0 ${W} 200`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path ref={fillRef} d={fillPath(MAX_DEPTH)} className="fill-bg" />
        <path
          ref={lineRef}
          d={linePath(MAX_DEPTH)}
          className="fill-none stroke-accent stroke-2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
