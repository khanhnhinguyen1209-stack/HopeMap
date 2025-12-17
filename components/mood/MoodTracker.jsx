'use client';

import { useState } from 'react';
import MoodStats from './MoodStats';
import { showToast } from '@/components/core/Toast';
import { supabase } from '@/lib/supabase';

const moodOptions = [
  { emoji: '😄', label: 'Rất vui', mood: 'very-happy' },
  { emoji: '🙂', label: 'Vui', mood: 'happy' },
  { emoji: '😐', label: 'Bình thường', mood: 'neutral' },
  { emoji: '😔', label: 'Buồn', mood: 'sad' },
  { emoji: '😢', label: 'Rất buồn', mood: 'very-sad' },
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSaveMood = async () => {
    if (!selectedMood) {
      showToast('Vui lòng chọn tâm trạng', 'error');
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('mood_logs')
        .insert({ mood: selectedMood });

      if (error) throw error;

      showToast('Đã lưu tâm trạng 💙', 'success');
      setSelectedMood(null);

    } catch (err) {
      console.error(err);
      showToast('Không thể lưu tâm trạng', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        📝 Theo Dõi Tâm Trạng Hôm Nay
      </h2>

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        {moodOptions.map(option => (
          <button
            key={option.mood}
            onClick={() => setSelectedMood(option.mood)}
            className={`px-6 py-3 rounded-2xl border text-lg font-medium transition
              ${selectedMood === option.mood
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:bg-gray-100'}`}
          >
            {option.emoji} <span className="ml-2">{option.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={handleSaveMood}
        disabled={loading}
        className="w-full max-w-4xl py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 mb-8 text-lg font-semibold"
      >
        {loading ? 'Đang lưu...' : 'Lưu tâm trạng'}
      </button>

      {/* REALTIME STATS */}
      <div className="w-full max-w-6xl">
        <MoodStats />
      </div>
    </div>
  );
}
