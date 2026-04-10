import React, { useEffect, useState } from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaBars } from "react-icons/fa";

import ThemeSwitcher from "./ThemeSwitcher";
import NavMenu from "./NavMenu";
import { useTheme } from "./useTheme";

const Navbar = () => {
  const [showBorder, setShowBorder] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById("hero");
      const heroBottom = hero?.getBoundingClientRect().bottom || 0;
      setShowBorder(heroBottom < 80);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 py-4 backdrop-blur-md">
      <div
        className={`w-full max-w-[790px] px-4 sm:px-6 py-4 mx-auto flex justify-between items-center rounded-xl transition-all duration-300
        bg-[var(--bg-primary)]
        ${showBorder ? "border border-[var(--border-primary)]" : ""}
      `}
      >
        {/* Logo */}
        <a
          href="#hero"
          className="text-xl font-logo tracking-wide transition
          text-[var(--text-primary)]
          hover:text-[var(--accent)]
          hover:scale-110"
        >
          rien–zi
        </a>

        {/* Right */}
        <div className="flex items-center space-x-4 text-lg text-[var(--text-primary)]">
          <a
            data-cursor="GitHub"
            className="p-2 rounded-md hover:scale-150 hover:rotate-12 hover:bg-transparent transition"
            href="https://github.com/rien-zi"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub />
          </a>
          <a
            data-cursor="LinkedIn"
            className="p-2 rounded-md hover:scale-150 hover:-rotate-12 hover:bg-transparent transition"
            href="https://linkedin.com/in/rien-zi"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedin />
          </a>
          <a
            data-cursor="Let's Connect?"
            className="p-2 rounded-md hover:scale-150 hover:rotate-12 hover:bg-transparent transition"
            href="mailto:renzil.digispec@gmail.com"
          >
            <FaEnvelope />
          </a>

          {/* Theme */}
          <ThemeSwitcher theme={theme} setTheme={setTheme} />

          {/* Menu */}
          <div className="relative">
            <button
              data-cursor="Explore..."
              onClick={() => setMenuOpen((p) => !p)}
              className="p-2 rounded-md hover:scale-150  hover:rotate-12 hover:bg-transparent transition"
            >
              <FaBars />
            </button>

            <NavMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
