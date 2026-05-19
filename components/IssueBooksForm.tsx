"use client"

import { useMemo, useState } from "react";
import { useLibrary } from "@/context/LibraryContext";
import Button from "./ui/Button";
import type { Dispatch, SetStateAction } from "react";

interface IssueBooksFormProps {
  onClose: () => void;
  setMessage: Dispatch<SetStateAction<string>>;
}

function IssueBooksForm({ onClose, setMessage }: IssueBooksFormProps) {
  const { state, dispatch } = useLibrary();
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().slice(0, 10);
  });
  // const [message, setMessage] = useState("");
  const booksById = useMemo(() => {
    return new Map(state.books.map((book) => [book.id, book]));
  }, [state.books]);

  const activeLoanKeys = useMemo(() => {
    return new Set(
      state.loans
        .filter((loan) => loan.status !== "returned")
        .map((loan) => `${loan.studentId}:${loan.bookId}`)
    );
  }, [state.loans]);

  const handleIssue = () => {
    if (!selectedStudent || !selectedBook) {
      setMessage("Please select a student and a book before issuing.");
      return;
    }

    const book = booksById.get(selectedBook);
    if (!book) {
      setMessage("Selected book not found.");
      return;
    }

    if (book.availableCopies <= 0) {
      setMessage("This book is not available for issue.");
      return;
    }

    if (activeLoanKeys.has(`${selectedStudent}:${selectedBook}`)) {
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

    setMessage("Congrtualation, Book issued successfully.");
    setTimeout(() => {
      onClose();
      setMessage("");
    }, 800);
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
          <option value="">Choose a Student</option>
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
          <option value="">Choose a Book</option>
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

      <Button
        onClick={handleIssue}
      >
        Issue Book
      </Button>

      {/* {message ? <p className="text-sm text-slate-600">{message}</p> : null} */}
    </div>
  );
}

export default IssueBooksForm;
