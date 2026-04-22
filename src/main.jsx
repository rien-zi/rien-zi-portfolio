import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";

// Import your project synopsis components
import React, { lazy, Suspense } from "react";

const Resolute = lazy(() => import("./components/projects/cs/Resolute.jsx"));
const Audit = lazy(() => import("./components/projects/cs/Audit.jsx"));
const Anomaly = lazy(() => import("./components/projects/cs/Anomaly.jsx"));
const Escalation = lazy(
  () => import("./components/projects/cs/Escalation.jsx"),
);
const Training = lazy(() => import("./components/projects/cs/Training.jsx"));

import Vault from "./components/vault/Vault.jsx";

import { CursorProvider } from "./components/cursor/CursorContext";
const CursorLayer = lazy(() => import("./components/cursor/CursorLayer"));
const CustomCursor = lazy(() => import("./components/cursor/CustomCursor"));

// ✅ Import ScrollToTop
import ScrollToTop from "./components/rss/ScrollToTop.jsx";
import ScrollToSection from "./components/rss/ScrollToSection.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CursorProvider>
      <BrowserRouter>
        <ScrollToTop />

        <Suspense fallback={null}>
          <CursorLayer />
          <CustomCursor />
        </Suspense>

        <Routes>
          {/* Main page */}
          <Route path="/" element={<App />}>
            {/* Home */}
            <Route index element={null} />

            {/* Section routes */}
            <Route
              path="projects"
              element={<ScrollToSection id="projects" />}
            />
            <Route path="skills" element={<ScrollToSection id="skills" />} />
            <Route path="career" element={<ScrollToSection id="career" />} />
            <Route path="contact" element={<ScrollToSection id="contact" />} />
          </Route>

          {/* Project detail pages */}
          <Route
            path="/projects/cs/resolute"
            element={
              <Suspense fallback={null}>
                <Resolute />
              </Suspense>
            }
          />
          <Route
            path="/projects/cs/audit"
            element={
              <Suspense fallback={null}>
                <Audit />
              </Suspense>
            }
          />
          <Route
            path="/projects/cs/anomaly"
            element={
              <Suspense fallback={null}>
                <Anomaly />
              </Suspense>
            }
          />
          <Route
            path="/projects/cs/escalation"
            element={
              <Suspense fallback={null}>
                <Escalation />
              </Suspense>
            }
          />
          <Route
            path="/projects/cs/training"
            element={
              <Suspense fallback={null}>
                <Training />
              </Suspense>
            }
          />

          <Route path="/vault" element={<Vault />} />
        </Routes>
      </BrowserRouter>
    </CursorProvider>
  </StrictMode>,
);
