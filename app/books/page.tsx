"use client";

import { useLibrary } from "../../context/LibraryContext";
import { useModal } from "../../lib/useModal";
import Modal from "../../components/Modal";
import AddBookForm from "../../components/AddBookForm";

export default function Books() {
  const { state } = useLibrary();
  const { isOpen, open, close } = useModal();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Books</h1>
            <p className="mt-2 text-slate-600">View the library inventory, book categories, availability, and borrow counts.</p>
          </div>
          <button
            onClick={open}
            className="rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-700"
          >
            + Add Book
          </button>
        </div>

        <Modal isOpen={isOpen} onClose={close} title="Add a New Book">
          <AddBookForm onClose={close} />
        </Modal>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Total titles</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{state.books.length}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Available copies</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{state.books.reduce((sum, book) => sum + book.availableCopies, 0)}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Categories</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{state.categories.length}</p>
          </div>
        </div>

        <section className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Author</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Category</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Available</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Borrowed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {state.books.map((book) => (
                <tr key={book.id}>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{book.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{book.author}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{book.category}</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">{book.availableCopies}</td>
                  <td className="px-6 py-4 text-right text-sm text-slate-600">{book.borrowCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
