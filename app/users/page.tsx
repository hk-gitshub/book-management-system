"use client";

import { useLibrary } from "../../context/LibraryContext";
import { useModal } from "../../lib/useModal";
import Modal from "../../components/Modal";
import AddStudentForm from "../../components/AddStudentForm";
import Button from "../../components/ui/Button";
import { useMemo, useState } from "react";

export default function Users() {
  const { state } = useLibrary();
  const { isOpen, open, close } = useModal();
  const [message, setMessage] = useState("");
  const booksById = useMemo(() => {
    return new Map(state.books.map((book) => [book.id, book]));
  }, [state.books]);


  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-8 sm:rounded-3xl sm:p-8 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-semibold text-slate-900 sm:text-3xl">Students</h1>
            <p className="mt-2 text-slate-600">Review student records, active loans, and borrowing history.</p>
          </div>
          <Button
            onClick={open}
            size="sm"
            className="shrink-0 self-start whitespace-nowrap md:self-auto"
          >
            + Add Student
          </Button>
        </div>

        <Modal isOpen={isOpen} onClose={()=>{
          close()
          setMessage("")
        }} title="Add a New Student">
          {
            message ? <p>{message}</p>
              :<AddStudentForm onClose={close} setMessage={setMessage} />
          }
        </Modal>

        <section className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {state.students.map((student) => (
            <div key={student.id} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
              <h2 className="break-words text-lg font-semibold text-slate-900 sm:text-xl">{student.name}</h2>
              <p className="mt-1 text-sm text-slate-500">Grade {student.grade}</p>
              <p className="mt-4 text-sm text-slate-600">Active books: {student.borrowedBooks.length}</p>
              <ul className="mt-4 space-y-2 break-words text-sm text-slate-600">
                {student.borrowedBooks.length > 0 ? (
                  student.borrowedBooks.map((bookId) => (
                    <li key={bookId}>- {booksById.get(bookId)?.title ?? bookId}</li>
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
