"use client";

import { useState } from "react";
import { useLibrary } from "../context/LibraryContext";
import type { Book } from "../lib/types";

interface AddBookFormProps {
  onClose: () => void;
}

export default function AddBookForm({ onClose }: AddBookFormProps) {
  const { dispatch, state } = useLibrary();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    totalCopies: 1,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalCopies" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.author || !formData.category) {
      setMessage("Please fill all fields.");
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
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Title</span>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
          placeholder="Enter book title"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Author</span>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
          placeholder="Enter author name"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Category</span>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
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
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
        />
      </label>

      {message && <p className="text-sm text-slate-600">{message}</p>}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Add Book
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
