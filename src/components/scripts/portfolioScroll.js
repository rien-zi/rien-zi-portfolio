export function getPortfolioScrollMetrics() {
  const cycle = document.querySelector('[data-portfolio-cycle]');
  if (cycle && document.documentElement.dataset.portfolioLoop === 'true') {
    const height = cycle.getBoundingClientRect().height;
    const start = cycle.getBoundingClientRect().top + window.scrollY;
    const relative = window.scrollY - start;
    const wrapped = height > 0 ? ((relative % height + height) % height) : 0;
    // Native scroll offsets can round a fractional cycle start down by a pixel.
    const position = Math.abs(relative) < 1 || height - wrapped < 1 ? 0 : wrapped;
    return { position, total: height, looping: true };
  }
  return { position: window.scrollY, total: Math.max(0, document.documentElement.scrollHeight - window.innerHeight), looping: false };
}
