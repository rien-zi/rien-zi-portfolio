import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import FadeSlideIn from "../../rss/FadeSlideIn";

const Audit = () => {
  const floatingRefs = useRef([]);

  // Gentle parallax effect with capped motion
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      floatingRefs.current.forEach((el, idx) => {
        if (el) {
          const speed = 0.05 + idx * 0.03;
          const offset = Math.min(scrollY * speed, 80); // cap shift
          el.style.transform = `translateY(${offset}px)`;
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative bg-[#0a0a0a] text-white px-6 py-24 overflow-hidden">
      {/* Global glowing backdrop */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-red-500/20 rounded-full blur-[180px] pointer-events-none"></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[180px] pointer-events-none"></div>

      <div className="relative max-w-[850px] w-full mx-auto z-10 flex flex-col gap-28 overflow-visible">
        {/* HEADER */}
        <FadeSlideIn direction="up">
          <div className="text-center mb-10 overflow-visible">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-red-400 via-pink-400 to-orange-300 bg-clip-text text-transparent">
              🧠 IRIS — Audit Model
            </h1>
            <p className="text-gray-400 text-lg max-w-[700px] mx-auto">
              Building an AI-driven Conversation Intelligence Platform for
              Scalable CX Auditing
            </p>

            {/* Floating header vector */}
            <div
              ref={(el) => (floatingRefs.current[0] = el)}
              className="flex justify-center mt-10 transition-transform duration-500 ease-out will-change-transform"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="260"
                height="140"
                viewBox="0 0 200 120"
                className="opacity-80"
              >
                <rect width="200" height="120" rx="12" fill="#161616" />
                <circle cx="30" cy="40" r="8" fill="#e15a1f" />
                <rect
                  x="45"
                  y="34"
                  width="120"
                  height="12"
                  rx="6"
                  fill="#444"
                />
                <circle cx="170" cy="80" r="8" fill="#e15a1f" />
                <rect
                  x="15"
                  y="74"
                  width="130"
                  height="12"
                  rx="6"
                  fill="#333"
                />
              </svg>
            </div>
          </div>
        </FadeSlideIn>

        {/* BACKGROUND */}
        <FadeSlideIn direction="left">
          <section className="py-12">
            <h2 className="text-2xl font-semibold text-red-400 mb-4 flex items-center gap-2">
              🔍 <span>Background</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Modern customer-experience operations generate an enormous volume
              of chat interactions between customers, agents, and automated
              systems. Each conversation carries subtle indicators of empathy,
              resolution, professionalism, and tone — but identifying these
              “moments” at scale is nearly impossible through manual review.
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              Our challenge was simple to state yet complex to achieve:
              <br />
              <strong className="text-white">
                Can we design a system that listens to every customer
                conversation, understands context, detects behavioral patterns,
                and scores performance in real time — across millions of
                messages?
              </strong>
            </p>
            <p className="text-gray-400 leading-relaxed">
              That question gave birth to{" "}
              <span className="text-red-400 font-semibold">Arena</span>, a
              self-learning evaluation ecosystem blending rule-based precision
              with AI-driven interpretation. It became the intelligence layer
              behind Swiggy’s CX quality framework — continuously evaluating,
              visualizing, and improving agent interactions across business
              verticals.
            </p>
          </section>
        </FadeSlideIn>

        {/* CORE PROBLEM */}
        <FadeSlideIn direction="right">
          <section className="py-12">
            <h2 className="text-2xl font-semibold text-red-400 mb-4">
              🎯 The Core Problem
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Before Arena, audits were performed manually — human reviewers
              scrolled through chat logs, checking parameters like empathy,
              acknowledgment, and resolution accuracy. While effective for a few
              cases, it collapsed under scale — delays, subjectivity, and
              inconsistency crept in.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Arena’s mission:{" "}
              <strong className="text-white">
                automate experience measurement end-to-end
              </strong>{" "}
              — so quality could be measured like delivery speed or NPS:
              objectively, explainably, and at scale.
            </p>
          </section>
        </FadeSlideIn>

        {/* CONCEPT & ARCHITECTURE */}
        <FadeSlideIn direction="up">
          <section className="relative py-12">
            <h2 className="text-2xl font-semibold text-red-400 mb-4">
              🧩 Concept & Architecture
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Arena acts like a conversation compiler — reading unstructured
              dialogue and evaluating it against configurable{" "}
              <span className="text-white font-medium">“moments”</span>{" "}
              (behavioral checkpoints).
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-1 mb-4">
              <li>Keywords or phrases to detect</li>
              <li>Who said it (agent, customer, or system)</li>
              <li>When it should appear (early, throughout, or at closure)</li>
              <li>Whether it must be present or absent</li>
            </ul>
            <p className="text-gray-400 leading-relaxed">
              These definitions feed into a modular Python engine that combs
              through every transcript, detecting where patterns appear — or
              don’t. Each finding contributes to a behavioral score visualized
              in the dashboard.
            </p>
          </section>
        </FadeSlideIn>

        {/* FLOWCHART */}
        <div className="relative flex justify-center items-center py-20 min-h-[300px] overflow-visible">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-[240px] h-[120px] bg-red-500/10 blur-[80px] rounded-full"></div>
          </div>

          <div
            ref={(el) => (floatingRefs.current[1] = el)}
            className="relative transition-transform duration-500 ease-out will-change-transform"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 400 140"
              className="w-[360px] h-[140px] opacity-90"
            >
              <rect
                x="10"
                y="40"
                width="90"
                height="60"
                rx="8"
                fill="#222"
                stroke="#e15a1f"
                strokeWidth="2"
              />
              <text
                x="55"
                y="75"
                textAnchor="middle"
                fill="#e15a1f"
                fontSize="10"
              >
                Input Logs
              </text>

              <rect
                x="155"
                y="40"
                width="90"
                height="60"
                rx="8"
                fill="#222"
                stroke="#a855f7"
                strokeWidth="2"
              />
              <text
                x="200"
                y="75"
                textAnchor="middle"
                fill="#a855f7"
                fontSize="10"
              >
                Evaluation Engine
              </text>

              <rect
                x="300"
                y="40"
                width="90"
                height="60"
                rx="8"
                fill="#222"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              <text
                x="345"
                y="75"
                textAnchor="middle"
                fill="#3b82f6"
                fontSize="10"
              >
                Dashboard
              </text>

              <line
                x1="100"
                y1="70"
                x2="155"
                y2="70"
                stroke="#555"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
              <line
                x1="245"
                y1="70"
                x2="300"
                y2="70"
                stroke="#555"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
              <defs>
                <marker
                  id="arrow"
                  markerWidth="6"
                  markerHeight="6"
                  refX="5"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0 L6,3 L0,6 Z" fill="#555" />
                </marker>
              </defs>
            </svg>
          </div>
        </div>

        {/* EVALUATION ENGINE */}
        <FadeSlideIn direction="right">
          <section className="py-12">
            <h2 className="text-2xl font-semibold text-red-400 mb-4">
              ⚙️ Building the Evaluation Engine
            </h2>
            <p className="text-gray-400 mb-3">
              The engine functions in multiple passes:
            </p>
            <ul className="space-y-3 text-gray-400 list-disc list-inside mb-4">
              <li>
                <strong className="text-white">Extraction Phase:</strong>{" "}
                Converts raw chat JSON into chronological dialogues.
              </li>
              <li>
                <strong className="text-white">Evaluation Phase:</strong> Scans
                each message against keyword and logic rules (presence, absence,
                AND/OR, time-based triggers).
              </li>
              <li>
                <strong className="text-white">Aggregation Phase:</strong>{" "}
                Summarizes behavioral outcomes (empathy %, closure %, etc.).
              </li>
              <li>
                <strong className="text-white">
                  Persistence & Intelligence Phase:
                </strong>{" "}
                Logs granular tracebacks for explainability and re-analysis.
              </li>
            </ul>
            <p className="text-gray-400">
              This pipeline, with chunked evaluation and concurrent execution,
              processes millions of messages daily — reliably and fast.
            </p>
          </section>
        </FadeSlideIn>

        {/* AI LAYER */}
        <FadeSlideIn direction="up">
          <section className="py-12">
            <h2 className="text-2xl font-semibold text-red-400 mb-4">
              🧠 Infusing AI for Deeper Insights
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              The second phase introduced AI-assisted auditing through a
              retrieval-augmented architecture (LangChain + FAISS). Behavioral
              rubrics and SOPs became vector embeddings, enabling contextual
              tone and grammar evaluation.
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
              Arena evolved from a rule engine into an explainable AI
              decision-maker — grading empathy, politeness, and linguistic
              professionalism using examples grounded in organizational SOPs.
            </p>

            {/* Floating neural net vector */}
            <div
              ref={(el) => (floatingRefs.current[2] = el)}
              className="flex justify-center mt-6 transition-transform duration-500 ease-out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 180 100"
                className="w-[200px] h-[100px] opacity-70"
              >
                <circle cx="20" cy="50" r="6" fill="#e15a1f" />
                <circle cx="60" cy="30" r="6" fill="#f472b6" />
                <circle cx="60" cy="70" r="6" fill="#f472b6" />
                <circle cx="100" cy="50" r="6" fill="#3b82f6" />
                <circle cx="140" cy="30" r="6" fill="#a855f7" />
                <circle cx="140" cy="70" r="6" fill="#a855f7" />
                <circle cx="170" cy="50" r="6" fill="#22d3ee" />
                <path
                  d="M26 50 L54 30 M26 50 L54 70 M66 30 L94 50 M66 70 L94 50 M106 50 L134 30 M106 50 L134 70 M146 30 L164 50 M146 70 L164 50"
                  stroke="#555"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </section>
        </FadeSlideIn>

        {/* OUTCOME */}
        <FadeSlideIn direction="up">
          <section className="text-center py-24 pb-32">
            <h2 className="text-2xl font-semibold text-red-400 mb-4">
              🏁 Outcome
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8 max-w-[650px] mx-auto">
              Arena now powers Swiggy’s central conversation-intelligence layer
              — analyzing millions of chats, surfacing behavioral trends, and
              guiding CX excellence. It exemplifies how data engineering, AI,
              and empathy can redefine quality measurement at scale.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-2 border border-red-400 text-red-400 rounded-full hover:bg-red-400 hover:text-white transition"
            >
              ← Back to Portfolio
            </Link>
          </section>
        </FadeSlideIn>
      </div>
    </section>
  );
};

export default Audit;
