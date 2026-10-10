import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Avatar } from "@bible-strong/avatar-react";
import {
  advanceAvatarPlayback, expressionFromDefinition, playAvatarAnimation,
  rotateExpressionAroundAxis, rotateExpressionWithArcball, sampleAvatarFrame,
} from "@bible-strong/avatar-core";
import "@bible-strong/avatar-react/styles.css";
import {
  createCubeeHeroDefinition, CUBEE_HELLO_DURATION_MS, CUBEE_REST_HEAD, headFromExpression,
} from "../../data/cubeeHero";
import "../css/Cubee.css";
import KyubeeConversation from "./KyubeeConversation";
import useKyubeeIdle from "./useKyubeeIdle";
import { animationPools, conversations, nextGesture, pickGreeting, sectionEntries, topicChoices } from "../../data/kyubeeConversations";
import prompts from "../../data/kyubeePrompts.json";
import { navigateToProject, navigateToSection } from "./pageNavigation";
import useCubeeFollower from "./useCubeeFollower";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const runtimeEnvironment = () => ({ random: Math.random, reduceMotion: reducedMotion() });
const themeColors = () => {
  const styles = getComputedStyle(document.documentElement);
  return {
    body: styles.getPropertyValue("--accent").trim() || "#d63a45",
    eyes: styles.getPropertyValue("--bg").trim() || "#1d1f1e",
  };
};

// Map local pointer coordinates to the renderer's 300-unit SVG viewport.
function pointerPoint(event) {
  const bounds = event.currentTarget.getBoundingClientRect();
  return [
    ((event.clientX - bounds.left) / bounds.width - 0.5) * 300,
    ((event.clientY - bounds.top) / bounds.height - 0.5) * 300,
  ];
}

