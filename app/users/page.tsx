"use client";

import { useLibrary } from "../../context/LibraryContext";

export default function Users() {
  const { state } = useLibrary();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Students</h1>
          <p className="mt-2 text-slate-600">Review student records, active loans, and borrowing history.</p>
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          {state.students.map((student) => (
            <div key={student.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{student.name}</h2>
              <p className="mt-1 text-sm text-slate-500">Grade {student.grade}</p>
              <p className="mt-4 text-sm text-slate-600">Active books: {student.borrowedBooks.length}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {student.borrowedBooks.length > 0 ? (
                  student.borrowedBooks.map((bookId) => (
                    <li key={bookId}>• {state.books.find((book) => book.id === bookId)?.title ?? bookId}</li>
                  ))
                ) : (
                  <li>No active loans</li>
                )}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
