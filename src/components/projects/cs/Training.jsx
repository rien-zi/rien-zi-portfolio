import React from "react";
import { Link } from "react-router-dom";

const Training = () => (
  <section className="min-h-screen bg-darkbg text-white px-6 py-20 flex flex-col items-center">
    <div className="max-w-[790px]">
      <h1 className="text-4xl font-heading font-bold mb-6 text-red-400">
        Training LMS Automations
      </h1>
      <p className="text-gray-400 mb-4">
        A fully automated learning and onboarding system for Swiggy’s partner
        agents and support staff. Generated dynamic learning flows, integrated
        dashboards, and automated hiring funnel logic for seamless user
        tracking.
      </p>
      <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
        <li>
          Served <strong>5K+ users</strong> with real-time progress tracking.
        </li>
        <li>
          Reduced onboarding cycle time by <strong>25%</strong>.
        </li>
        <li>
          Enabled HR and L&D teams to self-manage course updates through
          dashboards.
        </li>
        <li>Tech: Node.js · Firebase · Power BI · Python · MySQL.</li>
      </ul>
      <Link
        to="/"
        className="inline-block px-6 py-2 border border-red-400 text-red-400 rounded-full hover:bg-red-400 hover:text-white transition"
      >
        ← Back to Portfolio
      </Link>
    </div>
  </section>
);

export default Training;
