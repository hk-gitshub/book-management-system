"use client";

import { useMemo, useState } from "react";
import { useLibrary } from "../../context/LibraryContext";
import { useModal } from "../../lib/useModal";
import Modal from "../../components/Modal";
import AddBookForm from "../../components/AddBookForm";
import Button from "../../components/ui/Button";
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
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-8 sm:rounded-3xl sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <h1 className="break-words text-2xl font-semibold text-slate-900 sm:text-3xl">Books</h1>
              <p className="mt-2 text-slate-600">View the library inventory, book categories, availability, and borrow counts.</p>
            </div>
            <Button
              onClick={open}
              size="sm"
              className="shrink-0 self-start whitespace-nowrap md:self-auto"
            >
              + Add Book
            </Button>
          </div>
        </div>

        <div className="my-6 flex flex-col gap-4 lg:my-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid min-w-0 gap-3 sm:grid-cols-3">
              <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                <p className="break-words text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-xs">Total titles</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{state.books.length}</p>
              </div>
              <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                <p className="break-words text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-xs">Available copies</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{state.books.reduce((sum, book) => sum + book.availableCopies, 0)}</p>
              </div>
              <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                <p className="break-words text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-xs">Categories</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{state.categories.length}</p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <label className="shrink-0 text-sm font-medium text-slate-700">Filter by category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none sm:w-56"
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

        <section className="space-y-3 md:hidden">
          {filteredBooks.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center text-sm text-slate-500 shadow-sm">
              No books found for this category.
            </div>
          ) : (
            filteredBooks.map((book) => (
              <div key={book.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="break-words text-base font-semibold text-slate-900">{book.title}</h2>
                    <p className="mt-1 break-words text-sm text-slate-600">{book.author}</p>
                  </div>
                  <Button
                    onClick={() => handleEditClick(book)}
                    size="xs"
                    className="shrink-0 uppercase tracking-[0.1em]"
                  >
                    Edit
                  </Button>
                </div>

                <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div className="min-w-0">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Category</dt>
                    <dd className="mt-1 break-words text-slate-900">{book.category}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Available</dt>
                    <dd className="mt-1 font-semibold text-slate-900">{book.availableCopies}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Borrowed</dt>
                    <dd className="mt-1 text-slate-900">{book.borrowCount}</dd>
                  </div>
                </dl>
              </div>
            ))
          )}
        </section>

        <section className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="w-[24%] px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 lg:px-6 lg:tracking-[0.16em]">Title</th>
                <th className="w-[18%] px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 lg:px-6 lg:tracking-[0.16em]">Author</th>
                <th className="w-[17%] px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 lg:px-6 lg:tracking-[0.16em]">Category</th>
                <th className="w-[14%] px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 lg:px-6 lg:tracking-[0.16em]">Available</th>
                <th className="w-[14%] px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 lg:px-6 lg:tracking-[0.16em]">Borrowed</th>
                <th className="w-[13%] px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 lg:px-6 lg:tracking-[0.16em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500 lg:px-6">
                    No books found for this category.
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td className="break-words px-4 py-4 text-sm font-medium text-slate-900 lg:px-6">{book.title}</td>
                    <td className="break-words px-4 py-4 text-sm text-slate-600 lg:px-6">{book.author}</td>
                    <td className="break-words px-4 py-4 text-sm text-slate-600 lg:px-6">{book.category}</td>
                    <td className="px-4 py-4 text-right text-sm font-semibold text-slate-900 lg:px-6">{book.availableCopies}</td>
                    <td className="px-4 py-4 text-right text-sm text-slate-600 lg:px-6">{book.borrowCount}</td>
                    <td className="px-4 py-4 text-right text-sm lg:px-6">
                      <Button
                        onClick={() => handleEditClick(book)}
                        size="xs"
                        className="uppercase tracking-[0.12em] lg:px-4 lg:tracking-[0.16em]"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </section>
      </div>
    </main>
  );
}
