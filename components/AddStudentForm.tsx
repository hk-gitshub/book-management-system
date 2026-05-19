"use client";

import { useState } from "react";
import { useLibrary } from "../context/LibraryContext";
import type { Student } from "../lib/types";

interface AddStudentFormProps {
  onClose: () => void;
  setMessage: any
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name= formData.name.trim()

    const studentExist = state.students.some(
            (student)=>(
              student.name.trim().toLowerCase() === name.toLowerCase()
              && 
              student.grade === formData.grade
            ))

    if(studentExist){
      setMessage(`${formData.name} is already exist in the ${formData.grade} grade.`)

      return;
    }

    const newStudent: Student = {
      id: `s${Date.now()}`,
      name: formData.name,
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

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Add Student
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
