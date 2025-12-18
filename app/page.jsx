'use client';
import "./global.css";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { showToast } from "@/components/core/Toast";

import RegisterServiceForm from "@/components/RegisterServiceForm";
import ChatSystem from "@/components/chat/ChatSystem";
import MoodTracker from "@/components/mood/MoodTracker";
import EmotionTest from "@/components/mood/EmotionTest";
import MarkerModal from "@/components/map/MarkerModal";

import StoriesPage from "@/components/stories/StoriesPage";

// Dynamic map (disable SSR)
const MapComponent = dynamic(
  () => import("@/components/map/MapComponent"),
  { ssr: false }
);

export default function MapDashboardPage() {
  const [activeTab, setActiveTab] = useState("map");
  const [modalOpen, setModalOpen] = useState(false);
  const [tempLatLng, setTempLatLng] = useState(null);
  const [markerType, setMarkerType] = useState("help");
  const [markers, setMarkers] = useState([]);

  // ------------------ MAP ------------------
  const handleMapClick = (latlng, type) => {
    setMarkerType(type);
    setTempLatLng(latlng);
    setModalOpen(true);
  };

  const handleCreateMarker = (data) => {
    if (!tempLatLng) return;

    const newMarker = {
      ...data,
      type: markerType,
      lat: tempLatLng.lat,
      lng: tempLatLng.lng,
      timestamp: new Date().toISOString(),
      status: "active",
    };

    setMarkers(prev => [...prev, newMarker]);
    setModalOpen(false);
    showToast("Đã tạo đánh dấu!", "success");
  };

  const handleRegisterFromForm = (data) => {
    const newMarker = {
      id: Date.now().toString(),
      ...data,
      timestamp: new Date().toISOString(),
      status: "active",
    };

    setMarkers(prev => [...prev, newMarker]);
    showToast("Đã tạo điểm đánh dấu trên bản đồ!", "success");
  };

  // ------------------ TAB CONTENT ------------------
  const ActiveComponent = useMemo(() => {
    switch (activeTab) {
      case "map":
        return <MapComponent markers={markers} onMapClick={handleMapClick} />;
      case "register":
        return <RegisterServiceForm onSubmitMarker={handleRegisterFromForm} />;
      case "mood":
        return <MoodTracker />;
      case "chat":
        return <ChatSystem />;
      case "test":
        return <EmotionTest />;
      case "stories":
        return <StoriesPage />;
      default:
        return null;
    }
  }, [activeTab, markers]);

  // ------------------ UI ------------------
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-16">
        <div className="max-w-6xl mx-auto p-4 space-y-6">

          {/* NAV TABS */}
          <div className="flex justify-center sticky top-4 z-20">
            <div className="backdrop-blur-md bg-white/80 p-2 rounded-full shadow-lg border border-white/60 flex gap-2">
              {[
                ["map", "🗺️ Bản Đồ"],
                ["register", "📝 Đăng Ký"],
                ["mood", "😊 Tâm Trạng"],
                ["chat", "💬 Trò Chuyện"],
                ["test", "🧠 Test cảm xúc"],
                ["stories", "📖 Câu chuyện"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`
                    px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${activeTab === key
                      ? "bg-blue-600 text-white shadow-lg scale-105"
                      : "text-gray-600 hover:bg-gray-100"}
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-gray-100 min-h-[650px] overflow-hidden transition-all">
            {ActiveComponent}
          </div>
        </div>
      </div>

      {/* MARKER MODAL */}
      <MarkerModal
        isActive={modalOpen}
        markerType={markerType}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateMarker}
      />
    </>
  );
}
