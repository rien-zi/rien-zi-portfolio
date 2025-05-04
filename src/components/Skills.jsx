import React from "react";
import FadeSlideIn from "./FadeSlideIn"; // adjust path as needed

const skills = [
  {
    title: "CORE STRENGTHS",
    points: [
      "Process Automation",
      "Workflow Design",
      "Training System Architecture",
      "Technical Content Strategy",
      "Backend API Integration",
      "Scalable System Design",
    ],
  },
  {
    title: "Programming & Frameworks",
    points: [
      "Python",
      "Node.js",
      "JavaScript (ES6+)",
      "PHP",
      "HTML / CSS / EJS",
      "Bash / Shell Scripting",
    ],
  },
  {
    title: "Stacks & Platforms",
    points: [
      "LAMP Stack",
      "MERN Stack",
      "Firebase",
      "REST APIs / Postman",
      "Google Workspace",
      "Microsoft Workspace",
    ],
  },
  {
    title: "Data & Analytics",
    points: [
      "Snowflake",
      "PostgreSQL / MySQL",
      "Power BI",
      "Looker Studio",
      "Google Sheets API",
      "Data Modelling & Optimisation",
    ],
  },
  {
    title: "AI / NLP / ML",
    points: [
      "OpenAI / Gemini / Mistral APIs",
      "LangChain / Ollama",
      "Prompt Engineering",
      "NLP Tagging / Text Classification",
      "Large Language Model (LLM) Workflows",
    ],
  },
  {
    title: "DevOps & Infra",
    points: [
      "Docker (Basics)",
      "Linux / Ubuntu",
      "Apache / Nginx",
      "Git / GitHub",
      "AWS EC2, SES, Route53",
    ],
  },
  {
    title: "Design & Collaboration Tools",
    points: ["Figma", "Canva", "Notion", "Jira", "Trello"],
  },
];

const Skills = () => {
  return (
    <section
      id="skills"
      className="bg-darkbg text-white py-20 px-4 sm:px-6 font-body"
    >
      <div className="w-full max-w-[790px] mx-auto">
        <FadeSlideIn direction="left">
          <h2 className="text-4xl md:text-5xl text-white/50 font-heading font-bold mb-20 text-center">
            Skills & Stacks
          </h2>
        </FadeSlideIn>

        <div className="space-y-12">
          {skills.map((skill, index) => {
            const isRight = index % 2 === 1;
            const leftDir =
              typeof window !== "undefined" && window.innerWidth < 768
                ? "left"
                : isRight
                ? "right"
                : "left";
            const rightDir =
              typeof window !== "undefined" && window.innerWidth < 768
                ? "left"
                : isRight
                ? "left"
                : "right";

            return (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 md:gap-20 gap-6 items-start"
              >
                <FadeSlideIn direction={leftDir}>
                  <h3 className="text-3xl md:text-4xl text-center md:text-right font-body font-black text-white/50 uppercase">
                    {skill.title}
                  </h3>
                </FadeSlideIn>

                <FadeSlideIn direction={rightDir} delay={0.1}>
                  <ul className="text-gray-400 text-sm text-center md:text-left space-y-1 list-disc list-inside">
                    {skill.points.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </FadeSlideIn>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
