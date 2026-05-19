"use client"

import { useMemo, useState } from "react";
import { useLibrary } from "@/context/LibraryContext";
import Button from "./ui/Button";
import type { Dispatch, SetStateAction } from "react";

interface ReturnBooksFormProps {
    onClose: () => void;
    setMessage: Dispatch<SetStateAction<string>>;
}

function ReturnBooksForm({ onClose, setMessage }: ReturnBooksFormProps) {
    const { state, dispatch } = useLibrary();
    const activeLoans = useMemo(
        () => state.loans.filter((loan) => loan.status === "active" || loan.status === "overdue"),
        [state.loans]
    );
    const booksById = useMemo(() => {
        return new Map(state.books.map((book) => [book.id, book]));
    }, [state.books]);
    const studentsById = useMemo(() => {
        return new Map(state.students.map((student) => [student.id, student]));
    }, [state.students]);
    const [selectedLoanId, setSelectedLoanId] = useState("");
    // const [message, setMessage] = useState("");

    const handleReturn = () => {
        if (!selectedLoanId) {
            setMessage("Please choose an active loan to return.");
            return;
        }

        dispatch({
            type: "RETURN_BOOK",
            payload: {
                loanId: selectedLoanId,
                returnedDate: new Date().toISOString().slice(0, 10),
            },
        });

        setMessage("Book returned successfully.");
        setTimeout(() => {
            onClose();
            setMessage("");
        }, 800);
    };

    return (
        <div className="space-y-5">
            <label className="block">
                <span className="text-sm font-medium text-slate-700">Active loan</span>
                <select
                    value={selectedLoanId}
                    onChange={(event) => setSelectedLoanId(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
                >
                    <option value="">Choose a loan</option>
                    {activeLoans.map((loan) => {
                        const student = studentsById.get(loan.studentId);
                        const book = booksById.get(loan.bookId);
                        return (
                            <option key={loan.loanId} value={loan.loanId}>
                                {student?.name} — {book?.title} ({loan.status})
                            </option>
                        );
                    })}
                </select>
            </label>

            <Button
                onClick={handleReturn}
            >
                Process Return
            </Button>

            {/* {message ? <p className="text-sm text-slate-600">{message}</p> : null} */}
        </div>
    );
}

export default ReturnBooksForm;
