'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LabelList, Cell
} from 'recharts';
import { supabase } from '@/lib/supabase';

const moodLabels = {
  'very-happy': 'Rất vui',
  'happy': 'Vui',
  'neutral': 'Bình thường',
  'sad': 'Buồn',
  'very-sad': 'Rất buồn',
};

const moodColors = {
  'very-happy': '#FACC15',
  'happy': '#34D399',
  'neutral': '#9CA3AF',
  'sad': '#60A5FA',
  'very-sad': '#F87171',
};

export default function MoodStats() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTodayStats = async () => {
    const today = new Date().toISOString().split('T')[0];

    const { data: rows, error } = await supabase
      .from('mood_logs')
      .select('mood')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);

    if (error) {
      console.error(error);
      return;
    }

    const count = {};
    rows.forEach(r => {
      count[r.mood] = (count[r.mood] || 0) + 1;
    });

    const chartData = Object.keys(moodLabels).map(mood => ({
      mood,
      label: moodLabels[mood],
      count: count[mood] || 0,
      fill: moodColors[mood],
    }));

    setData(chartData);
    setLoading(false);
  };

  useEffect(() => {
    fetchTodayStats();

    // 🔴 REALTIME LISTENER
    const channel = supabase
      .channel('realtime-mood')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mood_logs' },
        () => {
          fetchTodayStats(); // chart update instantly
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="mt-6 p-4 bg-white rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4 text-center">
        📊 Thống kê tâm trạng hôm nay 
      </h3>

      {loading || data.every(d => d.count === 0) ? (
        <p className="text-center text-gray-500">
          Chưa có dữ liệu hôm nay
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <XAxis type="number" allowDecimals={false} />
            <YAxis dataKey="label" type="category" width={110} />
            <Tooltip formatter={(v) => [`${v}`, 'Số người']} />
            <Bar dataKey="count">
              <LabelList dataKey="count" position="right" />
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
