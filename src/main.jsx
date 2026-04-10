import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

// Import your project synopsis components
import Resolute from "./components/projects/cs/Resolute.jsx";
import Audit from "./components/projects/cs/Audit.jsx";
import Anomaly from "./components/projects/cs/Anomaly.jsx";
import Escalation from "./components/projects/cs/Escalation.jsx";
import Training from "./components/projects/cs/Training.jsx";

import { CursorProvider } from "./components/cursor/CursorContext";
import CustomCursor from "./components/cursor/CustomCursor";
import CursorLayer from "./components/cursor/CursorLayer";

// ✅ Import ScrollToTop
import ScrollToTop from "./components/ScrollToTop.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CursorProvider>
      <BrowserRouter>
        <ScrollToTop />

        <CursorLayer />
        <CustomCursor />

        <Routes>
          {/* Root portfolio page */}
          <Route path="/" element={<App />} />

          {/* Project detail pages */}
          <Route path="/projects/cs/resolute" element={<Resolute />} />
          <Route path="/projects/cs/audit" element={<Audit />} />
          <Route path="/projects/cs/anomaly" element={<Anomaly />} />
          <Route path="/projects/cs/escalation" element={<Escalation />} />
          <Route path="/projects/cs/training" element={<Training />} />
        </Routes>
      </BrowserRouter>
    </CursorProvider>
  </StrictMode>,
);
