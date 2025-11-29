"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { CheckCircle, Clock, Zap, AlertCircle, User } from "lucide-react";

export default function StudyGenerator() {
  const [userName, setUserName] = useState("User"); // default name
  const [subject, setSubject] = useState("");
  const [hours, setHours] = useState(10);
  const [roadmap, setRoadmap] = useState([]);
  const [error, setError] = useState("");

  // Get the user name from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user"); // assuming you stored user info as JSON
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || "User");
    }
  }, []);

  const studyData = {
    math: [
      { topic: "Algebra", hours: 3, difficulty: 2, description: "Equations, expressions, and variables." },
      { topic: "Geometry", hours: 4, difficulty: 3, description: "Shapes, theorems, and proofs." },
      { topic: "Calculus", hours: 5, difficulty: 5, description: "Derivatives, integrals, limits." },
      { topic: "Trigonometry", hours: 2, difficulty: 3, description: "Sine, cosine, tangent, angles." },
      { topic: "Statistics", hours: 1, difficulty: 1, description: "Mean, median, variance, probability." },
    ],
    physics: [
      { topic: "Mechanics", hours: 3, difficulty: 3, description: "Motion, forces, energy." },
      { topic: "Thermodynamics", hours: 2, difficulty: 4, description: "Heat, energy, laws of thermodynamics." },
      { topic: "Optics", hours: 1, difficulty: 2, description: "Light, lenses, mirrors." },
      { topic: "Electromagnetism", hours: 4, difficulty: 5, description: "Electricity, magnetism, circuits." },
      { topic: "Nuclear", hours: 5, difficulty: 5, description: "Atoms, radioactivity, nuclear reactions." },
    ],
    chemistry: [
      { topic: "Organic Chemistry", hours: 4, difficulty: 4, description: "Carbon compounds, reactions, and mechanisms." },
      { topic: "Inorganic Chemistry", hours: 3, difficulty: 3, description: "Elements, compounds, periodic table." },
      { topic: "Physical Chemistry", hours: 5, difficulty: 5, description: "Thermodynamics, kinetics, quantum chemistry." },
      { topic: "Analytical Chemistry", hours: 2, difficulty: 2, description: "Spectroscopy, titrations, chromatography." },
      { topic: "Biochemistry", hours: 3, difficulty: 3, description: "Proteins, enzymes, DNA/RNA basics." },
    ],
    biology: [
      { topic: "Cell Biology", hours: 3, difficulty: 2, description: "Cell structure, organelles, functions." },
      { topic: "Genetics", hours: 4, difficulty: 3, description: "DNA, inheritance, Mendelian laws." },
      { topic: "Evolution", hours: 2, difficulty: 3, description: "Natural selection, species adaptation." },
      { topic: "Human Anatomy", hours: 5, difficulty: 4, description: "Organs, systems, physiology." },
      { topic: "Microbiology", hours: 3, difficulty: 4, description: "Bacteria, viruses, lab basics." },
    ],
    computerScience: [
      { topic: "Programming Basics", hours: 3, difficulty: 2, description: "Variables, loops, functions." },
      { topic: "Data Structures", hours: 4, difficulty: 4, description: "Arrays, linked lists, trees, graphs." },
      { topic: "Algorithms", hours: 5, difficulty: 5, description: "Sorting, searching, complexity." },
      { topic: "Databases", hours: 3, difficulty: 3, description: "SQL, NoSQL, CRUD operations." },
      { topic: "Networking", hours: 2, difficulty: 3, description: "Protocols, OSI model, IP/TCP basics." },
    ],
  };

  const subjects = Object.keys(studyData);

  const generateRoadmap = () => {
    setError("");
    setRoadmap([]);
    if (!subject) {
      setError("Please select a subject");
      return;
    }
    const sortedTopics = [...studyData[subject]].sort((a, b) => a.difficulty - b.difficulty);
    let remaining = hours;
    const roadmapArr = sortedTopics.map((t) => {
      const allocated = Math.min(t.hours, remaining);
      remaining -= allocated;
      return { ...t, allocated, completed: false };
    });
    setRoadmap(roadmapArr);
  };

  const getBarColor = (difficulty, completed) => {
    if (completed) return "bg-gray-400";
    if (difficulty <= 2) return "bg-green-400";
    if (difficulty <= 4) return "bg-yellow-400";
    return "bg-red-400";
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newRoadmap = Array.from(roadmap);
    const [moved] = newRoadmap.splice(result.source.index, 1);
    newRoadmap.splice(result.destination.index, 0, moved);
    setRoadmap(newRoadmap);
  };

  const toggleCompletion = (index) => {
    const newRoadmap = [...roadmap];
    newRoadmap[index].completed = !newRoadmap[index].completed;
    setRoadmap(newRoadmap);
  };

  const updateHours = (index, newHours) => {
    const newRoadmap = [...roadmap];
    newRoadmap[index].allocated = newHours;
    setRoadmap(newRoadmap);
  };

  return (
  <div className="max-w-7xl mx-auto p-6 bg-gradient-to-r from-indigo-50 to-pink-50 rounded-xl mt-10 shadow-lg">
    {/* Header with user greeting and optional logout */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2 text-indigo-700">
        <User size={24} /> Hello, {userName || "Student"}!
      </h2>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          router.push("/login");
        }}
        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>

    <h1 className="text-4xl font-bold mb-8 text-center text-indigo-700">
      🚀 Interactive Study Roadmap
    </h1>

    {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

    <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="border p-3 rounded w-full md:w-1/2 shadow focus:ring-2 focus:ring-indigo-300"
      >
        <option value="">Select Subject</option>
        {subjects.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>

      <div className="w-full md:w-1/2">
        <label className="block mb-1 font-semibold flex items-center gap-2">
          <Clock size={18} /> Total Study Hours: <span className="text-indigo-600">{hours}</span>
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="w-full accent-indigo-600"
        />
      </div>
    </div>

    <button
      onClick={generateRoadmap}
      className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-8 py-3 rounded w-full hover:from-pink-500 hover:to-indigo-600 transition-all font-semibold mb-8 flex items-center justify-center gap-2 shadow-lg"
    >
      <Zap size={18} /> Generate Roadmap
    </button>

    {roadmap.length > 0 && (
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="roadmap" direction="horizontal">
          {(provided) => (
            <div
              className="flex overflow-x-auto gap-6 py-6 px-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {roadmap.map((item, idx) => {
                const progressPercent = (item.allocated / item.hours) * 100;

                return (
                  <Draggable key={idx} draggableId={idx.toString()} index={idx}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative flex flex-col items-center min-w-[260px] group"
                      >
                        <div
                          className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg
                            bg-gradient-to-tr from-indigo-500 to-pink-500 hover:scale-105 cursor-pointer transition-transform ${
                              item.completed ? "bg-gray-400" : ""
                            }`}
                          onClick={() => toggleCompletion(idx)}
                          title={item.completed ? "Completed" : "Click to mark as complete"}
                        >
                          {item.completed ? <CheckCircle size={28} /> : idx + 1}
                        </div>

                        <div className="mt-4 bg-white border border-gray-200 p-5 rounded-2xl shadow-md w-full text-center hover:shadow-xl transition-all">
                          <h3
                            className={`font-bold text-xl mb-1 ${
                              item.completed ? "text-gray-500 line-through" : "text-indigo-600"
                            }`}
                          >
                            {item.topic}
                          </h3>
                          <p className="text-gray-600 mb-3 text-sm">{item.description}</p>

                          <div className="mt-2 bg-gray-200 h-4 rounded w-full overflow-hidden">
                            <div
                              className={`h-4 rounded transition-all duration-700 ${getBarColor(
                                item.difficulty,
                                item.completed
                              )}`}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>

                          <p className="text-sm mt-2 flex flex-col items-center gap-1">
                            <span className="flex items-center gap-1">
                              <Clock size={14} /> Allocated:{" "}
                              <input
                                type="number"
                                min="0"
                                max={item.hours}
                                value={item.allocated}
                                onChange={(e) => updateHours(idx, Number(e.target.value))}
                                className="border rounded px-1 w-16 text-center"
                              />{" "}
                              / {item.hours}h
                            </span>
                            <span className="flex items-center gap-1">
                              <Zap size={14} /> Difficulty: {item.difficulty}{" "}
                              {item.difficulty >= 4 && !item.completed && (
                                <AlertCircle size={14} className="text-red-500" />
                              )}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )}
  </div>
);
}