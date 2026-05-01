import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const ThemeContext = createContext(undefined);
const THEME_STORAGE_KEY = "app-theme";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export function ThemeProvider({ children }) {
  const location = useLocation();
  const [theme, setTheme] = useState(getInitialTheme);
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const root = document.documentElement;
    const shouldUseDarkMode = theme === "dark" && !isAdminRoute;
    root.classList.toggle("dark", shouldUseDarkMode);
    root.style.colorScheme = shouldUseDarkMode ? "dark" : "light";
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme, isAdminRoute]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      toggleTheme: () => setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark")),
      setTheme,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }
  return context;
};
