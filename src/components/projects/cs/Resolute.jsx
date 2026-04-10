import React from "react";
import { Link } from "react-router-dom";

const Resolute = () => (
  <section className="min-h-screen bg-darkbg text-white px-6 py-20 flex flex-col items-center">
    <div className="max-w-[790px]">
      <h1 className="text-4xl font-heading font-bold mb-6 text-red-400">
        Resolute Web Interface
      </h1>
      <p className="text-gray-400 mb-4">
        An internal CX suite built to streamline Swiggy’s escalation handling,
        auditing, and training operations. Serves{" "}
        <strong>8K+ daily users </strong>
        across teams, consolidating resolution dashboards, agent insights, and
        quality metrics.
      </p>
      <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
        <li>
          Improved SLA adherence by <strong>15%</strong> through automated
          resolution flows.
        </li>
        <li>Unified dashboards for auditors, trainers, and supervisors.</li>
        <li>Built with PHP · Python · PostgreSQL · Snowflake · React.</li>
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

export default Resolute;
