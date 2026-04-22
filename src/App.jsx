import React, { useEffect, useState, Suspense, useRef } from "react";
import { Outlet } from "react-router-dom";

const Navbar = React.lazy(() => import("./components/navbar/Navbar"));
const Hero = React.lazy(() => import("./components/hero/Hero"));
const Projects = React.lazy(() => import("./components/projects/Projects"));
const Skills = React.lazy(() => import("./components/skills/Skills"));
const Career = React.lazy(() => import("./components/career/Career"));
const Contact = React.lazy(() => import("./components/contact/Contact"));

// import NetworkCanvas from "./components/rss/NetworkCanvas";

const ThreeParticleCanvas = React.lazy(
  () => import("./components/rss/ThreeParticleCanvas"),
);

function App() {
  const hasMountedCanvas = useRef(false);

  const [isDesktop, setIsDesktop] = useState(true);

  const [isLowPower] = useState(() => {
    if (typeof navigator === "undefined") return false;
    return (navigator.hardwareConcurrency || 4) <= 4;
  });

  const [showCanvas, setShowCanvas] = useState(false);

  const shouldRenderCanvas =
    isDesktop && !isLowPower && (showCanvas || hasMountedCanvas.current);

  useEffect(() => {
    if (shouldRenderCanvas) {
      hasMountedCanvas.current = true;
    }
  }, [shouldRenderCanvas]);

  useEffect(() => {
    if (isLowPower) return; // extra safety

    let triggered = false;

    const trigger = () => {
      if (triggered) return;
      triggered = true;

      // defer slightly to avoid blocking interaction frame
      requestAnimationFrame(() => {
        setShowCanvas(true);
      });

      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("mousemove", trigger);
      window.removeEventListener("scroll", trigger);
      window.removeEventListener("touchstart", trigger);
    };

    window.addEventListener("mousemove", trigger, { passive: true });
    window.addEventListener("scroll", trigger, { passive: true });
    window.addEventListener("touchstart", trigger, { passive: true });

    return cleanup;
  }, [isLowPower]);

  useEffect(() => {
    let raf;
    const check = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setIsDesktop(window.innerWidth >= 768);
      });
    };

    check();
    window.addEventListener("resize", check);

    return () => {
      window.removeEventListener("resize", check);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="relative scroll-smooth">
      {/* 🌐 GLOBAL CANVAS */}
      {shouldRenderCanvas && (
        <div className="fixed inset-0 z-0">
          <Suspense fallback={null}>
            <ThreeParticleCanvas />
          </Suspense>
        </div>
      )}

      {/* 🧱 CONTENT */}
      <div className="relative z-10">
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <main>
          <section id="hero">
            <Suspense fallback={null}>
              <Hero />
            </Suspense>
          </section>

          {/* Placeholder for next sections */}
          <section id="projects" className="min-h-screen p-10">
            <Suspense fallback={null}>
              <Projects />
            </Suspense>
          </section>

          <section id="skills" className="min-h-screen p-10">
            <Suspense fallback={null}>
              <Skills />
            </Suspense>
          </section>

          <section id="career" className="min-h-screen p-10">
            <Suspense fallback={null}>
              <Career />
            </Suspense>
          </section>

          <section id="contact" className="min-h-screen p-10">
            <Suspense fallback={null}>
              <Contact />
            </Suspense>
          </section>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
