import React, { useState } from "react";

const VaultLogin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section className="h-screen flex items-center justify-center relative">
      <div className="absolute w-[500px] h-[500px] bg-[var(--accent)] opacity-20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-[var(--accent-2)] opacity-20 blur-[100px] rounded-full bottom-[-100px] right-[-100px]" />

      <div className="ui-panel p-8 w-full max-w-sm z-10">
        <h1 className="text-center text-2xl font-logo text-white mb-4">
          rien-zi's Vault
        </h1>

        <input
          className="ui-input w-full mb-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="ui-input w-full mb-4"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={() => onLogin(email, password)}
          className="ui-button-primary w-full"
        >
          Enter Vault
        </button>
      </div>
    </section>
  );
};

export default VaultLogin;
