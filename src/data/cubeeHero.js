import { expressionFromDefinition, rotateExpressionAroundAxis } from "@bible-strong/avatar-core";
import definition from "./cubee.avatar.json";

export const CUBEE_REST_HEAD = { x: -6, y: -12, z: -5 };
export const headFromExpression = (expression) => ({
  x: expression.headX, y: expression.headY, z: expression.headZ,
});
const step = (expression, transitionMs, holdMs = 100) => ({
  expression, transitionMs, holdMs, transition: "smooth",
});
const once = (label, steps) => ({
  playbackMode: "once", steps,
  blink: { enabled: false, initialDelayMs: 0, minIntervalMs: 1000, maxIntervalMs: 1000, durationMs: 180 },
  metadata: { label },
});

// Keep the export intact; gestures start and finish at the chosen drag angle.
export function createCubeeHeroDefinition(head = CUBEE_REST_HEAD, colors = definition.colors) {
  const rest = { ...definition.expressions.neutral, head };
  const coreRest = expressionFromDefinition("hero-rest", rest);
  const turn = (axis, degrees) => ({
    ...rest,
    head: headFromExpression(rotateExpressionAroundAxis(coreRest, axis, degrees)),
  });
  const expressions = {
    "hero-rest": rest,
    "idle-left": turn("y", -14),
    "idle-right": turn("y", 14),
    "idle-blink": { ...rest, eyes: { ...rest.eyes, left: { ...rest.eyes.left, height: 3 }, right: { ...rest.eyes.right, height: 3 } } },
    "read-left": turn("y", -20),
    "read-right": turn("y", 20),
    "read-up": turn("x", -14),
    "read-down": turn("x", 14),
    "hero-orbit-one": turn("y", 90),
    "hero-orbit-two": turn("y", 180),
    "hero-orbit-three": turn("y", 270),
    "hero-orbit-four": turn("y", 360),
    "hero-look-left": turn("y", -25),
    "hero-look-right": turn("y", 25),
    "hero-nod": turn("x", -16),
    "hero-tilt-left": turn("z", -10),
    "hero-tilt-right": turn("z", 10),
    "hero-wink": {
      ...turn("z", -3),
      eyes: { ...rest.eyes, right: { ...rest.eyes.right, height: 3, angle: -8 } },
    },
  };
  const animations = {
    "return-rest": once("Back to the tour", [step("hero-rest", 600)]),
    ...Object.fromEntries(["left", "right", "up", "down"].map((direction) => [
      `read-${direction}`, once("Reading along", [step(`read-${direction}`, 650, 100)]),
    ])),
    "idle-blink": once("A quiet blink", [step("idle-blink", 90), step("hero-rest", 160)]),
    "idle-search": once("Looking around", [step("idle-left", 900, 400), step("idle-right", 1200, 400), step("hero-rest", 900)]),
    "idle-peek": once("A curious glance", [step("idle-right", 800, 500), step("hero-rest", 900)]),
    "follow-turn": once("Following along", [
      step("hero-look-right", 280), step("hero-tilt-left", 240), step("hero-rest", 320),
    ]),
    wink: once("Wink", [step("hero-rest", 0), step("hero-wink", 150, 180), step("hero-rest", 280)]),
    "hover-orbit": once("A turn and a wink", [
      step("hero-orbit-one", 360), step("hero-orbit-two", 360),
      step("hero-orbit-three", 360), step("hero-orbit-four", 360),
      step("hero-wink", 180, 160), step("hero-rest", 280),
    ]),
    "hover-greeting": once("A curious hello", [
      step("hero-look-left", 300, 160), step("hero-look-right", 380, 160),
      step("hero-nod", 260), step("hero-wink", 200, 180), step("hero-rest", 300),
    ]),
    hello: once("Hello", [
      step("hero-nod", 180, 120), step("hero-tilt-left", 260),
      step("hero-tilt-right", 260), step("hero-tilt-left", 240),
      step("hero-wink", 150, 150), step("hero-rest", 300, 120),
    ]),
  };
  // Reuse every original pattern, with shorter holds and a definite resting end.
  // Keep the exported loops intact for any future consumer.
  for (const [name, pattern] of Object.entries(definition.animations)) {
    animations[`gesture-${name}`] = once(pattern.metadata?.label ?? name,
      [...pattern.steps.map((frame, index) => step(frame.expression,
        Math.max(280, Math.min(600, frame.transitionMs)),
        name === "sleeping" ? 650 : 320 + (index % 3) * 100)), step("hero-rest", 550, 100)]);
  }
  return {
    ...definition,
    colors,
    expressions: {
      ...Object.fromEntries(Object.entries(definition.expressions)
        .map(([key, expression]) => [key, { ...expression, colors }])),
      ...expressions,
    },
    expressionOrder: [...definition.expressionOrder, ...Object.keys(expressions)],
    animations: { ...definition.animations, ...animations },
    animationOrder: [...definition.animationOrder, ...Object.keys(animations)],
  };
}
export const cubeeHeroDefinition = createCubeeHeroDefinition();
export const CUBEE_HELLO_DURATION_MS = cubeeHeroDefinition.animations.hello.steps
  .reduce((duration, frame) => duration + frame.transitionMs + frame.holdMs, 0);
