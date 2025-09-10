import React, { useState } from "react";
import FadeSlideIn from "./FadeSlideIn";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    honeypot: "",
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
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
    // honeypot check
    if (form.honeypot) {
      setStatus("success");
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("https://3rgs9grsrj.execute-api.ap-south-1.amazonaws.com/dev/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "", honeypot: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Error:", err);
      setStatus("error");
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <section id="contact" className="bg-darkbg text-white py-20 px-4 sm:px-6">
      <div className="w-full max-w-[790px] mx-auto">
        <FadeSlideIn direction="left">
          <h2 className="text-4xl md:text-5xl text-white/50 font-heading font-bold mb-12">
            Contact Me
          </h2>
        </FadeSlideIn>

        <form onSubmit={handleSubmit} className="space-y-6 text-sm font-body">
          {/* honeypot hidden field */}
          <input
            type="text"
            name="honeypot"
            value={form.honeypot}
            onChange={handleChange}
            style={{ display: "none" }}
            tabIndex="-1"
            autoComplete="off"
          />

          <FadeSlideIn direction="left" delay={0.05}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
                className="bg-[#121212] border border-white/10 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-white/20"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="bg-[#121212] border border-white/10 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-white/20"
              />
            </div>
          </FadeSlideIn>

          <FadeSlideIn direction="left" delay={0.1}>
            <textarea
              name="message"
              placeholder="Your message..."
              value={form.message}
              onChange={handleChange}
              rows="5"
              required
              className="w-full bg-[#121212] border border-white/10 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-white/20"
            />

            <button
              type="submit"
              disabled={status === "submitting"}
              className={`
              w-full px-6 py-3 rounded-md font-medium transition text-sm flex items-center justify-center
              ${
                status === "success"
                  ? "bg-green-600 text-white"
                  : status === "error"
                  ? "bg-red-500 text-white"
                  : "bg-white text-black hover:opacity-90"
              }
            `}
            >
              {status === "submitting" && (
                <>
                  <svg
                    className="animate-spin h-4 w-4 mr-2 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              )}

              {status === "success" && "Thank You for showing Interest!"}
              {status === "error" && (
                <span className="flex flex-col items-center">
                  <span className="mb-2">Form unavailable.</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-3 py-1 bg-white text-black rounded hover:opacity-80"
                  >
                    {copied ? "Copied!" : "Copy Email"}
                  </button>
                </span>
              )}
              {status === "idle" && "Submit"}
            </button>
          </FadeSlideIn>
        </form>

        {/* Scroll to top button */}
        <FadeSlideIn direction="left" delay={0.2}>
          <div className="mt-10 text-center">
            <button
              onClick={scrollToTop}
              className="text-sm text-white/60 hover:text-white underline underline-offset-2 transition"
            >
              ⬆ Back to Top
            </button>
          </div>
        </FadeSlideIn>
      </div>
    </section>
  );
};

export default Contact;
