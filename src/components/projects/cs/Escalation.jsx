import React from "react";
import { Link } from "react-router-dom";

const Escalation = () => (
  <section className="min-h-screen bg-darkbg text-white px-6 py-20 flex flex-col items-center">
    <div className="max-w-[790px]">
      <h1 className="text-4xl font-heading font-bold mb-6 text-red-400">
        Escalation Prevention Models
      </h1>
      <p className="text-gray-400 mb-4">
        Real-time AI models that predict potential escalations and nudge agents
        proactively using sentiment analysis, message context, and ticket
        metadata. Integrated seamlessly into Swiggy’s live chat platforms.
      </p>
      <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
        <li>
          Reduced refund and compensation leakage by{" "}
          <strong>₹7Cr annually</strong>.
        </li>
        <li>
          Improved customer satisfaction and first-response accuracy rates.
        </li>
        <li>
          Leverages NLP models built with Hugging Face transformers and
          LangChain.
        </li>
        <li>Tech: Python · Azure AI · Kafka · REST APIs · PostgreSQL.</li>
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

export default Escalation;
