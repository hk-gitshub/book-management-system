"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLibrary } from "../context/LibraryContext";

export default function Home() {
  const { state } = useLibrary();

  const analytics = useMemo(() => {
    const totalBooks = state.books.length;
    let activeLoans = 0;
    let overdueLoans = 0;
    let returnedLoans = 0;
    let dueSoonCount = 0;
    const loanCountByStudent = new Map<string, number>();
    const topCategory = state.books.reduce<Record<string, number>>((counts, book) => {
      counts[book.category] = (counts[book.category] ?? 0) + book.borrowCount;
      return counts;
    }, {});
    const bestCategory = Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

    const mostBorrowedBooks = [...state.books]
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, 3);

    const today = new Date();
    const dueSoonDate = new Date(today);
    dueSoonDate.setDate(today.getDate() + 3);

    for (const loan of state.loans) {
      loanCountByStudent.set(
        loan.studentId,
        (loanCountByStudent.get(loan.studentId) ?? 0) + 1
      );

      if (loan.status === "active" || loan.status === "overdue") {
        activeLoans += 1;
      }

      if (loan.status === "overdue") {
        overdueLoans += 1;
      }

      if (loan.status === "returned") {
        returnedLoans += 1;
      }

      const dueDate = new Date(loan.dueDate);
      if (loan.status === "active" && dueDate >= today && dueDate <= dueSoonDate) {
        dueSoonCount += 1;
      }
    }

    const topStudents = state.students
      .map((student) => ({
        id: student.id,
        name: student.name,
        loanCount: loanCountByStudent.get(student.id) ?? 0,
      }))
      .sort((a, b) => b.loanCount - a.loanCount)
      .slice(0, 3);

    const categoryBorrowingCounts = Object.entries(topCategory)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalBooks,
      activeLoans,
      overdueLoans,
      bestCategory,
      mostBorrowedBooks,
      topStudents,
      categoryBorrowingCounts,
      overdueTrend: {
        overdueLoans,
        activeLoans,
        returnedLoans,
        dueSoonCount,
      },
    };
  }, [state.books, state.loans, state.students]);

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
            <p className="mt-4 text-3xl font-semibold text-slate-900">{analytics.totalBooks}</p>
            <p className="mt-2 text-sm text-slate-500">Browse and manage book inventory.</p>
          </Link>

          <Link href="/loan-management" className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Active Loans</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{analytics.activeLoans}</p>
            <p className="mt-2 text-sm text-slate-500">Issue and return books from one place.</p>
          </Link>

          <Link href="/users" className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Overdue</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{analytics.overdueLoans}</p>
            <p className="mt-2 text-sm text-slate-500">Review students with late returns.</p>
          </Link>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Top Category</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{analytics.bestCategory}</p>
            <p className="mt-2 text-sm text-slate-500">Most borrowed category in the library.</p>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Most borrowed books</h2>
            <p className="mt-2 text-sm text-slate-600">Top titles by borrow count.</p>
            <ul className="mt-6 space-y-4">
              {analytics.mostBorrowedBooks.map((book) => (
                <li key={book.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{book.title}</p>
                  <p className="text-sm text-slate-600">{book.author}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">Borrowed {book.borrowCount} times</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Top students</h2>
            <p className="mt-2 text-sm text-slate-600">Students with the most loan activity.</p>
            <ul className="mt-6 space-y-4">
              {analytics.topStudents.map((student) => (
                <li key={student.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{student.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{student.loanCount} total loans</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Category borrowing counts</h2>
            <p className="mt-2 text-sm text-slate-600">Borrow volume by category.</p>
            <div className="mt-6 space-y-3">
              {analytics.categoryBorrowingCounts.map((item) => (
                <div key={item.category} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-700">{item.category}</span>
                  <span className="text-sm font-semibold text-slate-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Overdue trends</h2>
            <p className="mt-2 text-sm text-slate-600">Current loan status breakdown and due soon alerts.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-sm text-slate-500">Overdue</p>
                <p className="mt-2 text-3xl font-semibold text-rose-700">{analytics.overdueTrend.overdueLoans}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-sm text-slate-500">Active</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-700">{analytics.overdueTrend.activeLoans}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-sm text-slate-500">Returned</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{analytics.overdueTrend.returnedLoans}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-sm text-slate-500">Due soon</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{analytics.overdueTrend.dueSoonCount}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
