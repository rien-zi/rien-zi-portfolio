import React, { useEffect, useState, useRef } from "react";
import { getSupabase } from "../../lib/supabase";

import VaultSummary from "./pages/VaultSummary";
import VaultTickets from "./pages/VaultTickets";
import VaultLogin from "./pages/VaultLogin";

import VaultFilters from "./pages/utility/VaultFilters";
import VaultCommand from "./pages/utility/VaultCommand";
import { useVaultAuth } from "./pages/utility/useVaultAuth";
import { categories, statusOptions } from "./pages/utility/vaultConfig";

import { MdDashboard, MdConfirmationNumber } from "react-icons/md";
import {
  TbLayoutSidebarLeftCollapseFilled,
  TbLayoutSidebarLeftExpandFilled,
} from "react-icons/tb";

import { FaFilter } from "react-icons/fa";

import VaultBlob from "./components/VaultBlob";

import { createPortal } from "react-dom";

const Vault = () => {
  const { user, login, logout } = useVaultAuth();

  const [messages, setMessages] = useState([]);
  const [view, setView] = useState("summary");

  const [filters, setFilters] = useState({
    category: [],
    status: [],
    priority: [],
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  const [active, setActive] = useState(null);
  const [draft, setDraft] = useState(null);

  const [cmdOpen, setCmdOpen] = useState(false);

  const [collapsed, setCollapsed] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const popupRef = useRef(null);

  /* FETCH */
  const fetchMessages = async () => {
    const supabase = await getSupabase(); // ✅

    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    setMessages(data || []);
  };

  useEffect(() => {
    if (user) fetchMessages();
  }, [user]);

  useEffect(() => {
    if (!showFilterPopup) return;

    const handler = (e) => {
      // 🔥 FIX: use ref instead of closest
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowFilterPopup(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [showFilterPopup]);

  /* FILTER */
  const filteredMessages = messages.filter((m) => {
    const category = m.category || "New";
    const status = m.status || "new";
    const priority = ["Low", "Medium", "High"][m.priority || 0];

    return (
      (appliedFilters.category.length === 0 ||
        appliedFilters.category.includes(category)) &&
      (appliedFilters.status.length === 0 ||
        appliedFilters.status.includes(status)) &&
      (appliedFilters.priority.length === 0 ||
        appliedFilters.priority.includes(priority))
    );
  });

  if (!user) return <VaultLogin onLogin={login} />;

  return (
    <div className="h-screen flex relative">
      {/* SIDEBAR */}
      <div
        className={`glass p-3 flex flex-col my-[8vh] h-[calc(100vh-16vh)] ml-3 transition-all duration-300
        ${collapsed ? "w-[70px] !border !border-[var(--accent)]" : "w-[260px]"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center">
          {!collapsed && (
            <span className="text-xl font-logo text-[var(--accent)]">
              rien-zi's Vault
            </span>
          )}
          {collapsed && (
            <span className="text-lg font-logo text-[var(--accent)]">RZ</span>
          )}
        </div>

        {/* DIVIDER */}
        <div className="my-4 border-t border-[var(--border-primary)]" />

        <div className="flex flex-col h-full">
          {/* NAV */}
          <div className="space-y-1">
            <button
              onClick={() => setView("summary")}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm w-full
                ${
                  view === "summary"
                    ? "bg-[var(--accent)] text-[var(--text-dark-btn)]"
                    : "hover:bg-[var(--hover-bg)]"
                }`}
            >
              <MdDashboard className="text-lg" />
              {!collapsed && <span>Summary</span>}
            </button>

            <button
              onClick={() => setView("tickets")}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm w-full
                ${
                  view === "tickets"
                    ? "bg-[var(--accent)] text-[var(--text-dark-btn)]"
                    : "hover:bg-[var(--hover-bg)]"
                }`}
            >
              <MdConfirmationNumber className="text-lg" />
              {!collapsed && <span>Tickets</span>}
            </button>
          </div>

          {/* DIVIDER */}
          <div className="my-4 border-t border-[var(--border-primary)]" />

          {/* FILTERS */}
          {!collapsed ? (
            <div className="flex-1 overflow-y-auto scrollbar-hide pr-1">
              <VaultFilters
                categories={categories}
                statusOptions={statusOptions}
                priorityOptions={["Low", "Medium", "High"]}
                filters={filters}
                setFilters={setFilters}
                onApply={(f) => setAppliedFilters(f)}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-start justify-center pt-2 relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFilterPopup((p) => !p);
                }}
                className="p-2 rounded hover:bg-[var(--hover-bg)]"
                title="Filters"
              >
                <FaFilter />
              </button>

              {/* POPUP */}
              {showFilterPopup &&
                createPortal(
                  <div
                    ref={popupRef}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="fixed z-[9999] filter-popup"
                    style={{
                      top: "120px", // adjust if needed
                      left: collapsed ? "90px" : "280px",
                    }}
                  >
                    <div className="glass p-3 shadow-2xl w-[260px]">
                      <VaultFilters
                        categories={categories}
                        statusOptions={statusOptions}
                        priorityOptions={["Low", "Medium", "High"]}
                        filters={filters}
                        setFilters={setFilters}
                        onApply={(f) => {
                          setAppliedFilters(f);
                          setShowFilterPopup(false);
                        }}
                      />
                    </div>
                  </div>,
                  document.body,
                )}
            </div>
          )}

          {/* ✅ TOGGLE (always bottom) */}
          <div
            className={`mt-auto flex ${
              collapsed ? "justify-center" : "justify-end"
            }`}
          >
            <button
              onClick={() => setCollapsed((p) => !p)}
              className="text-xl opacity-60 hover:opacity-100"
            >
              {collapsed ? (
                <TbLayoutSidebarLeftExpandFilled />
              ) : (
                <TbLayoutSidebarLeftCollapseFilled />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex justify-center relative z-0">
        <div className="w-full max-w-[1400px] my-[6vh] h-[calc(100vh-12vh)] overflow-y-auto scrollbar-hide p-6">
          {view === "summary" && <VaultSummary messages={filteredMessages} />}

          {view === "tickets" && (
            <VaultTickets
              messages={filteredMessages}
              active={active}
              setActive={setActive}
              draft={draft}
              setDraft={setDraft}
              refresh={fetchMessages}
            />
          )}
        </div>

        <VaultCommand
          open={cmdOpen}
          onClose={() => setCmdOpen(false)}
          messages={messages}
        />

        <VaultBlob logout={logout} />
      </div>
    </div>
  );
};

export default Vault;
