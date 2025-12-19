"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/lib/supabase";

/* ===== TỌA ĐỘ QUẬN (fallback) ===== */
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
};

export default function MapComponent() {
  const mapContainerRef = useRef(null);   // ✅ BẮT BUỘC
  const mapRef = useRef(null);
  const markerLayerRef = useRef(null);

  /* ===== ADD MARKER ===== */
  const addMarker = (data) => {

  let lat = data.lat;
  let lng = data.lng;

  if (!lat || !lng) {
    const fallback =
      districtCoordinates[data.district] || districtCoordinates.other;
    [lat, lng] = fallback;
  }

  let color = "yellow"; // mặc định

  // 🟢 VOLUNTEER
  if (data.support_types && data.support_types.length > 0) {
    color = "green";
  }
  // 🔴 KHẨN CẤP
  else if (data.support_level === "emergency") {
    color = "red";
  }

  L.circleMarker([lat, lng], {
    radius: 10,
    color,
    fillColor: color,
    fillOpacity: 0.9,
  }).addTo(markerLayerRef.current);
};

    let lat = data.lat;
    let lng = data.lng;

    if (!lat || !lng) {
      const fallback =
        districtCoordinates[data.district] || districtCoordinates.other;
      lat = fallback[0];
      lng = fallback[1];
    }

    // ===== LOGIC MÀU CHUẨN =====
    let color = "yellow"; // cần trò chuyện

    if (data.__source === "volunteer") {
    color = "green";           // 🟢 TÌNH NGUYỆN VIÊN
  } else if (data.support_level === "emergency") {
    color = "red";             // 🔴 KHẨN CẤP
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


  /* ===== LOAD DATA ===== */
  const loadInitialMarkers = async () => {
    markerLayerRef.current.clearLayers();

    const { data: requests } = await supabase
      .from("support_requests")
      .select("*");

    const { data: volunteers } = await supabase
      .from("volunteers")
      .select("*");

    requests?.forEach(r =>
      addMarker({ ...r, __source: "request" })
    );

    volunteers?.forEach(v =>

    requests?.forEach((r) =>
      addMarker({ ...r, __source: "request" })
    ),

    volunteers?.forEach((v) =>
      addMarker({ ...v, __source: "volunteer" })
    );
  };

  /* ===== REALTIME ===== */
  const setupRealtime = () => {
    supabase
      .channel("realtime-map")

      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "support_requests" },

        payload =>

        (payload) =>

          addMarker({ ...payload.new, __source: "request" })
      )

      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "volunteers" },

        payload =>

        (payload) =>

          addMarker({ ...payload.new, __source: "volunteer" })
      )

      .subscribe();
  };

  /* ===== INIT MAP (CHUẨN NEXT.JS) ===== */

  /* ===== INIT MAP ===== */
>>>>>>> 77e18f6c883f2a83aec5d1050ba37aab30d4a487
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;


    mapRef.current = L.map(mapContainerRef.current).setView(

    mapRef.current = L.map("main-map").setView(

      [10.8231, 106.6297],
      12
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapRef.current);

    markerLayerRef.current = L.layerGroup().addTo(mapRef.current);

    loadInitialMarkers();
    setupRealtime();

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  /* ===== POPUP ===== */
  const renderPopup = (data) => `
    <div style="min-width:220px">

      <b>${data.__source === "volunteer" ? "🤝 Tình nguyện viên" : "🆘 Cần hỗ trợ"}</b><br/>

      <b>${
        Array.isArray(data.support_types)
          ? "🤝 Tình nguyện viên"
          : "🆘 Cần hỗ trợ"
      }</b><br/>

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

      ${
        data.support_types
          ? `<b>Hỗ trợ:</b> ${data.support_types.join(", ")}<br/>`
          : ""
      }

      ${data.phone ? `<b>📞 ${data.phone}</b>` : ""}
    </div>
  `;

  /* ===== UI ===== */
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

      {/* ✅ KHÔNG DÙNG id */}
      <div
        ref={mapContainerRef}
        className="w-full h-[500px] rounded-lg border"
      />
    </section>
  );
}

/* ===== LEGEND ===== */
function Legend({ color, text }) {
  const styles = {

    red: { bg: "bg-red-50", dot: "bg-red-500", text: "text-red-700" },
    yellow: { bg: "bg-yellow-50", dot: "bg-yellow-400", text: "text-yellow-700" },
    green: { bg: "bg-green-50", dot: "bg-green-500", text: "text-green-700" },

    red: {
      bg: "bg-red-50",
      dot: "bg-red-500",
      text: "text-red-700",
    },
    yellow: {
      bg: "bg-yellow-50",
      dot: "bg-yellow-400",
      text: "text-yellow-700",
    },
    green: {
      bg: "bg-green-50",
      dot: "bg-green-500",
      text: "text-green-700",
    },

  };

  const s = styles[color];

  return (
    <div className={`flex items-center justify-center rounded-2xl px-6 py-4 ${s.bg}`}>
      <span className={`w-3 h-3 rounded-full mr-3 ${s.dot}`} />

      <span className={`font-semibold ${s.text}`}>{text}</span>

      <span className={`font-semibold ${s.text}`}>
        {text}
      </span>

    </div>
  );
}
