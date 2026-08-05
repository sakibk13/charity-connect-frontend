"use client";

import { useEffect } from "react";

export function ThemeInit() {
  useEffect(() => {
    const theme = localStorage.getItem("charity_connect_theme") || "light";
    document.body.classList.toggle("dark-mode", theme === "dark");
  }, []);

  return null;
}
