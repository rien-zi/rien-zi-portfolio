const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const mix = (from, to, progress) => from + (to - from) * progress;
export const CUBEE_CORNERS = ['bottom-right', 'top-left', 'bottom-left', 'top-right'];

function overlaps(a, b) {
  const gap = 8;
  return a.x < b.x + b.width + gap && a.x + a.width > b.x - gap
    && a.y < b.y + b.height + gap && a.y + a.height > b.y - gap;
}

// Random preferences come from the hook, so a scroll frame never rerolls a landing.
export function getCubeeJourney({ scrollY, maxScroll, heroHeight, anchor, viewport, obstacles = [], previousCorner, preferredCorner = 'bottom-right', journeyKey = 0, compactOnly = false, keepCorner = false, heroTravel }) {
  const mobile = viewport.width <= 760;
  const edge = mobile ? 12 : 20;
  let destination;
  let size = mobile ? 104 : 128;
  for (const candidateSize of [size, 96, 80, 64]) {
    if (candidateSize > size || candidateSize + edge * 2 > viewport.width) continue;
    const height = candidateSize + 44;
    const right = Math.max(edge, viewport.width - edge - candidateSize);
    // Leave the browser-safe top region available to navigation controls.
    const top = 84;
    const bottom = Math.max(top, viewport.height - edge - height);
    const corners = {
      'bottom-right': { x: right, y: bottom }, 'top-left': { x: edge, y: top },
      'bottom-left': { x: edge, y: bottom }, 'top-right': { x: right, y: top },
    };
    const clear = Object.entries(corners).filter(([, point]) => point.y + height <= viewport.height - edge
      && !obstacles.some((obstacle) => overlaps({ ...point, width: candidateSize, height }, obstacle)));
    if (!clear.length) continue;
    destination = (keepCorner ? clear.find(([corner]) => corner === previousCorner) : null)
      ?? clear.find(([corner]) => corner === preferredCorner)
      ?? clear.find(([corner]) => corner === previousCorner) ?? clear[0];
    size = candidateSize;
    break;
  }
  // Keep a crowded-view landing stable for the entire scroll gesture.
  if (keepCorner && previousCorner?.includes("rail")) destination = null;
  const exitDistance = Math.min(heroHeight * .5, maxScroll * .38);
  const travel = heroTravel ?? (compactOnly ? 1 : exitDistance > 0 ? clamp(scrollY / exitDistance, 0, 1) : 0);
  const eased = travel * travel * (3 - 2 * travel);
  // The content layout reserves a slim right gutter for crowded moments.
  const rail = !destination;
  if (rail) size = 44;
  const railSlots = ['right-rail-top', 'right-rail-middle', 'right-rail-bottom'];
  const railCorner = keepCorner && railSlots.includes(previousCorner) ? previousCorner : railSlots[journeyKey % railSlots.length];
  const railY = { 'right-rail-top': 100, 'right-rail-middle': viewport.height * .5 - 44, 'right-rail-bottom': viewport.height - 108 };
  const [corner, point] = destination ?? [railCorner, {
    x: viewport.width - 52,
    y: Math.max(84, Math.min(viewport.height - 100, railY[railCorner])),
  }];
  return {
    x: mix(anchor.x, point.x, eased), y: mix(anchor.y, point.y, eased),
    width: mix(anchor.width, size, eased), docked: travel >= .98,
    occluded: false, rail: rail && travel >= .98,
    corner, phase: travel === 0 ? 'hero' : `${journeyKey}-${corner}`,
  };
}
