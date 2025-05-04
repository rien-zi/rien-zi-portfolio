import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Career from "./components/Career";
import Contact from "./components/Contact";

function App() {
  return (
    <div className="scroll-smooth">
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
  );
}

export default App;
