This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## DSA Explanation

The Book Management System uses a centralized client-side data model held in React context with `useReducer`. The core data entities are represented as arrays of objects:

- `books`: inventory records storing `availableCopies`, `borrowCount`, category, and metadata
- `students`: user records tracking current borrowed book IDs
- `loans`: transaction records storing issue date, due date, returned date, and loan status
- `categories`: distinct strings used for filtering

This structure simplifies state updates and supports the main business rules: issue, return, overdue detection, and filtering.

## Complexity Analysis

### Issue book flow

- Book search: O(b) where `b` is the number of books
- Student search: O(s) where `s` is the number of students
- Duplicate loan check: O(l) where `l` is the number of loans
- Overall: O(b + s + l)

### Return book flow

- Active loan selection: O(l)
- Book update: O(b)
- Student update: O(s)
- Overall: O(b + s + l)

### List rendering and filtering

- Active loans rendering: O(l)
- Book category filtering: O(b)
- Student loan history: O(l + b)

### Overdue status derivation

- Overdue scan: O(l)

These complexities reflect current use of arrays for lookups and state updates. For the app size in this prototype, this is acceptable and keeps the implementation straightforward.

## Trade-offs

### Arrays vs. keyed lookup

Using arrays for books, students, and loans makes the data model simple and easy to mock. The trade-off is linear lookup time for search and validation operations. For larger datasets, converting these arrays to index maps keyed by `id` would improve lookup performance from O(n) to O(1).

### Reducer-based state management

Using `LibraryContext` with `useReducer` centralizes business logic and avoids prop drilling across pages. This adds a small amount of boilerplate, but it improves maintainability and makes actions like `ISSUE_BOOK` and `RETURN_BOOK` easier to reason about.

### Client-only persistence

The current implementation uses mock data and client state only. That is ideal for local prototyping, but it means data is not persisted across refreshes. A backend API or local storage layer would be required for production usage.

### Simplicity vs. scalability

This app prioritizes readability, maintainability, and quick iteration over massive scale. For production, the main scalability improvements would be:

- using indexed lookup tables for books and students
- memoizing derived datasets like overdue loans
- moving loan rules to a dedicated service layer
- adding persistence and API integration

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
