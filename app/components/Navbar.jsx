"use client";

import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 shadow-sm">
      <h2 className="font-semibold text-lg">
        Financial Dashboard
      </h2>

      <ThemeToggle />
    </div>
  );
}
