"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/books", label: "Books" },
  { href: "/users", label: "Students" },
  { href: "/loan-management", label: "Loan Management" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200 bg-white/95 px-3 py-4 shadow-sm backdrop-blur-sm sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-sm sm:tracking-[0.3em]">Library System</p>
          <p className="break-words text-2xl font-semibold leading-tight text-slate-900 sm:text-2xl">Book Management</p>
        </div>
        <nav className="flex flex-wrap gap-2 sm:gap-3 lg:shrink-0">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition sm:px-4 ${
                  active
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
