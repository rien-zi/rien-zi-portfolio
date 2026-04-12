import { useEffect, useState } from "react";

const themes = ["dark", "light", "aurora", "solarized", "neon", "dracula"];

export const useTheme = () => {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "dark"
    );

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const nextTheme = () => {
        const idx = themes.indexOf(theme);
        const next = themes[(idx + 1) % themes.length];
        setTheme(next);
    };

    return { theme, nextTheme };
};