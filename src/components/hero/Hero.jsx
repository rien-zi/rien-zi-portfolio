import React from "react";
import HeroContent from "./HeroContent";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center px-6 overflow-hidden">
      {/* Content */}
      <div className="relative z-10 w-full max-w-[1100px] mx-auto">
        <HeroContent />
      </div>
    </section>
  );
};

export default Hero;
