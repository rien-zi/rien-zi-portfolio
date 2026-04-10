import React from "react";
import Navbar from "./components/navbar/Navbar";
import Hero from "./components/hero/Hero";
import Projects from "./components/projects/Projects";
import Skills from "./components/skills/Skills";
import Career from "./components/career/Career";
import Contact from "./components/contact/Contact";
import NetworkCanvas from "./components/rss/NetworkCanvas";

function App() {
  return (
    <div className="relative scroll-smooth">
      {/* 🌐 GLOBAL MESH */}
      <div className="fixed inset-0 z-0">
        <NetworkCanvas />
      </div>

      {/* 🧱 CONTENT */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <section id="hero">
            <Hero />
          </section>

          {/* Placeholder for next sections */}
          <section id="projects" className="min-h-screen p-10">
            <Projects />
          </section>

          <section id="skills" className="min-h-screen p-10">
            <Skills />
          </section>

          <section id="career" className="min-h-screen p-10">
            <Career />
          </section>

          <section id="contact" className="min-h-screen p-10">
            <Contact />
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
