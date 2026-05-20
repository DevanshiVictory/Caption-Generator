"use client";

import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("viral");
  const [platform, setPlatform] = useState("instagram");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const generateCaption = async () => {
    if (!topic) return;

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          tone,
          platform,
        }),
      });

      const data = await res.json();

      setResult(data.result);
    } catch (error) {
      setResult("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-2xl space-y-6">
        <div>
          <h1 className="text-5xl font-bold mb-2">
            AI Caption Generator
          </h1>

          <p className="text-zinc-400">
            Generate viral captions using AI
          </p>
        </div>

        <input
          type="text"
          placeholder="Enter topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-700 outline-none"
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="p-4 rounded-2xl bg-zinc-900 border border-zinc-700"
          >
            <option value="viral">Viral</option>
            <option value="genz">Gen Z</option>
            <option value="luxury">Luxury</option>
            <option value="minimal">Minimal</option>
          </select>

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="p-4 rounded-2xl bg-zinc-900 border border-zinc-700"
          >
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter/X</option>
          </select>
        </div>

        <button
          onClick={generateCaption}
          className="w-full bg-white text-black py-4 rounded-2xl font-semibold"
        >
          {loading ? "Generating..." : "Generate Captions"}
        </button>

        {result && (
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl whitespace-pre-wrap">
            {result}
          </div>
        )}
      </div>
    </main>
  );
}