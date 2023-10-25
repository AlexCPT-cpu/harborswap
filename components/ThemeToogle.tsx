"use client";

import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
      setTheme(currentTheme);
    } else {
      setTheme("light");
    }
  }, [setTheme]);

  const themeHandler = (theme: string) => {
    setTheme(theme);
    localStorage.setItem("theme", theme.toString());
  };
  return (
    <button>
      {theme === "light" ? (
        <MoonIcon onClick={() => themeHandler("dark")} className="w-8 lg:w-9" />
      ) : (
        <SunIcon onClick={() => themeHandler("light")} className="w-8 lg:w-9" />
      )}
    </button>
  );
}
