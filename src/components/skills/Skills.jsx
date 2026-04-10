import React, { useEffect, useState } from "react";
import FadeSlideIn from "../rss/FadeSlideIn";

// Icons
import {
  FaPython,
  FaNodeJs,
  FaJs,
  FaPhp,
  FaHtml5,
  FaDocker,
  FaLinux,
  FaGitAlt,
} from "react-icons/fa";

import {
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiFirebase,
  SiSnowflake,
  SiNginx,
  SiPostman,
} from "react-icons/si";

/* -------------------- CATEGORY COLORS -------------------- */
const categoryColors = {
  foundation: "text-purple-400",
  engineering: "text-green-400",
  data: "text-yellow-400",
  ai: "text-pink-400",
  infra: "text-orange-400",
};

const cursorLabels = {
  foundation: "🧠 Thinking",
  engineering: "⚙️ Building",
  data: "📊 Structuring",
  ai: "🤖 Intelligence",
  infra: "🚀 Shipping",
};

/* -------------------- STORY TIMELINE -------------------- */
const timeline = [
  {
    id: "foundation",
    title: "Foundation",
    subtitle: "Understanding systems & workflows",
    items: [
      {
        icon: "⚙️",
        name: "Process Thinking",
        desc: "Started by breaking down CX workflows into structured, automatable steps.",
      },
      {
        icon: "🏗️",
        name: "System Design",
        desc: "Learned to design modular systems instead of isolated scripts.",
      },
    ],
  },
  {
    id: "engineering",
    title: "Engineering Buildout",
    subtitle: "From scripts to scalable systems",
    items: [
      {
        icon: <FaPython />,
        name: "Python",
        desc: "Built evaluation engines processing 120k+ conversations/day with modular execution.",
      },
      {
        icon: <FaNodeJs />,
        name: "Node.js",
        desc: "Created lightweight APIs and automation layers for internal tooling.",
      },
      {
        icon: <FaNodeJs />,
        name: "Express.js",
        desc: "Built RESTful APIs and web applications with Express.js.",
      },
      {
        icon: <FaPhp />,
        name: "PHP",
        desc: "Maintained and optimized legacy PHP systems for internal dashboards and tools.",
      },
      {
        icon: <FaJs />,
        name: "Frontend Systems",
        desc: "Developed responsive dashboards and interaction-heavy UI systems.",
      },
    ],
  },
  {
    id: "data",
    title: "Data Systems",
    subtitle: "Scaling through structured data",
    items: [
      {
        icon: <SiMysql />,
        name: "MySQL",
        desc: "Designed normalized schemas and optimized query performance for high-throughput workloads.",
      },
      {
        icon: <SiPostgresql />,
        name: "PostgreSQL",
        desc: "Designed JSONB-driven schemas and optimized large query pipelines.",
      },
      {
        icon: <SiMongodb />,
        name: "MongoDB",
        desc: "Designed document-based schemas and optimized for high-velocity data ingestion.",
      },
      {
        icon: <SiSnowflake />,
        name: "Snowflake",
        desc: "Handled cross-system data sync and large-scale analytical processing.",
      },
    ],
  },
  {
    id: "ai",
    title: "AI Systems",
    subtitle: "Adding intelligence to workflows",
    items: [
      {
        icon: "🤖",
        name: "LLM Integration",
        desc: "Integrated OpenAI & Mistral into evaluation pipelines with structured prompts.",
      },
      {
        icon: "🔗",
        name: "LangChain",
        desc: "Built agent workflows with embeddings, RAG, and dynamic reasoning.",
      },
    ],
  },
  {
    id: "infra",
    title: "Deployment & Infra",
    subtitle: "Making systems production-ready",
    items: [
      {
        icon: <FaDocker />,
        name: "Docker",
        desc: "Containerized services for consistent deployment.",
      },
      {
        icon: <SiNginx />,
        name: "Nginx",
        desc: "Configured routing, reverse proxies, and production setups.",
      },
      {
        icon: "☁️",
        name: "AWS",
        desc: "Deployed scalable backend systems and automation pipelines.",
      },
    ],
  },
];

const Skills = () => {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section]");
      const viewportCenter = window.innerHeight / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      sections.forEach((sec, i) => {
        const rect = sec.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;

        const distance = Math.abs(viewportCenter - sectionCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      setActive(closestIndex);

      // Progress (unchanged but slightly smoother)
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;

      setProgress((scrolled / total) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="skills" className="py-32 px-4 relative">
      <div className="max-w-[800px] mx-auto space-y-32">
        {timeline.map((section, index) => (
          <FadeSlideIn key={section.id} direction="up">
            <div
              data-section
              className={`transition-all duration-500 ${
                active === index ? "opacity-100 scale-[1.02]" : "opacity-70"
              }`}
            >
              {/* HEADER */}
              <div className="flex items-center gap-4 mb-8">
                {/* NODE */}
                <div
                  data-cursor="highlight"
                  className={`
                    w-4 h-4 rounded-full border relative
                    ${active === index ? "bg-white scale-125" : "bg-white/30"}
                  `}
                >
                  {/* GLOW */}
                  {active === index && (
                    <div className="absolute inset-0 rounded-full animate-ping bg-white/40" />
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-accent font-semibold text-[var(--text-primary)]">
                    {section.title}
                  </h3>
                  <p className="font-accent text-sm text-[var(--text-muted)]">
                    {section.subtitle}
                  </p>
                </div>
              </div>

              {/* ITEMS */}
              <div className="space-y-6 pl-6">
                {section.items.map((item, i) => (
                  <div
                    key={i}
                    data-cursor={cursorLabels[section.id]}
                    data-cursor-variant="pillwhite"
                    className="flex gap-4 items-start p-4 rounded-xl hover:bg-white/5 transition"
                  >
                    <div className={`text-xl ${categoryColors[section.id]}`}>
                      {item.icon}
                    </div>

                    <div>
                      <h4 className="text-sm md:text-base font-medium text-[var(--text-primary)] font-accent">
                        {item.name}
                      </h4>
                      <p className="text-xs md:text-sm text-[var(--text-muted)] font-accent">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeSlideIn>
        ))}
      </div>
    </section>
  );
};

export default Skills;