export default function Cubee({ ready = true, page = "portfolio" }) {
  const [context, setContext] = useState({ section: "hero", compact: false });
  const [conversation, setConversation] = useState(null);
  const [history, setHistory] = useState([]);
  const hoverBagRef = useRef({});
  const journeyBagRef = useRef({});
  const conversationRef = useRef(null);
  const greetingRef = useRef(null);
  const gazeRef = useRef("right");
  const gazeTimerRef = useRef(null);
  const helloButtonRef = useRef(null);
  const anchorRef = useRef(null);
  const followerRef = useRef(null);
  const avatarRef = useRef(null);
  const dragRef = useRef(null);
  const pendingPoseRef = useRef(null);
  const frameRef = useRef(null);
  const playbackRef = useRef(null);
  const suppressClickRef = useRef(false);
  const introPlayedRef = useRef(false);
  const introTimerRef = useRef(null);
  const pendingHelloRef = useRef(false);
  const [restHead, setRestHead] = useState(CUBEE_REST_HEAD);
  const [isDragging, setDragging] = useState(false);
  const [isWaving, setWaving] = useState(false);
  const [colors, setColors] = useState(themeColors);
  const definition = useMemo(() => createCubeeHeroDefinition(restHead, colors), [restHead, colors]);

  useEffect(() => {
    const syncTheme = () => {
      avatarRef.current?.pause();
      playbackRef.current = null;
      pendingHelloRef.current = false;
      setWaving(false);
      const palette = themeColors();
      setColors((current) => current.body === palette.body && current.eyes === palette.eyes ? current : palette);
    };
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    // Navbar may restore a saved theme before this observer subscribes.
    const frame = window.requestAnimationFrame(syncTheme);
    return () => { observer.disconnect(); window.cancelAnimationFrame(frame); };
  }, []);

  const currentFrame = useCallback(() => {
    const playback = playbackRef.current;
    if (!playback) return {
      expression: expressionFromDefinition(avatarRef.current?.getState().activeExpression ?? "hero-rest", definition.expressions[avatarRef.current?.getState().activeExpression] ?? definition.expressions["hero-rest"]),
      colors: definition.colors,
    };
    const now = performance.now();
    const environment = runtimeEnvironment();
    playback.state = advanceAvatarPlayback(playback.definition, playback.state, now, environment);
    return sampleAvatarFrame(playback.definition, playback.state, now, environment);
  }, [definition]);

  const play = useCallback((animation) => {
    if (!ready || dragRef.current || !avatarRef.current) return false;
    const from = currentFrame();
    const now = performance.now();
    const state = avatarRef.current.getState();
    // A deliberate repeat is a new gesture, not a resume of an interrupted one.
    if (state.status === "paused" && state.activeAnimation === animation) avatarRef.current.stop();
    const result = avatarRef.current.play(animation);
    if (!result.ok) return false;
    // Mirror the public core timeline to grab the current animated pose on drag.
    const playback = playAvatarAnimation(definition, animation, now, from);
    if (playback.ok) playbackRef.current = { definition, state: playback.value };
    return true;
  }, [currentFrame, definition, ready]);

  const followJourney = useCallback(() => {
    if (conversationRef.current || isWaving || dragRef.current || avatarRef.current?.getState().status === "playing") return;
    introPlayedRef.current = true;
    window.clearTimeout(introTimerRef.current);
    play(nextGesture(animationPools.journey, journeyBagRef.current));
  }, [isWaving, play]);
  const updateContext = useCallback((next) => {
    setContext(next);
    conversationRef.current = null;
    setConversation(null);
    setHistory([]);
    window.clearTimeout(gazeTimerRef.current);
    avatarRef.current?.pause();
    playbackRef.current = null;
    setWaving(false);
    play("return-rest");
  }, [play]);
  useCubeeFollower(anchorRef, followerRef, ready, followJourney, updateContext, page);
  useKyubeeIdle(ready, () => followerRef.current?.dataset.occluded !== "true" && followerRef.current?.dataset.scrolling !== "true" && !dragRef.current && !isWaving && avatarRef.current?.getState().status !== "playing", play, () => Boolean(conversationRef.current));

  const lookAtConversation = useCallback((direction) => {
    gazeRef.current = direction;
    if (conversationRef.current && !dragRef.current && avatarRef.current?.getState().status !== "playing" && !reducedMotion()) play(`read-${direction}`);
  }, [play]);
  const closeConversation = (restoreFocus = true) => {
    conversationRef.current = null;
    setConversation(null);
    window.clearTimeout(gazeTimerRef.current);
    avatarRef.current?.pause();
    playbackRef.current = null;
    play("return-rest");
    setWaving(false);
    if (restoreFocus) helloButtonRef.current?.focus({ preventScroll: true });
  };
  const showConversation = (node) => { conversationRef.current = node; setConversation(node); };
  const [cueIndex, setCueIndex] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!document.hidden && !conversationRef.current && followerRef.current?.dataset.scrolling !== 'true') setCueIndex((value) => value + 1);
    }, 17000);
    return () => window.clearInterval(timer);
  }, []);
  const sectionPrompts = prompts[context.section] ?? [{ label: 'Worth a closer look?', target: sectionEntries[context.section] ?? 'hero' }];
  const cuePool = context.section !== 'games' && cueIndex % 4 === 3 ? prompts.invitations : sectionPrompts;
  const cue = cuePool[cueIndex % cuePool.length];
  const [loopEnabled, setLoopEnabled] = useState(true);
  useEffect(() => {
    const update = (event) => setLoopEnabled(event.detail.enabled);
    window.addEventListener('portfolio:loop-state', update);
    return () => window.removeEventListener('portfolio:loop-state', update);
  }, []);
  const selectChoice = (choice) => {
    if (choice.action === 'toggle-loop') {
      const enabled = !loopEnabled;
      window.dispatchEvent(new CustomEvent('portfolio:toggle-loop', { detail: { enabled } }));
      showConversation({ id: 'loop-state', text: enabled ? 'Round we go! The portfolio flows back into itself. You can turn it off here or in Utilities.' : 'One lap it is. Infinite scrolling is off; turn it back on whenever you fancy another round.', options: [{ label: enabled ? 'Disable infinite scroll' : 'Enable infinite scroll', action: 'toggle-loop' }, { label: 'Back to the beginning', target: 'hero', section: 'hero' }] });
      return;
    }
    if (choice.target === "greeting") { sayHello(); return; }
    const node = conversations[choice.target];
    if (!node) return;
    window.clearTimeout(gazeTimerRef.current);
    if (choice.project) { closeConversation(false); navigateToProject(choice.project); return; }
    if (choice.section) {
      closeConversation(false);
      navigateToSection(choice.section, choice.difficulty);
      return;
    }
    const previousNode = conversationRef.current;
    setHistory((previous) => [...previous, previousNode].filter(Boolean).slice(-40));
    setWaving(false);
    showConversation(node);
    avatarRef.current?.pause();
    playbackRef.current = null;
    play(reducedMotion() ? "return-rest" : choice.reaction ?? `gesture-${node.reaction}`);
  };
  const goBack = () => {
    const previous = history.at(-1);
    if (!previous) return;
    window.clearTimeout(gazeTimerRef.current);
    setHistory((trail) => trail.slice(0, -1));
    setWaving(false);
    showConversation(previous);
    avatarRef.current?.pause();
    playbackRef.current = null;
    play(reducedMotion() ? "return-rest" : "gesture-listening");
  };

  const markInteraction = () => {
    introPlayedRef.current = true;
    window.clearTimeout(introTimerRef.current);
  };

  const greet = () => {
    if (conversationRef.current || !ready || reducedMotion() || dragRef.current || isWaving) return;
    if (avatarRef.current?.getState().status === "playing") return;
    markInteraction();
    const animation = nextGesture(animationPools.hover, hoverBagRef.current);
    play(animation);
  };

  const sayHello = () => {
    markInteraction();
    if (!ready || dragRef.current || !avatarRef.current) return;
    avatarRef.current.pause();
    playbackRef.current = null;
    window.clearTimeout(gazeTimerRef.current);
    setHistory([]);
    pendingHelloRef.current = true;
    setRestHead({ ...CUBEE_REST_HEAD });
    setWaving(!reducedMotion());
    if (context.compact) {
      const node = conversations[cue.target] ?? conversations.hero;
      showConversation({ ...node,
        text: cue.target === 'games' && context.section !== 'games' ? `${cue.label} ${node.text}` : node.text,
        options: page.startsWith('project:') ? [{ label: 'Take me to the local demo', target: cue.target, section: 'project-demo', reaction: 'gesture-excited' }, ...node.options] : node.options,
      });
    }
    else {
      const greeting = pickGreeting(greetingRef.current);
      greetingRef.current = greeting.id;
      showConversation({ ...greeting, options: [
        { label: "A little tour", target: "hero", reaction: "gesture-waking" },
        { label: "Another hello", target: "greeting", reaction: "hello" },
        { label: "Cube playground", target: "playroom", reaction: "gesture-playful" },
      ] });
    }
  };

  // The child renderer resets its definition in a passive effect. Start the
  // greeting after that update so it uses the default angle and isn't canceled.
  useEffect(() => {
    if (!pendingHelloRef.current) return;
    pendingHelloRef.current = false;
    play(reducedMotion() ? "return-rest" : "hello");
  }, [play]);

  const finishAnimation = (animation) => {
    playbackRef.current = null;
    setWaving(false);
    window.clearTimeout(gazeTimerRef.current);
    if (conversationRef.current && !String(animation).startsWith("read-") && !reducedMotion()) {
      gazeTimerRef.current = window.setTimeout(() => play(`read-${gazeRef.current}`), 250);
    }
  };

  useEffect(() => {
    if (!ready || introPlayedRef.current || reducedMotion()) return;
    introTimerRef.current = window.setTimeout(() => {
      introPlayedRef.current = true;
      play("wink");
    }, 1100);
    return () => window.clearTimeout(introTimerRef.current);
  }, [play, ready]);

  useEffect(() => {
    const reactToGame = (event) => {
      const animation = event.detail?.animation;
      if (!ready || dragRef.current || isWaving || reducedMotion() || !definition.animations[animation]) return;
      window.clearTimeout(gazeTimerRef.current);
      play(animation);
    };
    window.addEventListener("kyubee:game-reaction", reactToGame);
    return () => window.removeEventListener("kyubee:game-reaction", reactToGame);
  }, [definition, isWaving, play, ready]);

  useEffect(() => () => { window.cancelAnimationFrame(frameRef.current); window.clearTimeout(gazeTimerRef.current); }, []);

  const startDrag = (event) => {
    if (!ready || event.button !== 0) return;
    markInteraction();
    conversationRef.current = null;
    setConversation(null);
    window.clearTimeout(gazeTimerRef.current);
    const pose = currentFrame().expression;
    avatarRef.current?.pause();
    playbackRef.current = null;
    setWaving(false);
    setRestHead(headFromExpression(pose));
    suppressClickRef.current = false;
    pendingPoseRef.current = null;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX, startY: event.clientY,
      point: pointerPoint(event), pose, moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const moveDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (!drag.moved && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 4) return;
    drag.moved = true;
    const point = pointerPoint(event);
    drag.pose = rotateExpressionWithArcball(drag.pose, drag.point, point);
    drag.point = point;
    pendingPoseRef.current = headFromExpression(drag.pose);
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      if (pendingPoseRef.current) setRestHead(pendingPoseRef.current);
    });
  };

  const finishDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    window.cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    if (pendingPoseRef.current) setRestHead(pendingPoseRef.current);
    suppressClickRef.current = drag.moved || event.type === "pointercancel";
    dragRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const rotateWithKeyboard = (event) => {
    const turns = { ArrowLeft: ["y", -15], ArrowRight: ["y", 15], ArrowUp: ["x", -15], ArrowDown: ["x", 15] };
    const turn = turns[event.key];
    if (!turn) return;
    event.preventDefault();
    markInteraction();
    conversationRef.current = null;
    setConversation(null);
    window.clearTimeout(gazeTimerRef.current);
    const pose = currentFrame().expression;
    avatarRef.current?.pause();
    playbackRef.current = null;
    setWaving(false);
    setRestHead(headFromExpression(rotateExpressionAroundAxis(pose, turn[0], turn[1])));
  };

  return (
    <>
    <div ref={anchorRef} className={`cubee-anchor${page !== "portfolio" ? " cubee-anchor-game" : ""}`} aria-hidden="true" />
    {createPortal(<div
      ref={followerRef}
      className="cubee-follower"
      data-dragging={isDragging}
      data-conversation-open={Boolean(conversation)}
      inert={!ready}
      aria-hidden={!ready || undefined}
      style={{ visibility: ready ? "visible" : "hidden" }}
    ><div
      className={`cubee-companion${isDragging ? " is-dragging" : ""}`}
      style={{ "--cubee-body": definition.colors.body, "--cubee-eyes": definition.colors.eyes, "--wave-duration": `${CUBEE_HELLO_DURATION_MS}ms` }}
    >
      <div className="cubee-stage">
        <button
          className="cubee-button"
          type="button"
          onPointerEnter={(event) => { if (event.pointerType === "mouse" || event.pointerType === "pen") greet(); }}
          onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) greet(); }}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          onLostPointerCapture={finishDrag}
          onKeyDown={rotateWithKeyboard}
          onClick={(event) => {
            if (suppressClickRef.current && event.detail !== 0) { suppressClickRef.current = false; return; }
            sayHello();
          }}
          aria-label="Kyubee. Drag or use arrow keys to rotate. Click or press Enter to reset and say hello."
          data-cursor
        >
          <span className="cubee-art" aria-hidden="true">
            <Avatar
              ref={avatarRef}
              definition={definition}
              defaultExpression="hero-rest"
              size="100%"
              ariaLabel="Kyubee"
              onAnimationEnd={finishAnimation}
            />
          </span>
          {isWaving && (
            <svg className="cubee-hand" viewBox="0 0 112 132" aria-hidden="true">
              <path d="M32 121 L32 113 C24 106 19 96 15 88 L6 72 C2 65 5 57 11 55 C17 53 23 56 26 62 L31 72 L31 37 C31 25 46 25 46 37 L46 64 Q46 69 49 64 L49 19 C49 6 65 6 65 19 L65 64 Q65 69 68 64 L68 28 C68 16 83 16 83 28 L83 68 Q83 73 86 68 L86 49 C86 37 101 37 101 49 L101 84 C101 104 84 111 84 121 Z" />
              <path className="cubee-hand-crease" d="M32 77 Q49 74 56 85 M34 116 Q58 123 82 116" />
            </svg>
          )}
        </button>
      </div>
      <button ref={helloButtonRef} type="button" className="cubee-hello" onClick={sayHello} title={context.compact ? cue.label : "Say hello"} aria-haspopup="dialog" aria-expanded={Boolean(conversation)} aria-label={context.compact ? cue.label : "Reset Kyubee’s rotation and say hello"} data-cursor>
        <span className="cubee-hello-label">{context.compact ? cue.label : "Say hello"}</span><span className="cubee-hello-arrow" aria-hidden="true">↗</span>
        <svg className="cubee-hello-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 4h14v12H9l-4 4V4Z" /><path d="M8 8h8M8 12h5" /></svg>
      </button>
      <span className="sr-only" role="status">{isWaving ? "Kyubee says hello!" : ""}</span>
    </div></div>, document.body)}
    {conversation && <KyubeeConversation canGoBack={history.length > 0} onBack={goBack} topics={page !== "portfolio" ? [...topicChoices, { label: loopEnabled ? "Disable infinite scroll ∞" : "Enable infinite scroll ∞", action: "toggle-loop" }, { label: "Back to portfolio", target: "hero", section: "portfolio" }] : [...topicChoices, { label: loopEnabled ? "Disable infinite scroll ∞" : "Enable infinite scroll ∞", action: "toggle-loop" }, { label: "Back to the beginning ↑", target: "hero", section: "hero" }]} node={conversation} followerRef={followerRef} onSelect={selectChoice} onClose={closeConversation} onPosition={lookAtConversation} />}
    </>
  );
}
