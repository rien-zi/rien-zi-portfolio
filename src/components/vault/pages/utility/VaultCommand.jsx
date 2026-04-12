import React, { useEffect, useState } from "react";

const VaultCommand = ({ open, onClose, messages, onSelect, onFilter }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  if (!open) return null;

  const isCommand = query.startsWith("/");
  const isSearching = !isCommand && query.length > 0;

  /* SEARCH */
  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.email.toLowerCase().includes(query.toLowerCase()),
  );

  /* COMMAND PARSER */
  const runCommand = (cmd) => {
    const parts = cmd.replace("/", "").split(" ");

    if (parts[0] === "clear") {
      onFilter("clear");
      return;
    }

    if (parts[0] === "priority") {
      onFilter("priority", capitalize(parts[1]));
      return;
    }

    if (parts[0] === "filter") {
      const [key, value] = parts[1].split(":");
      onFilter(key, value);
      return;
    }
  };

  const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center pt-32">
      <div className="w-full max-w-xl bg-[#0f1115] rounded-xl">
        {/* INPUT */}
        <input
          autoFocus
          placeholder="Search or type /command"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isCommand) {
              runCommand(query);
              onClose();
            }
          }}
          className="w-full px-4 py-3 border-b outline-none bg-transparent"
        />

        {/* SEARCH RESULTS */}
        {isSearching && (
          <div>
            {filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  onSelect(msg);
                  onClose();
                }}
                className="px-4 py-2 hover:bg-white/5 cursor-pointer"
              >
                {msg.name}
              </div>
            ))}
          </div>
        )}

        {/* COMMAND HELP */}
        {!isSearching && (
          <div className="p-4 text-sm space-y-2 text-white/60">
            <div>/filter status:replied</div>
            <div>/priority high</div>
            <div>/clear</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultCommand;
