import React, { useState } from "react";
import { Link } from "react-router-dom";
import FadeSlideIn from "../rss/FadeSlideIn";
import StaggerContainer from "../rss/StaggerContainer";

const projects = [
  {
    title: "Chat Evaluation Engine",
    subtitle: "Conversation intelligence system",
    description:
      "High-throughput evaluation engine with modular SQL pipelines, supporting complex presence logic and multi-phase scoring.",
    link: "/projects/cs/audit",
  },
  {
    title: "Kairo — AI CX Automation",
    subtitle: "SOP-driven AI system",
    description:
      "Enterprise AI system combining RAG, embeddings, and structured SOP logic to automate customer support workflows.",
    link: "/projects/cs/resolute",
  },
  {
    title: "AI Chat Auditing System",
    subtitle: "RAG + Guardrails + Scoring",
    description:
      "AI-powered auditing system with persona guardrails, weighted scoring, and contextual evaluation at scale.",
    link: "/projects/cs/anomaly",
  },
  {
    title: "Other Work",
    subtitle: "Automation + Campaign Systems",
    description:
      "SendGrid campaigns, Freshdesk automation, Klaxon ticketing agent, and Python workflow pipelines.",
    link: "/projects/cs/training",
  },
];

const Projects = () => {
  const [active, setActive] = useState(null);

  return (
    <section id="projects" className="relative py-20">
      <div className="max-w-[1200px] mx-auto px-4 font-accent">
        <StaggerContainer>
          {/* TITLE */}
          <FadeSlideIn direction="fade">
            <h2 className="font-logo text-3xl md:text-5xl text-center text-[var(--text-subtle)] mb-16">
              Selected Work
            </h2>
          </FadeSlideIn>

          {/* ✅ TRUE BENTO GRID */}
          <div
            className="
              grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 
              md:grid-rows-[auto_auto] 
              gap-6
            "
          >
            {/* BIG TOP LEFT */}
            <div
              data-cursor="Click to Know More"
              className="md:col-start-1 md:col-span-3 md:row-start-1"
            >
              <FadeSlideIn direction="up">
                <BentoCard
                  project={projects[0]}
                  active={active === 0}
                  onClick={() => setActive(active === 0 ? null : 0)}
                />
              </FadeSlideIn>
            </div>

            {/* SMALL TOP RIGHT */}
            <div
              data-cursor="Click to Know More"
              className="md:col-start-4 md:row-start-1"
            >
              <FadeSlideIn direction="up">
                <BentoCard
                  project={projects[1]}
                  active={active === 1}
                  onClick={() => setActive(active === 1 ? null : 1)}
                />
              </FadeSlideIn>
            </div>

            {/* SMALL BOTTOM LEFT */}
            <div
              data-cursor="Click to Know More"
              className="md:col-start-1 md:row-start-2"
            >
              <FadeSlideIn direction="up">
                <BentoCard
                  project={projects[2]}
                  active={active === 2}
                  onClick={() => setActive(active === 2 ? null : 2)}
                />
              </FadeSlideIn>
            </div>

            {/* BIG BOTTOM RIGHT */}
            <div
              data-cursor="Click to Know More"
              className="md:col-start-2 md:col-span-3 md:row-start-2"
            >
              <FadeSlideIn direction="up">
                <BentoCard
                  project={projects[3]}
                  active={active === 3}
                  onClick={() => setActive(active === 3 ? null : 3)}
                />
              </FadeSlideIn>
            </div>
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
};

/* =========================
   BENTO CARD
========================= */

const BentoCard = ({ project, active, onClick, className }) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer h-full w-full
        rounded-[28px]

        bg-white/5 backdrop-blur-xl
        border border-white/10

        shadow-[0_10px_40px_rgba(0,0,0,0.35)]

        p-6

        flex flex-col justify-between

        transition-all duration-300
        hover:scale-[1.02]

        ${className}
        ${active ? "ring-1 ring-white/20" : ""}
      `}
    >
      {/* CONTENT */}
      <div>
        <h3 className="text-xl md:text-2xl font-semibold text-[var(--text-primary)] mb-2">
          {project.title}
        </h3>

        <p className="text-sm text-[var(--accent)] mb-3">{project.subtitle}</p>

        <p
          className={`
            text-sm text-[var(--text-muted)]
            transition-all duration-300
            ${active ? "opacity-100" : "opacity-60 line-clamp-2"}
          `}
        >
          {project.description}
        </p>
      </div>

      {/* CTA */}
      <div
        className={`
          mt-4 transition-all duration-300
          ${
            active
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }
        `}
      >
        <Link
          to={project.link}
          onClick={(e) => e.stopPropagation()}
          data-cursor="Know More"
          data-cursor-variant="pill2"
          className="
            block w-full text-center
            px-5 py-3
            rounded-[20px]
            bg-[var(--accent)]
            text-[var(--text-dark-btn)] text-sm font-medium
            shadow-[0_8px_25px_rgba(0,0,0,0.3)]
            hover:scale-[1.03]
            hover:text-[var(--text-dark-btn)]
            transition
          "
        >
          Explore →
        </Link>
      </div>
    </div>
  );
};

export default Projects;
