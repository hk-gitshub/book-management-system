"use client";

import { useMemo, useState } from "react";
import { useLibrary } from "../context/LibraryContext";
import Button from "./ui/Button";
import { getStudentKey } from "../lib/normalization";
import type { Student } from "../lib/types";
import type { Dispatch, SetStateAction } from "react";

interface AddStudentFormProps {
  onClose: () => void;
  setMessage: Dispatch<SetStateAction<string>>;
}

export default function AddStudentForm({ onClose, setMessage }: AddStudentFormProps) {
  const {state, dispatch } = useLibrary();
  const [formData, setFormData] = useState<{
    name: string;
    gender: "" | "Male" | "Female";
    grade: string;
  }>({
    name: "",
    gender: "",
    grade: "",
  });
  // const [message, setMessage] = useState("");
  const studentKeys = useMemo(() => {
    return new Set(
      state.students.map((student) => getStudentKey(student.name, student.grade))
    );
  }, [state.students]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();

    if(studentKeys.has(getStudentKey(name, formData.grade))){
      setMessage(`${formData.name} is already exist in the ${formData.grade} grade.`)

      return;
    }

    const newStudent: Student = {
      id: `s${Date.now()}`,
      name,
      gender: formData.gender,
      grade: formData.grade,
      borrowedBooks: [],
    };

    dispatch({ type: "ADD_STUDENT", payload: newStudent });
    setMessage("Student added successfully!");
    setTimeout(() => {
      onClose();
      setMessage("")
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Name</span>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
          placeholder="Enter student name"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Grade</span>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
          required
        >
          <option value="">Select a Gender</option>
          {["Male", "Female"].map((gender) => (
            <option key={gender} value={gender}>
              {gender}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Grade</span>
        <select
          name="grade"
          value={formData.grade}
          onChange={handleChange}
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
          required
        >
          <option value="">Select a grade</option>
          {["8", "9", "10", "11", "12"].map((grade) => (
            <option key={grade} value={grade}>
              Grade {grade}
            </option>
          ))}
        </select>
      </label>

      {/* {message && <p className="text-sm text-slate-600">{message}</p>} */}

      <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:pt-4">
        <Button
          type="submit"
          className="w-full sm:flex-1"
        >
          Add Student
        </Button>
        <Button
          onClick={onClose}
          variant="secondary"
          className="w-full sm:flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
