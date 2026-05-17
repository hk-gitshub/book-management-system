"use client";

import { useLibrary } from "../../context/LibraryContext";
import { useModal } from "../../lib/useModal";
import Modal from "../../components/Modal";
import AddStudentForm from "../../components/AddStudentForm";

export default function Users() {
  const { state } = useLibrary();
  const { isOpen, open, close } = useModal();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Students</h1>
            <p className="mt-2 text-slate-600">Review student records, active loans, and borrowing history.</p>
          </div>
          <button
            onClick={open}
            className="rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-700"
          >
            + Add Student
          </button>
        </div>

        <Modal isOpen={isOpen} onClose={close} title="Add a New Student">
          <AddStudentForm onClose={close} />
        </Modal>

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
