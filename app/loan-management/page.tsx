"use client";

import { useMemo, useState } from "react";
import { useLibrary } from "../../context/LibraryContext";

export default function LoanManagement() {
  const { state, dispatch } = useLibrary();
  const [selectedStudent, setSelectedStudent] = useState(state.students[0]?.id ?? "");
  const [selectedBook, setSelectedBook] = useState(state.books[0]?.id ?? "");
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().slice(0, 10);
  });
  const [message, setMessage] = useState("");
  const [selectedLoanId, setSelectedLoanId] = useState("");

  const activeLoans = useMemo(
    () => state.loans.filter((loan) => loan.status === "active" || loan.status === "overdue"),
    [state.loans]
  );

  const handleIssue = () => {
    if (!selectedStudent || !selectedBook) {
      setMessage("Please select a student and a book before issuing.");
      return;
    }

    const book = state.books.find((item) => item.id === selectedBook);
    if (!book) {
      setMessage("Selected book not found.");
      return;
    }

    if (book.availableCopies <= 0) {
      setMessage("This book is not available for issue.");
      return;
    }

    const duplicateLoan = state.loans.some(
      (loan) =>
        loan.bookId === selectedBook &&
        loan.studentId === selectedStudent &&
        loan.status !== "returned"
    );

    if (duplicateLoan) {
      setMessage("This student already has an active loan for the selected book.");
      return;
    }

    dispatch({
      type: "ISSUE_BOOK",
      payload: {
        loan: {
          loanId: `loan-${Date.now()}`,
          bookId: selectedBook,
          studentId: selectedStudent,
          issueDate: new Date().toISOString().slice(0, 10),
          dueDate,
          status: "active",
        },
      },
    });
    setMessage("Book issued successfully.");
  };

  const handleReturn = () => {
    if (!selectedLoanId) {
      setMessage("Please choose an active loan to return.");
      return;
    }

    dispatch({
      type: "RETURN_BOOK",
      payload: {
        loanId: selectedLoanId,
        returnedDate: new Date().toISOString().slice(0, 10),
      },
    });
    setMessage("Book returned successfully.");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Loan Management</h1>
          <p className="mt-2 text-slate-600">Issue books to students and process returns from here.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Issue a Book</h2>
            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Student</span>
                <select
                  value={selectedStudent}
                  onChange={(event) => setSelectedStudent(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                >
                  {state.students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Book</span>
                <select
                  value={selectedBook}
                  onChange={(event) => setSelectedBook(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                >
                  {state.books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} — {book.availableCopies} available
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Due date</span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                />
              </label>

              <button
                type="button"
                onClick={handleIssue}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Issue Book
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Return a Book</h2>
            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Active loan</span>
                <select
                  value={selectedLoanId}
                  onChange={(event) => setSelectedLoanId(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                >
                  <option value="">Choose a loan</option>
                  {activeLoans.map((loan) => {
                    const student = state.students.find((item) => item.id === loan.studentId);
                    const book = state.books.find((item) => item.id === loan.bookId);
                    return (
                      <option key={loan.loanId} value={loan.loanId}>
                        {student?.name} — {book?.title} ({loan.status})
                      </option>
                    );
                  })}
                </select>
              </label>
              <button
                type="button"
                onClick={handleReturn}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Process Return
              </button>

              {message ? <p className="text-sm text-slate-600">{message}</p> : null}
            </div>
          </section>
        </div>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Active loans</h2>
          <div className="mt-6 space-y-4">
            {activeLoans.length === 0 ? (
              <p className="text-slate-600">No active loans at the moment.</p>
            ) : (
              activeLoans.map((loan) => {
                const student = state.students.find((item) => item.id === loan.studentId);
                const book = state.books.find((item) => item.id === loan.bookId);
                return (
                  <div key={loan.loanId} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="font-semibold text-slate-900">{book?.title ?? loan.bookId}</p>
                    <p className="text-sm text-slate-600">
                      Borrower: {student?.name ?? loan.studentId} • Due: {loan.dueDate}
                    </p>
                    <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      loan.status === "overdue" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {loan.status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
