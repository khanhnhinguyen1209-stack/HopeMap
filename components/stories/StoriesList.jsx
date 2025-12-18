"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { STORIES } from "./stories.data";

export default function StoriesList({ filter }) {
  const [stories, setStories] = useState([]);

  /* ===== LOAD INIT ===== */
  useEffect(() => {
    loadStories();
  }, [filter]);

  const loadStories = async () => {
    let query = supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter) query = query.eq("mood", filter);

    const { data } = await query;

    if (data && data.length > 0) {
      setStories(data);
    } else {
      // 👉 fallback sang STORIES mẫu
      const sample = filter
        ? STORIES.filter(s => s.mood === filter)
        : STORIES;
      setStories(sample);
    }
  };

  /* ===== REALTIME ===== */
  useEffect(() => {
    const channel = supabase
      .channel("realtime-stories")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "stories" },
        (payload) => {
          if (!filter || payload.new.mood === filter) {
            setStories(prev => [payload.new, ...prev]);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [filter]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {stories.map((s) => (
        <div key={s.id} className="bg-gray-50 p-6 rounded-xl">
          <div className="text-sm text-gray-500 mb-2">
            Ẩn danh •{" "}
            {s.created_at
              ? new Date(s.created_at).toLocaleDateString()
              : s.time}
          </div>

          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {s.content}
          </p>

          <button className="mt-4 text-sm text-blue-600 hover:underline">
            🤍 Tôi đã đọc
          </button>
        </div>
      ))}
    </div>
  );
}
