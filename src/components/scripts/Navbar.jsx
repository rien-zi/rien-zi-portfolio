import { useEffect, useState } from "react";
import "../css/Navbar.css";
import ScrollProgress from "./ScrollProgress";
import { navigateToSection } from "./pageNavigation";

export default function Navbar({ ready = true, gamePage = false, projectPage = false, loop }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [utilitiesOpen, setUtilitiesOpen] = useState(false);

  useEffect(() => {
    let savedTheme;
    try { savedTheme = localStorage.getItem("theme"); } catch { /* Storage may be blocked by the browser. */ }

    if (savedTheme === "light" || savedTheme === "dark") {
      document.documentElement.setAttribute("data-theme", savedTheme);
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", savedTheme === "light" ? "#c5c5c5" : "#1d1f1e");
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;

    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", next);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", getComputedStyle(root).getPropertyValue("--bg").trim());
    try { localStorage.setItem("theme", next); } catch { /* Theme switching still works without persistence. */ }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    if (!menuOpen && !utilitiesOpen) return;
    const dismiss = (event) => {
      if (event.key === "Escape") { setMenuOpen(false); setUtilitiesOpen(false); }
      if (event.type === "pointerdown" && !event.target.closest(".hero-navbar")) { setMenuOpen(false); setUtilitiesOpen(false); }
    };
    window.addEventListener("keydown", dismiss);
    window.addEventListener("pointerdown", dismiss);
    return () => { window.removeEventListener("keydown", dismiss); window.removeEventListener("pointerdown", dismiss); };
  }, [menuOpen, utilitiesOpen]);

  return (
    <header className="hero-navbar" inert={!ready} aria-hidden={!ready || undefined} style={{ visibility: ready ? "visible" : "hidden" }}>
      {gamePage || projectPage ? <button type="button" className="nav-exit" onClick={() => navigateToSection(projectPage ? "work" : "portfolio")} data-cursor><span aria-hidden="true">←</span> {projectPage ? "Back to work" : "Exit game"}</button> : <button
        type="button"
        className="nav-menu"
        onClick={() => { setUtilitiesOpen(false); setMenuOpen((value) => !value); }}
        data-cursor
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="hero-navigation"
      >
        <span />
        <span />
        <span />
      </button>}

      <a className="nav-logo" href="#hero" aria-label="Back to the beginning" onClick={(event) => { closeMenu(); if (gamePage || projectPage) { event.preventDefault(); navigateToSection("portfolio"); } }} data-cursor>RIEN</a>

      <div className="nav-actions">
      {!gamePage && <><ScrollProgress />
      </>}
      <button type="button" className="nav-utilities" onClick={() => { setMenuOpen(false); setUtilitiesOpen((value) => !value); }} aria-label="Portfolio utilities" aria-expanded={utilitiesOpen} aria-controls="portfolio-utilities" title="Utilities">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><path d="M14 17.5h7m-3.5-3.5v7"/></svg>
      </button>

      <button
        type="button"
        className="nav-theme"
        onClick={toggleTheme}
        data-cursor
        aria-label="Toggle theme"
      >
        <span className="theme-icon" />
      </button>

      </div>
      {utilitiesOpen && <nav id="portfolio-utilities" className="nav-utilities-panel" aria-label="Portfolio utilities">
        <a href="/games" onClick={(event) => { event.preventDefault(); setUtilitiesOpen(false); navigateToSection('games'); }}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 7h10c2 0 3 2 3.5 4l1 6c.3 2-1.5 3-3 2l-3-3h-7l-3 3c-1.5 1-3.3 0-3-2l1-6C4 9 5 7 7 7Z"/><path d="M7 10v4m-2-2h4"/><circle cx="17" cy="12" r="1"/></svg><span>Play a game</span></a>
        <button type="button" className={loop?.enabled ? 'is-enabled' : ''} aria-pressed={loop?.enabled ?? true} onClick={() => loop?.setEnabled((value) => !value)}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 12c-3-5-5-6-7-5-4 2-4 8 0 10 2 1 4 0 7-5 3-5 5-6 7-5 4 2 4 8 0 10-2 1-4 0-7-5Z"/></svg><span>Infinite scroll <small>{loop?.enabled ? 'On' : 'Off'}</small></span></button>
      </nav>}
      {menuOpen && !gamePage && !projectPage && (
        <nav
          id="hero-navigation"
          className="nav-overlay"
          aria-label="Main navigation"
        >
          <a href="#about" data-cursor onClick={closeMenu}>
            About
          </a>

          <a href="#work" data-cursor onClick={closeMenu}>
            Work
          </a>
          <a href="#career" data-cursor onClick={closeMenu}>Career</a>
          <a href="#skills" data-cursor onClick={closeMenu}>Capabilities</a>

          <a href="/games" data-cursor onClick={(event) => { event.preventDefault(); closeMenu(); navigateToSection("games"); }}>Play / Tic Tac Toe</a>
          <a href="#contact" data-cursor onClick={closeMenu}>
            Contact
          </a>
        </nav>
      )}
    </header>
  );
}
