import React, { useState } from "react";
import { useTheme } from "../pages/utility/useTheme";
import { MdPalette, MdLogout } from "react-icons/md";
import { FaShieldAlt } from "react-icons/fa";

const VaultBlob = ({ logout }) => {
  const { nextTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="vault-blob glass">
      {/* VAULT MODE */}
      <div
        data-cursor="Vault Mode"
        className="cursor-default text-[var(--gold)] opacity-70 hover:opacity-100"
        title="Vault Mode"
      >
        <FaShieldAlt />
      </div>

      {/* THEME SWITCH */}
      <button
        data-cursor="Switch Theme"
        className="p-2 rounded-md hover:scale-150 hover:-rotate-12 transition hover:bg-transparent text-[var(--accent)]"
        onClick={nextTheme}
        title="Switch Theme"
      >
        <MdPalette />
      </button>

      {/* LOGOUT DOT */}

      <button
        data-cursor="Logout"
        className="rounded-md hover:scale-150 hover:-rotate-12 transition hover:bg-transparent text-[var(--error)] hover:text-[var(--error)]"
        onClick={logout}
      >
        <MdLogout />
      </button>
    </div>
  );
};

export default VaultBlob;
