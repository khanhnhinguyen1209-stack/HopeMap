"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/lib/supabase";

// Fallback nếu thiếu lat/lng
const districtCoordinates = {
  quan1: [10.7756, 106.7019],
  quan3: [10.7821, 106.6862],
  quan4: [10.7649, 106.705],
  quan5: [10.7543, 106.6664],
  quan6: [10.7464, 106.6492],
  quan7: [10.7314, 106.7243],
  quan8: [10.7243, 106.6286],
  quan10: [10.7679, 106.6664],
  quan11: [10.7639, 106.6433],
  quan12: [10.8633, 106.6544],
  binhThanh: [10.8011, 106.6981],
  goVap: [10.8387, 106.6653],
  tanBinh: [10.7972, 106.6453],
  tanPhu: [10.7905, 106.6281],
  phuNhuan: [10.7992, 106.6753],
  thuDuc: [10.8497, 106.7717],
  binhTan: [10.7656, 106.6033],
  nhaBe: [10.6967, 106.7967],
  binhChanh: [10.72, 106.5667],
  cuChi: [10.9733, 106.4933],
  hocMon: [10.8794, 106.5953],
  canGio: [10.4147, 106.9667],
  other: [10.8231, 106.6297],
  online: [10.8231, 106.6297],
};

export default function MapComponent() {
  const mapRef = useRef(null);
  const markerLayerRef = useRef(null);
// ================= LOAD EXISTING =================
  const loadInitialMarkers = async () => {
    markerLayerRef.current.clearLayers();

    const { data: requests } = await supabase
      .from("support_requests")
      .select("*");

    const { data: volunteers } = await supabase
      .from("volunteers")
      .select("*");

    requests?.forEach(r => addMarker({ ...r, type: "help" }));
    volunteers?.forEach(v => addMarker({ ...v, type: "volunteer" }));
  };

  // ================= REALTIME =================
  const setupRealtime = () => {
    supabase
      .channel("realtime-map")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "support_requests" },
        payload => addMarker({ ...payload.new, type: "help" })
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "volunteers" },
        payload => addMarker({ ...payload.new, type: "volunteer" })
      )
      .subscribe();
  };
  // ================= INIT MAP =================
  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = L.map("main-map").setView([10.8231, 106.6297], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapRef.current);

    markerLayerRef.current = L.layerGroup().addTo(mapRef.current);

    loadInitialMarkers();
    setupRealtime();
  }, []);

  

  // ================= ADD MARKER =================
  const addMarker = (data) => {
  let lat = data.lat;
  let lng = data.lng;

  // fallback theo quận
  if (!lat || !lng) {
    const fallback =
      districtCoordinates[data.district] || districtCoordinates.other;
    lat = fallback[0];
    lng = fallback[1];
  }

  // ======= FIX MÀU CHUẨN =======
  let color = "yellow"; // mặc định: cần trò chuyện

  if (data.type === "volunteer") {
    color = "green";              // ✅ TÌNH NGUYỆN
  } else if (data.support_level === "emergency") {
    color = "red";                // 🚨 KHẨN CẤP
  }

  L.circleMarker([lat, lng], {
    radius: 10,
    color,
    fillColor: color,
    fillOpacity: 0.9,
  })
    .addTo(markerLayerRef.current)
    .bindPopup(renderPopup(data));
};

  // ================= POPUP =================
  const renderPopup = (data) => `
    <div style="min-width:200px">
      <b>${data.type === "volunteer" ? "🤝 Tình nguyện viên" : "🆘 Cần hỗ trợ"}</b><br/>
      <b>Khu vực:</b> ${data.district || "TP.HCM"}<br/>
      ${
        data.support_level
          ? `<b>Mức độ:</b> ${
              data.support_level === "emergency"
                ? "🚨 Khẩn cấp"
                : "💛 Cần trò chuyện"
            }<br/>`
          : ""
      }
      ${data.description ? `<p>${data.description}</p>` : ""}
      ${data.phone ? `<b>📞 ${data.phone}</b>` : ""}
    </div>
  `;

  // ================= UI =================
  return (
    <section className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-3xl font-bold text-center mb-4">
        🌍 Bản Đồ Cộng Đồng Hỗ Trợ
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Legend color="red" text="Cần hỗ trợ khẩn cấp" />
        <Legend color="yellow" text="Cần trò chuyện" />
        <Legend color="green" text="Tình nguyện viên" />
      </div>

      <div id="main-map" className="w-full h-[500px] rounded-lg border" />
    </section>
  );
}

function Legend({ color, text }) {
  return (
    <div className="flex items-center justify-center bg-gray-50 rounded-xl p-3">
      <div
        className="w-4 h-4 rounded-full mr-3"
        style={{ backgroundColor: color }}
      />
      <span className="font-medium">{text}</span>
    </div>
  );
}
