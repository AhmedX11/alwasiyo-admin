"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  CalendarCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { api } from "@/lib/api";
import type { SessionUser } from "@/lib/types";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: GraduationCap },
  { href: "/teachers", label: "Teachers", icon: Users },
  { href: "/classes", label: "Classes", icon: BookOpen },
  { href: "/attendance", label: "Attendance", icon: CalendarCheck },
];

export function AppShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, set_open] = useState(false);

  async function sign_out() {
    await api("/api/auth/signout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream">
      <aside
        suppressHydrationWarning
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-forest-deep text-cream transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col px-5 py-6">
          <div className="flex items-center justify-between">
            <BrandLogo className="text-gold" mark_class="h-10 w-10" />
            <button className="lg:hidden" onClick={() => set_open(false)} type="button">
              <X className="h-5 w-5" suppressHydrationWarning />
            </button>
          </div>
          <p className="mt-8 px-2 text-[11px] uppercase tracking-[0.24em] text-gold/80">
            Child Care Home
          </p>
          <nav className="mt-3 flex flex-1 flex-col gap-1">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => set_open(false)}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition ${
                    active
                      ? "bg-white/10 text-gold"
                      : "text-cream/75 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" suppressHydrationWarning />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="mt-1 text-xs text-cream/60">{user.email}</p>
            <button
              onClick={sign_out}
              className="mt-4 inline-flex items-center gap-2 text-sm text-gold hover:text-gold-bright"
            >
              <LogOut className="h-4 w-4" suppressHydrationWarning />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {open ? (
        <button
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => set_open(false)}
          aria-label="Close menu"
        />
      ) : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-cream-dark/80 bg-cream/90 px-4 py-4 backdrop-blur sm:px-8">
          <button
            className="rounded-xl border border-cream-dark bg-white p-2 lg:hidden"
            onClick={() => set_open(true)}
          >
            <Menu className="h-5 w-5" suppressHydrationWarning />
          </button>
          <p className="hidden text-sm text-muted lg:block">
            Al Wasiyo Child Care Home · Lahore
          </p>
          <span className="rounded-full bg-forest px-3 py-1 text-xs font-medium uppercase tracking-wider text-gold">
            {user.role}
          </span>
        </header>
        <main className="px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
