"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLibrary } from "../context/LibraryContext";

export default function Home() {
  const { state } = useLibrary();

  const summary = useMemo(() => {
    const totalBooks = state.books.length;
    const activeLoans = state.loans.filter((loan) => loan.status === "active" || loan.status === "overdue").length;
    const overdueLoans = state.loans.filter((loan) => loan.status === "overdue").length;
    const topCategory = state.books.reduce<Record<string, number>>((counts, book) => {
      counts[book.category] = (counts[book.category] ?? 0) + book.borrowCount;
      return counts;
    }, {});
    const bestCategory = Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

    return { totalBooks, activeLoans, overdueLoans, bestCategory };
  }, [state.books, state.loans]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Book Management System
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
            Dashboard overview
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Manage books, students, loans, and overdue tracking from a central dashboard.
            Use the navigation links above and the cards below to explore each section.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Link href="/books" className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Total Books</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{summary.totalBooks}</p>
            <p className="mt-2 text-sm text-slate-500">Browse and manage book inventory.</p>
          </Link>

          <Link href="/loan-management" className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Active Loans</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{summary.activeLoans}</p>
            <p className="mt-2 text-sm text-slate-500">Issue and return books from one place.</p>
          </Link>

          <Link href="/users" className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Overdue</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{summary.overdueLoans}</p>
            <p className="mt-2 text-sm text-slate-500">Review students with late returns.</p>
          </Link>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Top Category</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{summary.bestCategory}</p>
            <p className="mt-2 text-sm text-slate-500">Most borrowed category in the library.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
