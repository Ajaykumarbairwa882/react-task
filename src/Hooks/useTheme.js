import { useEffect, useState } from "react";

const useTheme = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("github-theme") || "dark");

  useEffect(() => {
    localStorage.setItem("github-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  };

  return {
    theme,
    isDark: theme === "dark",
    toggleTheme,
  };
};

export default useTheme;
