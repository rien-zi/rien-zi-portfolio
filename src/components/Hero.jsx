import React from "react";
import FadeSlideIn from "./FadeSlideIn";

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 pt-36">
      <div className="w-full max-w-[790px] text-left">
        <FadeSlideIn direction="left">
          <h1 className="text-3xl md:text-5xl text-white font-heading font-bold mb-6">
            i'm Renzil Rodrigues <span className="inline-block">✌🏻</span>
          </h1>
        </FadeSlideIn>

        <FadeSlideIn direction="left" delay={0.1}>
          <p className="text-lg md:text-4xl font-heading font-semibold text-gray-500 leading-relaxed mb-8">
            technical architect and automation engineer with 2+ years of
            experience building AI systems, backend platforms, and scalable
            workflows.
          </p>
        </FadeSlideIn>

        <FadeSlideIn direction="left" delay={0.2}>
          <div className="flex flex-wrap gap-4">
            <a
              href="#contact"
              className="inline-block border border-red-600 md:border-white/20 md:hover:border-red-600 text-white md:text-white/50  md:hover:text-white font-heading px-6 py-3 rounded-full transition"
            >
              Let's Connect?
            </a>
            <a
              href="/resume.pdf"
              download
              className="inline-block border border-indigo-600 md:border-white/20  md:hover:border-indigo-600 text-white md:text-white/50  md:hover:text-white font-heading px-6 py-3 rounded-full transition"
            >
              Download CV
            </a>
          </div>
        </FadeSlideIn>
      </div>
    </section>
  );
};

export default Hero;
