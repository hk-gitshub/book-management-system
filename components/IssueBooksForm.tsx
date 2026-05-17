"use client"

import { useState } from "react";
import { useLibrary } from "@/context/LibraryContext";

interface IssueBooksFormProps {
  onClose: () => void;
}

function IssueBooksForm({ onClose }: IssueBooksFormProps) {
  const { state, dispatch } = useLibrary();
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().slice(0, 10);
  });
  const [message, setMessage] = useState("");

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
    onClose();
  };

  return (
    <div className="space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Student</span>
        <select
          value={selectedStudent}
          onChange={(event) => setSelectedStudent(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
        >
          <option value="">Chooes a Student</option>
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
          <option value="">Chooes a Book</option>
          {state.books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title} ({book.availableCopies} available)
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

      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}

export default IssueBooksForm;
