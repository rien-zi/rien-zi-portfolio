import { getPortfolioScrollMetrics } from './portfolioScroll';
import { useEffect, useState } from 'react';
export default function ScrollProgress() {
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    let frame;
    const update = () => {
      frame = null;
      const { position, total } = getPortfolioScrollMetrics();
      setPercent(total > 0 ? Math.round(Math.max(0, Math.min(1, position / total)) * 100) : 0);
    };
    const schedule = () => { if (frame == null) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    resize.observe(document.documentElement);
    const main = document.querySelector('main');
    if (main) resize.observe(main);
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('portfolio:loop-layout', schedule);
    return () => { cancelAnimationFrame(frame); resize.disconnect(); window.removeEventListener('portfolio:loop-layout', schedule); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);
  const circumference = 2 * Math.PI * 16;
  return <div className="nav-progress" role="progressbar" aria-label="Portfolio scroll progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
    <svg viewBox="0 0 40 40" aria-hidden="true"><circle className="nav-progress-track" cx="20" cy="20" r="16" /><circle className="nav-progress-value" cx="20" cy="20" r="16" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - percent / 100)} /></svg>
    <span aria-hidden="true">{percent}%</span>
  </div>;
}
