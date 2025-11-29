"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function SharePage() {
  const [myEmail, setMyEmail] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [toEmail, setToEmail] = useState("");

  // 🔐 Load user email from JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setMyEmail(decoded.email); // 👈 your email
    } catch (e) {
      console.log("Token decode failed");
    }
  }, []);

  // 🔄 Fetch messages
  const loadMessages = async () => {
    const res = await fetch("/api/share");
    const data = await res.json();

    // ✔ show only MY received messages
    const filtered = data.messages.filter((msg) => msg.toEmail === myEmail);
    setMessages(filtered);
  };

  // ⏳ Auto refresh every 10s
  useEffect(() => {
    if (myEmail) loadMessages();
    const interval = setInterval(loadMessages, 10000);
    return () => clearInterval(interval);
  }, [myEmail]);

  // 📩 Send message
  const sendMessage = async () => {
    if (!text || !toEmail) return alert("Please fill all fields");

    const res = await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromEmail: myEmail, toEmail, text }),
    });

    if (res.ok) {
      setText("");
      loadMessages(); // reload immediately
    } else {
      alert("Message send failed");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Secure Message Sharing</h1>

      {/* My email */}
      <div className="p-4 bg-white rounded shadow mb-4">
        <p className="font-semibold">Logged in as:</p>
        <p className="text-blue-600">{myEmail || "Loading…"}</p>
      </div>

      {/* Send message box */}
      <div className="bg-white p-5 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-3">Send Message</h2>

        <input
          type="email"
          placeholder="Recipient Email"
          className="w-full mb-3 p-3 border rounded"
          value={toEmail}
          onChange={(e) => setToEmail(e.target.value)}
        />

        <textarea
          placeholder="Type your message..."
          className="w-full p-3 border rounded mb-3"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>

      {/* Messages */}
      <h2 className="text-xl font-bold mb-3">Messages Sent to You</h2>

      {messages.length === 0 ? (
        <p className="text-gray-600">No messages yet.</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg._id}
            className="bg-white p-4 mb-3 rounded shadow border-l-4 border-blue-500"
          >
            <p className="text-gray-700">{msg.text}</p>
            <p className="text-sm text-gray-500 mt-2">
              From: <span className="font-semibold">{msg.fromEmail}</span>
            </p>
          </div>
        ))
      )}
    </div>
  );
}
