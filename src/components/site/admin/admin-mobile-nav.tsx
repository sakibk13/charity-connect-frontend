"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ADMIN_NAV } from "@/components/site/admin/admin-sidebar";

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-b bg-card px-4 py-2 md:hidden">
      {ADMIN_NAV.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
