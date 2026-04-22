import React from "react";
import FocusLock from "react-focus-lock";
import { Link } from "react-router-dom";

const NavMenu = ({ open, onClose }) => {
  if (!open) return null;

  const links = [
    ["/projects", "My Projects"],
    ["/skills", "Skills & Stacks"],
    ["/career", "Career Journey"],
    ["/contact", "Contact Me"],
  ];

  return (
    <FocusLock returnFocus>
      <div
        className="absolute top-12 right-0 w-48 rounded-lg py-2 text-sm z-50 backdrop-blur
        bg-[var(--bg-overlay)]
        border border-[var(--border-primary)]
        shadow-[var(--shadow-md)]"
      >
        {links.map(([to, label]) => (
          <Link
            key={to}
            to={to}
            onClick={onClose}
            className="block px-4 py-2 transition
            text-[var(--text-primary)]
            hover:bg-[var(--hover-bg)]
            hover:text-[var(--accent)]"
          >
            {label}
          </Link>
        ))}
      </div>
    </FocusLock>
  );
};

export default NavMenu;
