import { useEffect, useState } from "react";
import { useCursor } from "./CursorContext";

export default function CustomCursor() {
  const { cursor } = useCursor();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // ❌ Disable completely if no label
  if (!cursor.label) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{
        transform: `translate(${pos.x + 12}px, ${pos.y + 12}px)`, // slight offset (feels native)
      }}
    >
      <div
        className={`
          px-3 py-1 rounded-full text-xs font-medium
          transition-all duration-150 ease-out

          ${
            cursor.variant === "pill" &&
            `
            bg-[var(--accent)] text-white font-accent
          `
          }

          ${
            cursor.variant === "pill2" &&
            `
            bg-[var(--accent-2)] text-white font-accent
          `
          }

          ${
            cursor.variant === "pillwhite" &&
            `
            bg-transparent border border-[var(--accent)] text-white font-accent text-xl
          `
          }

          ${
            cursor.variant === "emoji" &&
            `
            text-6xl
          `
          }
        `}
      >
        {cursor.label}
      </div>
    </div>
  );
}
