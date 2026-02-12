"use client";

import { useEffect } from "react";
import { Moon } from "lucide-react";

export default function ThemeToggle() {
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");

    localStorage.setItem(
      "theme",
      html.classList.contains("dark") ? "dark" : "light"
    );
  };

  return (
    <button onClick={toggleTheme}>
      <Moon size={20} />
    </button>
  );
}
