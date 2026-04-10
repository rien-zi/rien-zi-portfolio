import React from "react";
import { Link } from "react-router-dom";

const Anomaly = () => (
  <section className="min-h-screen bg-darkbg text-white px-6 py-20 flex flex-col items-center">
    <div className="max-w-[790px]">
      <h1 className="text-4xl font-heading font-bold mb-6 text-red-400">
        Anomaly Detection Models
      </h1>
      <p className="text-gray-400 mb-4">
        A machine-learning pipeline that continuously monitors backend CX and
        operational workflows to detect behavioral spikes, irregular ticket
        trends, or data drifts in real time.
      </p>
      <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
        <li>
          Flagged workflow anomalies that previously went undetected by static
          rules.
        </li>
        <li>
          Reduced false alerts by leveraging clustering and contextual
          thresholds.
        </li>
        <li>
          Supports proactive decision-making for quality and process leads.
        </li>
        <li>
          Tech: Python · scikit-learn · PostgreSQL · Snowflake · Streamlit
          dashboards.
        </li>
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

export default Anomaly;
