"use client";

import React, { createContext, useContext, useReducer } from "react";
import { books as initialBooks, students as initialStudents, loans as initialLoans, categories as initialCategories } from "../lib/mockData";
import type { Book, Student, LoanRecord, LoanStatus } from "../lib/types";

export interface LibraryState {
  books: Book[];
  students: Student[];
  loans: LoanRecord[];
  categories: string[];
}

export type LibraryAction =
  | { type: "ADD_BOOK"; payload: Book }
  | { type: "UPDATE_BOOK"; payload: Book }
  | {
      type: "ISSUE_BOOK";
      payload: {
        loan: LoanRecord;
      };
    }
  | {
      type: "RETURN_BOOK";
      payload: {
        loanId: string;
        returnedDate: string;
      };
    }
  | { type: "ADD_STUDENT"; payload: Student }
  | { type: "MARK_OVERDUE" };

const initialState: LibraryState = {
  books: initialBooks,
  students: initialStudents,
  loans: initialLoans,
  categories: initialCategories,
};

const LibraryContext = createContext<{
  state: LibraryState;
  dispatch: React.Dispatch<LibraryAction>;
} | undefined>(undefined);

function libraryReducer(state: LibraryState, action: LibraryAction): LibraryState {
  switch (action.type) {
    case "ADD_BOOK": {
      const categoryExists = state.categories.includes(action.payload.category);
      return {
        ...state,
        books: [...state.books, action.payload],
        categories: categoryExists
          ? state.categories
          : [...state.categories, action.payload.category],
      };
    }
    case "UPDATE_BOOK": {
      return {
        ...state,
        books: state.books.map((book) =>
          book.id === action.payload.id ? action.payload : book
        ),
      };
    }
    case "ISSUE_BOOK": {
      const newLoan = action.payload.loan;
      const book = state.books.find((item) => item.id === newLoan.bookId);
      const student = state.students.find((item) => item.id === newLoan.studentId);
      const duplicateLoan = state.loans.find(
        (loan) =>
          loan.bookId === newLoan.bookId &&
          loan.studentId === newLoan.studentId &&
          loan.status !== "returned"
      );

      if (!book || !student || book.availableCopies <= 0 || duplicateLoan) {
        return state;
      }

      return {
        ...state,
        books: state.books.map((item) =>
          item.id === book.id
            ? {
                ...item,
                availableCopies: item.availableCopies - 1,
                borrowCount: item.borrowCount + 1,
              }
            : item
        ),
        students: state.students.map((item) =>
          item.id === student.id
            ? { ...item, borrowedBooks: [...item.borrowedBooks, book.id] }
            : item
        ),
        loans: [...state.loans, newLoan],
      };
    }
    case "RETURN_BOOK": {
      const loan = state.loans.find((item) => item.loanId === action.payload.loanId);
      if (!loan || loan.status === "returned") {
        return state;
      }

      return {
        ...state,
        books: state.books.map((item) =>
          item.id === loan.bookId
            ? { ...item, availableCopies: item.availableCopies + 1 }
            : item
        ),
        students: state.students.map((item) =>
          item.id === loan.studentId
            ? {
                ...item,
                borrowedBooks: item.borrowedBooks.filter((bookId) => bookId !== loan.bookId),
              }
            : item
        ),
        loans: state.loans.map((item) =>
          item.loanId === loan.loanId
            ? { ...item, status: "returned", returnedDate: action.payload.returnedDate }
            : item
        ),
      };
    }
    case "ADD_STUDENT": {
      return {
        ...state,
        students: [...state.students, action.payload],
      };
    }
    case "MARK_OVERDUE": {
      const today = new Date().toISOString().slice(0, 10);
      return {
        ...state,
        loans: state.loans.map((item) =>
          item.status === "active" && item.dueDate < today
            ? { ...item, status: "overdue" as LoanStatus }
            : item
        ),
      };
    }
    default:
      return state;
  }
}

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(libraryReducer, initialState);

  return (
    <LibraryContext.Provider value={{ state, dispatch }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used inside LibraryProvider");
  }
  return context;
}
