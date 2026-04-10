import React, { useEffect, useState } from "react";
import FadeSlideIn from "../rss/FadeSlideIn";

/* -------------------- DATA -------------------- */
const careers = [
  {
    company: "Swiggy",
    role: "Automation Engineer",
    date: "Now",
    desc: "Building scalable automation systems, evaluation pipelines, and AI-driven workflows.",
  },
  {
    company: "Swiggy",
    role: "Training & Content Specialist",
    date: "Oct '23",
    desc: "Designed structured training systems and content pipelines to improve operational efficiency.",
  },
  {
    company: "Swiggy",
    role: "Fulfilment Expert",
    date: "Sep '20",
    desc: "Handled ground-level operations, gaining deep understanding of workflows and edge cases.",
  },
  {
    company: "Vishal Enterprises",
    role: "Medical Representative",
    date: "Jan '19",
    desc: "Built strong communication, persuasion, and field execution skills.",
  },
];

/* -------------------- CURSOR STATES -------------------- */
const cursorLabels = [
  "🚀 Scaling",
  "🧠 Structuring",
  "⚙️ Learning",
  "🌱 Beginning",
];

const Career = () => {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-career]");
      const viewportCenter = window.innerHeight / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      sections.forEach((sec, i) => {
        const rect = sec.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - center);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      setActive(closestIndex);

      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((window.scrollY / total) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="career" className="py-32 px-4 relative">
      <div className="max-w-[800px] mx-auto space-y-32">
        <FadeSlideIn direction="fade">
          <h2 className="text-3xl md:text-5xl text-[var(--text-subtle)] font-logo text-center mb-20">
            Career Journey
          </h2>
        </FadeSlideIn>

        {careers.map((item, index) => (
          <FadeSlideIn key={index} direction="up">
            <div
              data-career
              className={`transition-all duration-500 ${
                active === index ? "opacity-100 scale-[1.02]" : "opacity-70"
              }`}
            >
              {/* HEADER */}
              <div className="flex items-center gap-4 mb-6 font-accent">
                {/* NODE */}
                <div
                  data-cursor={cursorLabels[index]}
                  className={`
                    w-4 h-4 rounded-full border relative
                    ${active === index ? "bg-white scale-125" : "bg-white/30"}
                  `}
                >
                  {active === index && (
                    <div className="absolute inset-0 rounded-full animate-ping bg-white/40" />
                  )}
                </div>

                {/* TITLE */}
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold font-accent text-[var(--text-primary)]">
                    {item.role}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    {item.company} • {item.date}
                  </p>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div data-cursor={cursorLabels[index]} className="pl-6">
                <p className="text-sm md:text-base text-[var(--text-muted)] font-accent leading-relaxed max-w-[600px]">
                  {item.desc}
                </p>
              </div>
            </div>
          </FadeSlideIn>
        ))}
      </div>
    </section>
  );
};

export default Career;
