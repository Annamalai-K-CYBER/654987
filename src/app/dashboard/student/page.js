"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import StudentNavbar from "@/components/StudentNavbar";

export default function StudentDashboard() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("token")) router.push("/");
  }, []);

  return (
    <div>
      <StudentNavbar />

      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6">Welcome, Student 🎓</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/dashboard/student/studygenerator"
            className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold">📘 Study Plan Generator</h3>
            <p className="text-gray-500 mt-2">
              Create custom study plans for subjects or exams.
            </p>
          </a>

          <a
            href="/dashboard/student/selfstudy"
            className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold">🤖 Self Study Helper</h3>
            <p className="text-gray-500 mt-2">
              Ask questions and get quick help.
            </p>
          </a>

          <a
            href="/dashboard/student/tasks"
            className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold">📅 Today’s Tasks</h3>
            <p className="text-gray-500 mt-2">
              View your daily tasks and progress.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
