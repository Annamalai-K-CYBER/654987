"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { StickyNote, Inbox, SendHorizonal } from "lucide-react";

// ADVANCED UI — Collaborative Notes + Shared Notes Inbox
export default function CollaborativeSharePage() {
  const [myEmail, setMyEmail] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [toEmail, setToEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setMyEmail(decoded.email);
    } catch (e) {
      console.log("Token decode failed");
    }
  }, []);

  const loadMessages = async () => {
    const res = await fetch("/api/share");
    const data = await res.json();
    const filtered = data.messages.filter((msg) => msg.toEmail === myEmail);
    setMessages(filtered);
  };

  useEffect(() => {
    if (myEmail) loadMessages();
    const interval = setInterval(loadMessages, 1500);
    return () => clearInterval(interval);
  }, [myEmail]);

  const sendMessage = async () => {
    if (!text.trim() || !toEmail.trim()) return;

    const res = await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromEmail: myEmail, toEmail, text }),
    });

    if (res.ok) {
      setText("");
      loadMessages();
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 to-purple-200 p-8 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl"
      >
        {/* HEADER */}
        <header className="bg-white p-6 rounded-3xl shadow-xl mb-8 flex justify-between items-center border border-indigo-100">
          <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight flex items-center gap-2">
            <StickyNote className="w-8 h-8" /> CollabNotes
          </h1>
          <div className="text-sm text-slate-600 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200">
            Logged in as: <span className="font-semibold text-indigo-700">{myEmail}</span>
          </div>
        </header>

        {/* LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SEND NOTE */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white shadow-xl rounded-3xl p-6 border border-violet-100"
          >
            <h2 className="text-2xl font-bold mb-4 text-violet-700 flex items-center gap-2"><SendHorizonal /> Create Note</h2>

            <input
              type="email"
              placeholder="Recipient Email"
              className="w-full p-3 border border-violet-200 rounded-xl mb-4 focus:ring-2 focus:ring-violet-300 outline-none"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
            />

            <textarea
              placeholder="Write a collaborative note..."
              className="w-full p-4 border border-violet-200 rounded-xl h-40 mb-4 focus:ring-2 focus:ring-violet-300 outline-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <button
              onClick={sendMessage}
              className="w-full py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition shadow"
            >
              Share Note
            </button>
          </motion.div>

          {/* INBOX — DISPLAY NOTES AS STICKY NOTES */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white shadow-xl rounded-3xl p-6 border border-indigo-100"
          >
            <h2 className="text-2xl font-bold mb-4 text-indigo-700 flex items-center gap-2"><Inbox /> Notes Shared With You</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-2">
              {messages.length === 0 ? (
                <p className="text-slate-500">No shared notes yet.</p>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg._id}
                    whileHover={{ scale: 1.03 }}
                    className="bg-yellow-100 p-4 rounded-2xl shadow border border-yellow-300 rotate-[-1deg] hover:rotate-0 transition cursor-pointer"
                  >
                    <p className="text-slate-800 whitespace-pre-wrap">{msg.text}</p>
                    <p className="text-xs text-slate-600 mt-3 font-semibold">— {msg.fromEmail}</p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}