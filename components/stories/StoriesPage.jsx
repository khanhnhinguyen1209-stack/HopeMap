"use client";
import { useState } from "react";
import WriteStoryBox from "./WriteStoryBox";
import StoriesList from "./StoriesList";

/* ===== MOOD CONFIG ===== */
const MOODS = [
  {
    key: "sad",
    label: " Buồn",
    bg: "bg-blue-50",
    dot: "bg-blue-500",
    text: "text-blue-700",
  },
  {
    key: "stress",
    label: " Stress",
    bg: "bg-yellow-50",
    dot: "bg-yellow-400",
    text: "text-yellow-700",
  },
  {
    key: "crisis",
    label: " Khủng hoảng",
    bg: "bg-red-50",
    dot: "bg-red-500",
    text: "text-red-700",
  },
  {
    key: "recovery",
    label: " Đang hồi phục",
    bg: "bg-green-50",
    dot: "bg-green-500",
    text: "text-green-700",
  },
];

export default function StoriesPage() {
  const [filter, setFilter] = useState("sad"); // 👈 mặc định
  const [showWriteBox, setShowWriteBox] = useState(false);

  return (
    <div className="p-8">

      {/* ===== TITLE ===== */}
      <h2 className="text-3xl font-bold text-center mb-4">
        📖 Những Câu Chuyện Được Nói Ra
      </h2>

      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
        Không ai đánh giá. Không ai so sánh.  
        Chỉ có những điều được nói ra – và được lắng nghe.
      </p>

      {/* ===== FILTER BUTTONS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {MOODS.map((m) => (
          <button
            key={m.key}
            onClick={() => setFilter(m.key)}
            className={`
              flex items-center justify-center rounded-2xl px-4 py-3
              transition-all duration-200
              ${m.bg}
              ${filter === m.key ? "ring-2 ring-offset-2 ring-gray-400" : ""}
            `}
          >
            <span className={`w-3 h-3 rounded-full mr-2 ${m.dot}`} />
            <span className={`font-semibold text-sm ${m.text}`}>
              {m.label}
            </span>
          </button>
        ))}
      </div>

      {/* ===== STORIES LIST ===== */}
      <StoriesList filter={filter} />

      {/* ===== WRITE BUTTON ===== */}
      <div className="text-center mt-10">
        <button
          onClick={() => setShowWriteBox(true)}
          className="bg-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-600"
        >
          ✍️ Viết ra điều bạn đang giữ trong lòng
        </button>
      </div>

      {/* ===== WRITE BOX ===== */}
      {showWriteBox && (
        <div className="mt-6 max-w-2xl mx-auto">
          <WriteStoryBox onClose={() => setShowWriteBox(false)} />
        </div>
      )}
    </div>
  );
}
