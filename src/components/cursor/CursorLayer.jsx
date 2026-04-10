import { useEffect } from "react";
import { useCursor } from "./CursorContext";

export default function CursorLayer() {
  const { updateCursor, resetCursor } = useCursor();

  useEffect(() => {
    const handleEnter = (e) => {
      const target = e.target.closest("[data-cursor]");
      if (!target) return;

      const label = target.getAttribute("data-cursor");
      const variant = target.getAttribute("data-cursor-variant") || "pill";

      updateCursor({ label, variant });
    };

    const handleLeave = (e) => {
      const related = e.relatedTarget;
      if (related && related.closest("[data-cursor]")) return;
      resetCursor();
    };

    document.addEventListener("mouseover", handleEnter);
    document.addEventListener("mouseout", handleLeave);

    return () => {
      document.removeEventListener("mouseover", handleEnter);
      document.removeEventListener("mouseout", handleLeave);
    };
  }, []);

  return null;
}
