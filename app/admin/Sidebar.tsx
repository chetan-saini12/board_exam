"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV = [
  { href: "/admin", label: "Tickets", icon: "🎫" },
  { href: "/admin/agents", label: "Agents", icon: "👤" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => setOpen(false), [pathname]);

  const navLinks = NAV.map((item) => {
    const active =
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
          active
            ? "bg-blue-50 text-blue-700"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <span>{item.icon}</span>
        {item.label}
      </Link>
    );
  });

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex fixed top-16 left-0 h-[calc(100vh-4rem)] w-56 bg-white border-r border-gray-100 shadow-sm flex-col py-6 px-3 gap-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3">
          Menu
        </p>
        {navLinks}
      </aside>

      {/* ── Mobile burger button ── */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-[1.1rem] left-4 z-50 p-2 rounded-lg bg-white border border-gray-200 shadow-sm text-gray-700"
        aria-label="Open menu"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="5" x2="17" y2="5" />
          <line x1="3" y1="10" x2="17" y2="10" />
          <line x1="3" y1="15" x2="17" y2="15" />
        </svg>
      </button>

      {/* ── Mobile overlay backdrop ── */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-56 z-50 bg-white shadow-xl flex flex-col py-6 px-3 gap-1 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-3 mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Menu
          </p>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-700"
            aria-label="Close menu"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="3" x2="15" y2="15" />
              <line x1="15" y1="3" x2="3" y2="15" />
            </svg>
          </button>
        </div>
        {navLinks}
      </aside>
    </>
  );
}
