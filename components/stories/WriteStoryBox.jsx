"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const MOODS = [
  { key: "sad", label: "😔 Buồn" },
  { key: "stress", label: "😖 Stress" },
  { key: "crisis", label: "🚨 Khủng hoảng" },
  { key: "recovery", label: "🌱 Hồi phục" },
];

export default function WriteStoryBox({ onClose }) {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("sad");
  const [loading, setLoading] = useState(false);

  const submitStory = async () => {
    if (!content.trim()) return;

    setLoading(true);

    const { error } = await supabase.from("stories").insert({
      content,
      mood,
    });

    setLoading(false);

    if (!error) {
      setContent("");
      onClose?.();
    }
  };

  return (
    <div className="bg-purple-50 p-6 rounded-2xl space-y-4">
      <textarea
        rows={4}
        placeholder="Viết ra điều bạn đang giữ trong lòng..."
        className="w-full p-4 rounded-xl border"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex gap-2 flex-wrap">
        {MOODS.map((m) => (
          <button
            key={m.key}
            onClick={() => setMood(m.key)}
            className={`px-3 py-1 rounded-full text-sm ${
              mood === m.key
                ? "bg-purple-500 text-white"
                : "bg-white border"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="text-gray-500">
          Hủy
        </button>
        <button
          onClick={submitStory}
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-2 rounded-xl"
        >
          {loading ? "Đang gửi..." : "Gửi"}
        </button>
      </div>
    </div>
  );
}
