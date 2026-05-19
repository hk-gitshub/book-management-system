"use client";

import { useEffect, useState } from "react";
import { useLibrary } from "../context/LibraryContext";
import type { Book } from "../lib/types";

interface AddBookFormProps {
  onClose: () => void;
  bookToEdit?: Book;
  setMessage?: any
}

export default function AddBookForm({ onClose, bookToEdit, setMessage }: AddBookFormProps) {
  const { dispatch, state } = useLibrary();
  // const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    title: bookToEdit?.title ?? "",
    author: bookToEdit?.author ?? "",
    category: bookToEdit?.category ?? "",
    totalCopies: bookToEdit?.totalCopies ?? 1,
  });

  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title,
        author: bookToEdit.author,
        category: bookToEdit.category,
        totalCopies: bookToEdit.totalCopies,
      });
    } else {
      setFormData({ title: "", author: "", category: "", totalCopies: 1 });
    }
  }, [bookToEdit]);

  const isEditMode = Boolean(bookToEdit);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalCopies" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // if (!formData.title || !formData.author || !formData.category) {
    //   setMessage("Please fill all fields.");
    //   return;
    // }

        const title = formData.title.trim();
    const author = formData.author.trim();

    const bookExists = state.books.some(
      (book) =>
        book.title.trim().toLowerCase() === title.toLowerCase() &&
        book.author.trim().toLowerCase() === author.toLowerCase()
    );

    if (bookExists) {
      setMessage("This book already exists.");
      return;
    }

    if (isEditMode && bookToEdit) {
      const borrowedCount = bookToEdit.totalCopies - bookToEdit.availableCopies;
      if (formData.totalCopies < borrowedCount) {
        setMessage(`Total copies must be at least ${borrowedCount} because ${borrowedCount} copies are currently borrowed.`);
        return;
      }

      const updatedBook: Book = {
        ...bookToEdit,
        title: formData.title,
        author: formData.author,
        category: formData.category,
        totalCopies: formData.totalCopies,
        availableCopies: bookToEdit.availableCopies + (formData.totalCopies - bookToEdit.totalCopies),
      };

      dispatch({ type: "UPDATE_BOOK", payload: updatedBook });
      setMessage("Book updated successfully!");
      setTimeout(() => {
        onClose();
        setMessage("")
      }, 800);
      return;
    }

    const newBook: Book = {
      id: `b${Date.now()}`,
      title: formData.title,
      author: formData.author,
      category: formData.category,
      totalCopies: formData.totalCopies,
      availableCopies: formData.totalCopies,
      borrowCount: 0,
    };

    dispatch({ type: "ADD_BOOK", payload: newBook });
    setMessage("Book added successfully!");
    setTimeout(() => {
      onClose();
      setMessage("")
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Title</span>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none sm:rounded-2xl sm:px-4 sm:py-3 sm:text-base"
          placeholder="Enter book title"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Author</span>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none sm:rounded-2xl sm:px-4 sm:py-3 sm:text-base"
          placeholder="Enter author name"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Category</span>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none sm:rounded-2xl sm:px-4 sm:py-3 sm:text-base"
          required
        >
          <option value="">Select a category</option>
          {state.categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
          <option value="Other">Other (new category)</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Total copies</span>
        <input
          type="number"
          name="totalCopies"
          value={formData.totalCopies}
          onChange={handleChange}
          min="1"
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none sm:rounded-2xl sm:px-4 sm:py-3 sm:text-base"
          required
        />
      </label>

      {/* {message && <p className="text-sm text-slate-600">{message}</p>} */}

      <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:pt-4">
        <button
          type="submit"
          className="w-full rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 sm:flex-1 sm:px-5 sm:py-3"
        >
          {isEditMode ? "Update Book" : "Add Book"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 sm:flex-1 sm:px-5 sm:py-3"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
