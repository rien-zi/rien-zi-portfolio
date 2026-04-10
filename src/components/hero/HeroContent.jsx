import React from "react";
import FadeSlideIn from "../rss/FadeSlideIn";
import StaggerContainer from "../rss/StaggerContainer";

const HeroContent = () => {
  return (
    <div className="max-w-[750px] mx-auto text-center font-logo">
      <StaggerContainer>
        {/* 👋 Intro */}
        <FadeSlideIn direction="fade">
          <p
            data-cursor="Me"
            className="text-sm md:text-base mb-4 tracking-wide text-[var(--text-subtle)] uppercase"
          >
            Technical Architect
          </p>
        </FadeSlideIn>

        {/* 🔥 Name */}
        <FadeSlideIn direction="up">
          <h1
            data-cursor="Me"
            className="text-5xl md:text-7xl font-accent font-bold mb-6 leading-[1.05] tracking-tight text-[var(--text-primary)]"
          >
            Renzil Rodrigues
          </h1>
        </FadeSlideIn>

        {/* 🎯 Subtitle */}
        <FadeSlideIn direction="up">
          <h2
            data-cursor="My Work"
            className="text-xl md:text-2xl font-accent font-medium mb-6"
            style={{
              background:
                "linear-gradient(90deg, var(--accent), var(--text-primary))",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Building scalable systems, automation, and AI infrastructure
          </h2>
        </FadeSlideIn>

        {/* 🧠 Description */}
        <FadeSlideIn direction="up">
          <p
            data-cursor="My Work"
            className="font-accent text-lg md:text-xl text-[var(--text-muted)] mb-8 leading-relaxed"
          >
            I architect backend systems and intelligent workflows that scale
            reliably, reduce operational overhead, and enable high-leverage
            automation.
          </p>
        </FadeSlideIn>

        {/* 🧩 Tags */}
        <FadeSlideIn direction="scale">
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              "AI Systems",
              "Backend Architecture",
              "Automation",
              "Cloud Scaling",
            ].map((item) => (
              <span
                key={item}
                data-cursor="My Work"
                className="
                  px-3 py-1 text-xs rounded-full
                  border border-[var(--border-primary)]
                  text-[var(--text-subtle)]
                  hover:border-[var(--accent)]
                  hover:text-[var(--text-primary)]
                  transition
                "
              >
                {item}
              </span>
            ))}
          </div>
        </FadeSlideIn>

        {/* 🚀 CTA */}
        <FadeSlideIn direction="up">
          <div className="flex flex-wrap justify-center gap-4">
            <a
              data-cursor="🤩"
              data-cursor-variant="emoji"
              href="#contact"
              className="
                px-6 py-3 rounded-full font-accent
                bg-[var(--accent)]
                text-white
                hover:text-[var(--text-dark-btn)]
                shadow-[0_8px_30px_rgba(99,102,241,0.35)]
                hover:scale-[1.03]
                hover:shadow-[0_12px_40px_rgba(99,102,241,0.45)]
                transition
              "
            >
              Let’s Connect
            </a>

            <a
              data-cursor="🤝"
              data-cursor-variant="emoji"
              href="/resume.pdf"
              download
              className="
                px-6 py-3 rounded-full font-accent
                border border-[var(--border-primary)]
                text-[var(--text-muted)]
                hover:bg-[var(--hover-bg)]
                hover:text-[var(--text-primary)]
                hover:border-[var(--accent)]
                transition
              "
            >
              Download CV
            </a>
          </div>
        </FadeSlideIn>
      </StaggerContainer>
    </div>
  );
};

export default HeroContent;
