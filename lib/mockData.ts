import type { Book, Student, LoanRecord } from "./types";

export const books: Book[] = [
  {
    id: "b1",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    category: "Computer Science",
    totalCopies: 5,
    availableCopies: 2,
    borrowCount: 18,
  },
  {
    id: "b2",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Literature",
    totalCopies: 3,
    availableCopies: 1,
    borrowCount: 12,
  },
  {
    id: "b3",
    title: "Chemistry: The Central Science",
    author: "Theodore L. Brown",
    category: "Science",
    totalCopies: 4,
    availableCopies: 0,
    borrowCount: 22,
  },
  {
    id: "b4",
    title: "World History: Patterns of Civilization",
    author: "M. N. Pearson",
    category: "History",
    totalCopies: 2,
    availableCopies: 2,
    borrowCount: 8,
  },
  {
    id: "b5",
    title: "Modern Economics",
    author: "Paul Krugman",
    category: "Business",
    totalCopies: 3,
    availableCopies: 1,
    borrowCount: 11,
  },
];

export const students: Student[] = [
  { 
    id: "s1",
    name: "Aarav Sharma",
    grade: "10",
    gender: "Male",
    borrowedBooks: ["b1", "b3"],
  },
  {
    id: "s2",
    name: "Isha Patel",
    gender: "Female",
    grade: "11",
    borrowedBooks: ["b2"],
  },
  {
    id: "s3",
    name: "Neel Verma",
    gender: "Male",
    grade: "9",
    borrowedBooks: [],
  },
  {
    id: "s4",
    name: "Mia Gupta",
    gender: "Female",
    grade: "12",
    borrowedBooks: ["b5"],
  },
];

export const loans: LoanRecord[] = [
  {
    loanId: "l1",
    bookId: "b1",
    studentId: "s1",
    issueDate: "2026-05-02",
    dueDate: "2026-05-16",
    status: "overdue",
  },
  {
    loanId: "l2",
    bookId: "b3",
    studentId: "s1",
    issueDate: "2026-05-08",
    dueDate: "2026-05-22",
    status: "active",
  },
  {
    loanId: "l3",
    bookId: "b2",
    studentId: "s2",
    issueDate: "2026-05-10",
    dueDate: "2026-05-24",
    status: "active",
  },
  {
    loanId: "l4",
    bookId: "b5",
    studentId: "s4",
    issueDate: "2026-05-01",
    dueDate: "2026-05-15",
    status: "overdue",
  },
];

export const categories = Array.from(new Set(books.map((book) => book.category)));
