export type LoanStatus = "active" | "returned" | "overdue";

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  borrowCount: number;
}

export interface Student {
  id: string;
  name: string;
  gender: "Male" | "Female" | "";
  grade: string;
  borrowedBooks: string[];
}

export interface LoanRecord {
  loanId: string;
  bookId: string;
  studentId: string;
  issueDate: string;
  dueDate: string;
  returnedDate?: string;
  status: LoanStatus;
}
