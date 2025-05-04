import React, { useEffect, useState } from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaBars } from "react-icons/fa";

const Navbar = () => {
  const [showBorder, setShowBorder] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById("hero");
      const heroBottom = hero?.getBoundingClientRect().bottom || 0;

      setShowBorder(heroBottom < 80); // 80 = navbar height + small margin
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // trigger on load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="fixed top-0 w-full z-50 py-4 backdrop-blur-md">
      <div
        className={`w-full max-w-[790px] px-4 sm:px-6 py-4 mx-auto flex justify-between items-center rounded-xl bg-darkbg transition-all duration-300 ${
          showBorder ? "border border-white/10" : "border-transparent"
        }`}
      >
        <a
          href="#hero"
          className="text-sm text-gray-300 font-logo tracking-wide text-xl hover:text-red-400 transition"
        >
          rien–zi
        </a>

        <div className="flex items-center space-x-4 text-gray-300 text-lg">
          <a
            href="https://github.com/rien-zi"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/renzil-rodrigues-089ba417a"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center"
          >
            <FaLinkedin />
          </a>
          <a
            href="mailto:renzil.digispec@gmail.com"
            className="flex items-center justify-center"
          >
            <FaEnvelope />
          </a>

          <div className="relative">
            <button
              onClick={toggleMenu}
              className="bg-transparent flex items-center justify-center"
            >
              <FaBars />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute top-12 right-0 w-48 bg-black/90 border border-white/10 rounded-lg shadow-lg py-2 text-sm z-50 backdrop-blur">
                <a
                  href="#projects"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-300 hover:bg-white/10 hover:text-white transition"
                >
                  My Projects
                </a>
                <a
                  href="#skills"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-300 hover:bg-white/10 hover:text-white transition"
                >
                  Skills & Stacks
                </a>
                <a
                  href="#career"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-300 hover:bg-white/10 hover:text-white transition"
                >
                  Career Journey
                </a>
                <a
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-300 hover:bg-white/10 hover:text-white transition"
                >
                  Contact Me
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
