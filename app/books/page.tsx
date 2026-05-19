"use client";

import { useMemo, useState } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { useModal } from "../../lib/useModal";
import Modal from "../../components/Modal";
import AddBookForm from "../../components/AddBookForm";
import type { Book } from "../../lib/types";

export default function Books() {
  const { state } = useLibrary();
  const { isOpen, open, close } = useModal();
  const { isOpen: isEditOpen, open: openEdit, close: closeEdit } = useModal();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [message, setMessage] = useState("");


  const filteredBooks = useMemo(
    () =>
      state.books.filter((book) =>
        selectedCategory === "All" ? true : book.category === selectedCategory
      ),
    [selectedCategory, state.books]
  );

  const handleEditClick = (book: Book) => {
    setEditingBook(book);
    openEdit();
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
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
        </div>

        <div className="my-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Total titles</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{state.books.length}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Available copies</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{state.books.reduce((sum, book) => sum + book.availableCopies, 0)}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Categories</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{state.categories.length}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center ">
              <label className="text-sm font-medium text-slate-700">Filter by category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
              >
                <option value="All">All Categories</option>
                {state.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

        <Modal isOpen={isOpen} onClose={()=>{
          close()
          setMessage("")
        }} title="Add a New Book">
          {
            message 
              ? <p>{message}</p>
              : <AddBookForm onClose={close} setMessage={setMessage} />
          }
        </Modal>

        <Modal isOpen={isEditOpen} onClose={() => { setEditingBook(null); closeEdit(); }} title="Edit Book">

          {
            message 
              ? <p>{message}</p>
              :
              <AddBookForm 
                onClose={() => { setEditingBook(null); closeEdit(); }} 
                bookToEdit={editingBook ?? undefined} 
                setMessage={setMessage}
                />
          }
        </Modal>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Author</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Category</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Available</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Borrowed</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                    No books found for this category.
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{book.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{book.author}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{book.category}</td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">{book.availableCopies}</td>
                    <td className="px-6 py-4 text-right text-sm text-slate-600">{book.borrowCount}</td>
                    <td className="px-6 py-4 text-right text-sm">
                      <button
                        onClick={() => handleEditClick(book)}
                        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-slate-700"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
