"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AdminSidebarContextValue {
  collapsed: boolean;
  toggle: () => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextValue | null>(null);
const STORAGE_KEY = "admin_sidebar_collapsed";

export function AdminSidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Starts expanded on both server and client to avoid a hydration
    // mismatch, then picks up the saved state here, after mount.
    const stored = localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored === "1") setCollapsed(true);
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  };

  return (
    <AdminSidebarContext.Provider value={{ collapsed, toggle }}>
      {children}
    </AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  const ctx = useContext(AdminSidebarContext);
  if (!ctx) throw new Error("useAdminSidebar must be used within <AdminSidebarProvider>");
  return ctx;
}
