"use client";

import { useMemo, useState } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { useModal } from "@/lib/useModal";
import Modal from "@/components/Modal";
import IssueBooksForm from "@/components/IssueBooksForm";
import ReturnBooksForm from "@/components/ReturnBooksForm";

export default function LoanManagement() {
  const { state } = useLibrary();
  const { isOpen: isIssueOpen, open: openIssue, close: closeIssue } = useModal();
  const { isOpen: isReturnOpen, open: openReturn, close: closeReturn } = useModal();

  const [message, setMessage] = useState("");
  

  const activeLoans = useMemo(
    () => state.loans.filter((loan) => loan.status === "active" || loan.status === "overdue"),
    [state.loans]
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-8 sm:rounded-3xl sm:p-8 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-semibold text-slate-900 sm:text-3xl">Loan Management</h1>
            <p className="mt-2 text-slate-600">Issue books to students and process returns from here.</p>
          </div>

          <div className="flex flex-row flex-wrap items-start gap-3 md:shrink-0 md:flex-nowrap">
            <button
              onClick={()=>{
                openIssue()
                setMessage("")
              }}
              className="shrink-0 whitespace-nowrap rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Issue a Book
            </button>

            <Modal isOpen={isIssueOpen} onClose={closeIssue} title="Issue a New Book">
              {
              message ? <p>{message}</p>
              : <IssueBooksForm onClose={closeIssue} setMessage={setMessage}/>
              }
            </Modal>

            {/* <Modal isOpen={true} onClose={()=>()} title="">

              Congretualation 
            </Modal> */}

            <button
              onClick={()=>{
                openReturn()
                setMessage("")
              }}
              className="shrink-0 whitespace-nowrap rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Return Book
            </button>

            <Modal isOpen={isReturnOpen} onClose={closeReturn} title="Return a Book">
              {
                message 
                  ? <p>{message}</p>
                  : <ReturnBooksForm onClose={closeReturn} setMessage={setMessage}/>
              }
            </Modal>
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-10 sm:rounded-3xl sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Active loans</h2>
          <div className="my-4 mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {activeLoans.length === 0 ? (
              <p className="text-slate-600 sm:col-span-2 lg:col-span-4">No active loans at the moment.</p>
            ) : (
              activeLoans.map((loan) => {
                const student = state.students.find((item) => item.id === loan.studentId);
                const book = state.books.find((item) => item.id === loan.bookId);
                return (
                  <div key={loan.loanId} className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:rounded-3xl sm:p-5">
                    <p className="break-words font-semibold text-slate-900">{book?.title ?? loan.bookId}</p>
                    <p className="break-words text-sm text-slate-600">
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
