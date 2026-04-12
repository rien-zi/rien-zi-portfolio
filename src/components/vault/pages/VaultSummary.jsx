import React from "react";
import VaultAnalytics from "./utility/VaultAnalytics";

const VaultSummary = ({ messages }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass p-4 text-center">
          <p>Total</p>
          <h2>{messages.length}</h2>
        </div>

        <div className="glass p-4 text-center">
          <p>New</p>
          <h2>{messages.filter((m) => !m.category).length}</h2>
        </div>

        <div className="glass p-4 text-center">
          <p>Replied</p>
          <h2>{messages.filter((m) => m.status === "replied").length}</h2>
        </div>
      </div>
      <div className="relative z-0 flex-1 min-h-0">
        <VaultAnalytics messages={messages} />
      </div>
    </div>
  );
};

export default VaultSummary;
