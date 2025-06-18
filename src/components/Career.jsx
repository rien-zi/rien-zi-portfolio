import React from "react";
import clsx from "clsx";
import FadeSlideIn from "./FadeSlideIn";

const careers = [
  {
    company: "Swiggy",
    role: "Automation Engineer",
    date: "/Now",
    gradient: "from-orange-400 via-pink-500 to-purple-500",
  },
  {
    company: "Swiggy",
    role: "Trg & Content Specialist",
    date: "/Oct '23",
    gradient: "from-purple-500 via-pink-500 to-orange-500",
  },
  {
    company: "Swiggy",
    role: "Fulfilment Expert",
    date: "/Sep '20",
    gradient: "from-pink-500 via-purple-500 to-orange-400",
  },
  {
    company: "Vishal Ent.",
    role: "Medical Representative",
    date: "/Jan '19",
    gradient: "from-indigo-300 via-blue-500 to-purple-600",
  },
];

const Career = () => {
  return (
    <section id="career" className="bg-darkbg text-white py-20 px-4 sm:px-6">
      <div className="w-full max-w-[790px] mx-auto">
        <FadeSlideIn direction="left">
          <h2 className="text-4xl md:text-5xl text-white/50 font-heading font-bold mb-12">
            Career Journey
          </h2>
        </FadeSlideIn>

        <div className="flex flex-wrap gap-x-6 gap-y-10 justify-center md:justify-between">
          {careers.map((item, index) => {
            const isRight = index % 2 === 1;

            const direction =
              typeof window !== "undefined" && window.innerWidth < 768
                ? "left"
                : isRight
                ? "right"
                : "left";

            return (
              <FadeSlideIn
                key={index}
                direction={direction}
                delay={index * 0.1}
              >
                <div
                  key={index}
                  className={clsx(
                    "bg-[#121212] border border-white/10 rounded-3xl p-8",
                    "w-full md:w-[48%] max-w-[300px] max-h-fit flex-shrink-0 transition-transform duration-300",
                    {
                      "hover:-rotate-6": isRight,
                      "hover:rotate-6": !isRight,
                      "md:mt-10": isRight,
                    }
                  )}
                >
                  <div
                    className={`rounded-2xl h-36 mb-4 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}
                  >
                    {index < 3 ? (
                      <img
                        src="/swiggy.svg" // make sure path is correct
                        alt="Swiggy"
                        className="h-10 object-contain"
                      />
                    ) : (
                      <span className="text-white text-3xl font-body font-black tracking-wide">
                        VE
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-10">
                    {item.company}
                  </h3>
                  <p className="text-sm font-body text-gray-400">
                    {item.role}
                    <span className="text-white float-right">{item.date}</span>
                  </p>
                </div>
              </FadeSlideIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Career;
