import React, { useState } from "react";
import { getSupabase } from "../../../lib/supabase";

const priorityMap = ["Low", "Medium", "High"];

const VaultTickets = ({
  messages,
  active,
  setActive,
  draft,
  setDraft,
  refresh,
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);

  const totalPages = Math.ceil(messages.length / limit) || 1;
  const paginated = messages.slice((page - 1) * limit, page * limit);

  const handleUpdate = async () => {
    const supabase = await getSupabase(); // ✅

    await supabase
      .from("contact_messages")
      .update({
        category: draft.category,
        status: draft.status,
        priority: draft.priority,
        notes: draft.notes || null,
      })
      .eq("id", draft.id);

    refresh();
  };

  return (
    <div className="flex gap-6 h-full">
      {/* ================= LEFT LIST ================= */}
      <div className="w-[320px] glass p-3 flex flex-col ">
        <div className="flex-1 overflow-y-auto space-y-2">
          {paginated.map((msg) => (
            <div
              key={msg.id}
              onClick={() => {
                setActive(msg);
                setDraft({ ...msg, notes: msg.notes || "" });
              }}
              className={`p-3 rounded cursor-pointer border transition-all
                ${
                  active?.id === msg.id
                    ? "border-[var(--accent)] bg-[var(--hover-bg)]"
                    : "border-[var(--border-primary)] hover:bg-[var(--hover-bg)]"
                }`}
            >
              {/* TOP ROW */}
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium truncate">{msg.name}</p>

                {/* PRIORITY DOT */}
                <div
                  className={`w-2 h-2 rounded-full
                    ${
                      msg.priority === 2
                        ? "bg-red-400"
                        : msg.priority === 1
                          ? "bg-yellow-400"
                          : "bg-gray-400"
                    }`}
                />
              </div>

              {/* EMAIL */}
              <p className="text-xs opacity-60 truncate">{msg.email}</p>

              {/* PREVIEW */}
              <p className="text-xs line-clamp-2 opacity-80 mt-1">
                {msg.message}
              </p>

              {/* TAGS */}
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="text-[10px] px-2 py-[2px] rounded bg-[var(--accent)] text-white">
                  {msg.category || "New"}
                </span>

                <span className="text-[10px] px-2 py-[2px] rounded border border-[var(--border-primary)]">
                  {msg.status || "new"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between text-xs mt-2 items-center">
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="ui-select text-xs"
          >
            <option value={30}>30</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Prev
            </button>

            <span>
              {page}/{totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ================= RIGHT WORKSPACE ================= */}
      <div className="flex-1 glass p-6 flex flex-col">
        {!draft ? (
          <div className="flex items-center justify-center h-full opacity-40">
            Select a ticket
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-medium">{draft.name}</h2>
                <p className="text-sm opacity-60">{draft.email}</p>
              </div>

              {/* STATUS BADGE */}
              <span className="px-3 py-1 text-xs rounded bg-[var(--accent)] text-white">
                {draft.status || "new"}
              </span>
            </div>

            {/* MESSAGE THREAD */}
            <div className="flex-1 overflow-y-auto mb-4">
              <div className="glass p-3 text-sm">{draft.message}</div>
            </div>

            {/* CONTROLS */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <select
                className="ui-select"
                value={draft.category || ""}
                onChange={(e) =>
                  setDraft({ ...draft, category: e.target.value })
                }
              >
                <option value="">Category</option>
                <option value="Hiring">Hiring</option>
                <option value="Collaboration">Collaboration</option>
                <option value="Freelance">Freelance</option>
                <option value="Spam">Spam</option>
                <option value="Other">Other</option>
              </select>

              <select
                className="ui-select"
                value={draft.priority || 0}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    priority: Number(e.target.value),
                  })
                }
              >
                <option value={0}>Low</option>
                <option value={1}>Medium</option>
                <option value={2}>High</option>
              </select>

              <select
                className="ui-select"
                value={draft.status || "new"}
                onChange={(e) => setDraft({ ...draft, status: e.target.value })}
              >
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            </div>

            {/* NOTES */}
            <textarea
              placeholder="Internal notes..."
              className="ui-input mb-4 h-[100px]"
              value={draft.notes || ""}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            />

            {/* ACTION BAR */}
            <div className="flex justify-between items-center">
              <div className="text-xs opacity-50">Last updated just now</div>

              <button
                onClick={handleUpdate}
                className="ui-button-primary px-4 py-2"
              >
                Update Ticket
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VaultTickets;
