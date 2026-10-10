export function navigateToSection(section, difficulty) {
  window.dispatchEvent(new CustomEvent('portfolio:navigate', { detail: { section, difficulty } }));
}
export function navigateToProject(project) {
  window.dispatchEvent(new CustomEvent('portfolio:navigate', { detail: { project } }));
}
export const isGameLocation = () => /^\/games\/?$/.test(window.location.pathname);
export function getPageLocation() {
  if (isGameLocation()) return 'games';
  const match = window.location.pathname.match(/^\/work\/([^/]+)\/?$/);
  return match ? `project:${decodeURIComponent(match[1])}` : 'portfolio';
}
