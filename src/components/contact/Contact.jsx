import React, { useState, useEffect } from "react";
import FadeSlideIn from "../rss/FadeSlideIn";
import { getSupabase } from "../../lib/supabase";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    honeypot: "",
  });

  const [status, setStatus] = useState("idle");
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("renzil.digispec@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.honeypot) {
      setStatus("success");
      return;
    }

    setStatus("submitting");

    try {
      const supabase = await getSupabase(); // ✅

      const { error } = await supabase.from("contact_messages").insert([
        {
          name: form.name,
          email: form.email,
          message: form.message,
          source: "portfolio",
        },
      ]);

      if (error) throw error;

      setStatus("success");
      setForm({ name: "", email: "", message: "", honeypot: "" });

      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      console.error("Supabase Insert Error:", err);
      setStatus("error");
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <section id="contact" className="py-32 px-4 relative">
      {/* TITLE */}
      <div className="max-w-[800px] mx-auto text-center mb-20">
        <FadeSlideIn direction="fade">
          <h2 className="text-3xl md:text-5xl text-[var(--text-subtle)] font-accent">
            Let’s Build Something Meaningful
          </h2>
        </FadeSlideIn>

        <FadeSlideIn direction="fade" delay={0.1}>
          <p className="mt-6 text-sm md:text-base text-[var(--text-muted)] max-w-[500px] mx-auto font-accent">
            Whether it’s automation, AI systems, or scalable backend design —
            I’m always open to building impactful systems.
          </p>
        </FadeSlideIn>
      </div>

      {/* FORM */}
      <div className="max-w-[600px] mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
          {/* honeypot */}
          <input
            type="text"
            name="honeypot"
            value={form.honeypot}
            onChange={handleChange}
            style={{ display: "none" }}
          />

          {/* INPUTS */}
          <FadeSlideIn direction="up">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                data-cursor="Connect"
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl focus:outline-none focus:border-white/20 font-accent"
              />

              <input
                data-cursor="Connect"
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
                className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl focus:outline-none focus:border-white/20 font-accent"
              />
            </div>
          </FadeSlideIn>

          {/* MESSAGE */}
          <FadeSlideIn direction="up" delay={0.05}>
            <textarea
              data-cursor="Share Idea"
              name="message"
              placeholder="What are you building or thinking about?"
              value={form.message}
              onChange={handleChange}
              rows="5"
              required
              className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl focus:outline-none focus:border-white/20 font-accent"
            />
          </FadeSlideIn>

          {/* BUTTON */}
          <FadeSlideIn direction="up" delay={0.1}>
            <button
              type="submit"
              disabled={status === "submitting"}
              data-cursor="Send"
              className={`
                w-full px-6 py-3 rounded-xl font-medium transition font-accent
                ${
                  status === "success"
                    ? "bg-green-500 text-white"
                    : status === "error"
                      ? "bg-red-500 text-white"
                      : "bg-white text-black hover:opacity-90"
                }
              `}
            >
              {status === "submitting" && "Sending..."}
              {status === "success" && "Message Sent 🚀"}
              {status === "error" && (
                <span className="flex flex-col items-center">
                  <span className="mb-2">Try again or email me</span>
                  <span
                    onClick={handleCopy}
                    className="underline cursor-pointer"
                  >
                    {copied ? "Copied!" : "Copy Email"}
                  </span>
                </span>
              )}
              {status === "idle" && "Start a Conversation"}
            </button>
          </FadeSlideIn>
        </form>

        {/* BACK TO TOP */}
        <FadeSlideIn direction="up" delay={0.2}>
          <div className="mt-12 text-center font-accent">
            <button
              onClick={scrollToTop}
              data-cursor="Up"
              className="text-sm text-[var(--text-muted)] hover:text-white transition"
            >
              ↑ Back to Top
            </button>
          </div>
        </FadeSlideIn>
      </div>
    </section>
  );
};

export default Contact;
