"use client";

import { useMemo } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { useModal } from "@/lib/useModal";
import Modal from "@/components/Modal";
import IssueBooksForm from "@/components/IssueBooksForm";
import ReturnBooksForm from "@/components/ReturnBooksForm";

export default function LoanManagement() {
  const { state } = useLibrary();
  const { isOpen: isIssueOpen, open: openIssue, close: closeIssue } = useModal();
  const { isOpen: isReturnOpen, open: openReturn, close: closeReturn } = useModal();

  const activeLoans = useMemo(
    () => state.loans.filter((loan) => loan.status === "active" || loan.status === "overdue"),
    [state.loans]
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Loan Management</h1>
            <p className="mt-2 text-slate-600">Issue books to students and process returns from here.</p>
          </div>

          <div className="flex gap-5">
            <button
              onClick={openIssue}
              className="rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-700"
            >
              Issue a Book
            </button>

            <Modal isOpen={isIssueOpen} onClose={closeIssue} title="Issue a New Book">
              <IssueBooksForm onClose={closeIssue} />
            </Modal>

            <button
              onClick={openReturn}
              className="rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-700"
            >
              Return Book
            </button>

            <Modal isOpen={isReturnOpen} onClose={closeReturn} title="Return a Book">
              <ReturnBooksForm onClose={closeReturn} />
            </Modal>
          </div>
        </div>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Active loans</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 my-4">
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
                      Borrower: {student?.name ?? loan.studentId}
                    </p>
                    <p className="text-sm text-slate-600">
                      Due: {loan.dueDate}
                    </p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${loan.status === "overdue" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                        }`}
                    >
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
