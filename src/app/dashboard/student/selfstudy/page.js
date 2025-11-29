"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentNavbar from "@/components/StudentNavbar";

export default function SelfStudyPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) router.push("/");
  }, []);

  const ask = () => {
    if (!question) return;
    setResponse("🤖 AI response will appear here (connect later).");
  };

  return (
    <div>
      <StudentNavbar />

      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">🤖 Self Study Helper</h2>

        <textarea
          placeholder="Ask anything…"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border p-3 rounded-xl h-32 mb-4"
        />

        <button
          onClick={ask}
          className="w-full bg-yellow-400 py-3 rounded-xl font-bold hover:bg-yellow-300"
        >
          Ask AI
        </button>

        {response && (
          <div className="mt-4 p-4 bg-white rounded-xl shadow">
            {response}
          </div>
        )}
      </div>
    </div>
  );
}
