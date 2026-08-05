"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Banknote,
  CalendarDays,
  GalleryHorizontal,
  HandCoins,
  HandHeart,
  Images,
  LayoutGrid,
  Newspaper,
  Users,
} from "lucide-react";

import { useAdminSidebar } from "@/components/site/admin/admin-sidebar-context";

export const ADMIN_NAV = [
  { href: "/admin", label: "Overview", icon: LayoutGrid },
  { href: "/admin/hero-slides", label: "Hero Slides", icon: GalleryHorizontal },
  { href: "/admin/campaigns", label: "Campaigns", icon: Banknote },
  { href: "/admin/donations", label: "Donations", icon: HandCoins },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/blog", label: "News", icon: Newspaper },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/volunteers", label: "Volunteers", icon: Users },
  { href: "/admin/zakat", label: "Zakat Settings", icon: HandHeart },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { collapsed } = useAdminSidebar();

  return (
    <aside
      className={`hidden shrink-0 flex-col overflow-hidden border-r bg-sidebar py-5 transition-[width,padding] duration-200 md:flex ${
        collapsed ? "w-0 border-r-0 px-0" : "w-56 px-3"
      }`}
    >
      <Link
        href="/admin"
        className="mb-6 flex items-center gap-2 px-2 text-sm font-bold whitespace-nowrap text-primary"
      >
        <Image src="/logo.jpg" alt="AICT Global Bangladesh" width={28} height={28} className="h-7 w-7 shrink-0 rounded-lg object-cover" priority />
        AICT Global Bangladesh
      </Link>

      <nav className="flex flex-col gap-0.5">
        {ADMIN_NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
