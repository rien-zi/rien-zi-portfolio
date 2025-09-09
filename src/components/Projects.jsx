import React, { useRef, useState, useEffect } from "react";
import {
  FaSearch,
  FaExclamationTriangle,
  FaCogs,
  FaShieldAlt,
  FaRocket,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import FadeSlideIn from "./FadeSlideIn";

const projects = [
  {
    icon: <FaSearch size={24} />,
    title: "Resolute Web Interface",
    description:
      "Internal CX escalation tool used across 8K+ daily support workflows. Optimised agent decisions with pre-tagged issue flows.",
  },
  {
    icon: <FaCogs size={24} />,
    title: "Audit Model",
    description:
      "Real-time auditing system analyzing chat transcripts and agent actions. Identifies non-compliance and auto-tags issue types.",
  },
  {
    icon: <FaExclamationTriangle size={24} />,
    title: "Anomaly Detection Models",
    description:
      "ML-powered anomaly detector for backend workflows. Flags operational drifts and behaviour spikes via data clustering.",
  },
  {
    icon: <FaShieldAlt size={24} />,
    title: "Escalation Prevention Models",
    description:
      "Nudges agents in real time based on sentiment analysis + ticket metadata. Seamless integration with CX chat engines.",
  },
  {
    icon: <FaRocket size={24} />,
    title: "Training LMS Automations",
    description:
      "Auto-generated onboarding and training flows for 5K+ users. Integrated dashboards and hiring funnel logic.",
  },
];

const Projects = () => {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScrollStatus = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.offsetWidth < el.scrollWidth);
    };

    updateScrollStatus();
    el.addEventListener("scroll", updateScrollStatus);
    window.addEventListener("resize", updateScrollStatus);

    return () => {
      el.removeEventListener("scroll", updateScrollStatus);
      window.removeEventListener("resize", updateScrollStatus);
    };
  }, []);

  const scrollByAmount = (amount) => {
    containerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section id="projects" className="bg-darkbg text-white py-20 px-4 sm:px-6">
      <div className="w-full max-w-[790px] mx-auto relative">
        <FadeSlideIn direction="left">
          <h2 className="text-4xl md:text-5xl text-white/50 font-heading font-bold mb-20">
            My Projects
          </h2>
        </FadeSlideIn>

        <FadeSlideIn direction="left" delay={0.1}>
          <div className="relative">
            {canScrollLeft && (
              <button
                onClick={() => scrollByAmount(-300)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 backdrop-blur border border-white/10 text-white p-2 rounded-full hover:bg-black"
                aria-label="Scroll projects to left"
              >
                <FaChevronLeft />
              </button>
            )}

            <div
              ref={containerRef}
              className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth py-2"
            >
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="min-w-[250px] max-w-[250px] bg-[#161616] border border-white/10 rounded-xl p-6 flex-shrink-0"
                >
                  <div className="text-white/50 mb-3">{project.icon}</div>
                  <h3 className="text-lg text-white/50 font-heading font-semibold mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm font-body text-gray-500 mb-4">
                    {project.description}
                  </p>
                  <button
                    className="mt-auto inline-block px-4 py-2 text-sm border-red-400 md:border-red-400/20 md:hover:border-red-400 text-red-400 md:text-red-400/40 rounded-full hover:opacity-90"
                    aria-label="View more about the project"
                  >
                    View More
                  </button>
                </div>
              ))}
            </div>

            {canScrollRight && (
              <button
                onClick={() => scrollByAmount(300)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 backdrop-blur border border-white/10 text-white p-2 rounded-full hover:bg-black"
                aria-label="Scroll projects to right"
              >
                <FaChevronRight />
              </button>
            )}
          </div>
        </FadeSlideIn>
      </div>
    </section>
  );
};

export default Projects;
