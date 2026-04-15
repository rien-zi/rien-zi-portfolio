import React, { useEffect, useRef } from "react";

const FloatingIcon = ({ icon, index, scrollY, intensity }) => {
  const ref = useRef(null);

  const basePositions = [
    { x: 8, y: 10 },
    { x: 75, y: 20 },
    { x: 10, y: 60 },
    { x: 78, y: 80 },
    { x: 12, y: 40 },
    { x: 80, y: 55 },
  ];

  const base = basePositions[index % basePositions.length];
  const current = useRef({ x: 0, y: 0, r: 0 });

  const depth = index % 3;

  const config = [
    { speed: 0.08, scale: 1.1, opacity: 0.3 },
    { speed: 0.12, scale: 1.4, opacity: 0.5 },
    { speed: 0.18, scale: 1.7, opacity: 0.75 },
  ][depth];

  useEffect(() => {
    let raf;

    const animate = () => {
      const targetX =
        Math.sin(scrollY * 0.002 + index) * (60 * intensity) +
        index * (10 * intensity);

      const targetY =
        scrollY * config.speed +
        Math.cos(scrollY * 0.002 + index) * (40 * intensity);

      current.current.x += (targetX - current.current.x) * 0.08;
      current.current.y += (targetY - current.current.y) * 0.08;

      current.current.r += 0.05 + depth * 0.03;

      if (ref.current) {
        ref.current.style.transform = `
          translate(${current.current.x}px, ${current.current.y}px)
          rotate(${current.current.r}deg)
          scale(${config.scale})
        `;
      }

      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf);
  }, [scrollY, index, intensity]);

  return (
    <div
      ref={ref}
      className="absolute"
      style={{
        top: `${base.y}%`,
        left: `${base.x}%`,
        opacity: config.opacity,
      }}
    >
      <div
        className="text-[32px] text-[var(--accent)]"
        style={{ mixBlendMode: "screen" }}
      >
        {icon}
      </div>
    </div>
  );
};

const FloatingIconsScene = ({
  icons = [],
  scrollY = 0,
  density = 3,
  intensity = 1,
  mask = true,
}) => {
  const expandedIcons = icons.flatMap((icon) => Array(density).fill(icon));

  return (
    <>
      {/* CENTER MASK */}
      {mask && (
        <div
          className="pointer-events-none absolute inset-0 z-5"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, rgba(15,16,16,0.9) 35%, rgba(15,16,16,0.9) 65%, transparent 100%)",
          }}
        />
      )}

      {/* FLOATING LAYER */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        {expandedIcons.map((icon, i) => (
          <FloatingIcon
            key={i}
            icon={icon}
            index={i}
            scrollY={scrollY}
            intensity={intensity}
          />
        ))}
      </div>
    </>
  );
};

export default FloatingIconsScene;
