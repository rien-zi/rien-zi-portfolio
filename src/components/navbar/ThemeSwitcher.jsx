import React, { useEffect, useRef, useState } from "react";
import { FaPalette, FaMoon, FaSun } from "react-icons/fa";
import { MdOutlineColorLens } from "react-icons/md";

const themes = [
  { name: "dark", icon: <FaMoon />, color: "#0f1115" },
  { name: "light", icon: <FaSun />, color: "#ffffff" },
  { name: "aurora", icon: <MdOutlineColorLens />, color: "#38bdf8" },
  { name: "solarized", icon: <MdOutlineColorLens />, color: "#b58900" },
  { name: "neon", icon: <MdOutlineColorLens />, color: "#39ff14" },
  { name: "dracula", icon: <MdOutlineColorLens />, color: "#ff79c6" },
];

const ThemeSwitcher = ({ theme, setTheme }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        data-cursor="Change Theme"
        className="p-2 rounded-md hover:scale-150 hover:-rotate-12 transition hover:bg-transparent text-[var(--accent)]"
      >
        <FaPalette />
      </button>

      {open && (
        <div
          className="absolute right-0 top-12 w-44 p-3 rounded-xl z-50
          bg-[var(--bg-overlay)]
          border border-[var(--border-primary)]
          shadow-[var(--shadow-md)]
          backdrop-blur"
        >
          <div className="grid grid-cols-3 gap-2">
            {themes.map((t) => (
              <button
                key={t.name}
                onClick={() => {
                  setTheme(t.name);
                  setOpen(false);
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-md text-xs
                transition duration-200 ease-out
                hover:scale-150

                ${theme === t.name ? "border border-[var(--accent)] scale-150" : ""}
                `}
              >
                <div
                  className="w-4 h-4 rounded-full mb-1"
                  style={{ backgroundColor: t.color }}
                />
                {t.icon}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
