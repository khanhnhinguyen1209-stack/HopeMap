// components/map/MarkerModal.jsx
import React, { useState, useEffect } from "react";

export default function MarkerModal({ isActive, markerType, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("Đánh dấu vị trí");

  useEffect(() => {
    const titles = {
      help: "🆘 Đánh dấu: Cần giúp đỡ",
      volunteer: "🌱 Đánh dấu: Tình nguyện viên",
      message: "💬 Đánh dấu: Nhắn tin hỗ trợ",
    };
    setTitle(titles[markerType] || "Đánh dấu vị trí");
  }, [markerType]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      markerType,   // ⭐ BẮT BUỘC
      name,
      email,
      message,
    });

    setName("");
    setEmail("");
    setMessage("");
  };

  if (!isActive) return null;

  return (
    <div className="modal active">
      <div className="modal-content">
        <h3>{title}</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên của bạn *</label>
            <input value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Lời nhắn *</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
          </div>

          <div className="modal-buttons">
            <button type="button" onClick={onClose}>Hủy</button>
            <button type="submit">Tạo đánh dấu</button>
          </div>
        </form>
      </div>
    </div>
  );
}
