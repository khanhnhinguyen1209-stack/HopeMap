"use client";
import React, { useState, useRef, useEffect } from "react";

export default function ChatSystem() {
  const [messages, setMessages] = useState([
    { content: "Xin chào! Tôi là trợ lý AI của Hope Map. Bạn đang cảm thấy thế nào hôm nay?", isUser: false }
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    setInput("");
    setIsSending(true);
    setMessages(prev => [...prev, { content: text, isUser: true }]);

    let reply = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      reply = data?.reply || "Xin lỗi, AI chưa trả lời được.";
    } catch (err) {
      reply = "Lỗi kết nối tới server.";
    }

    typeEffect(reply, () => setIsSending(false));
  };

  const typeEffect = (text, onFinish) => {
    let idx = 0;
    let current = "";

    const interval = setInterval(() => {
      if (idx < text.length) {
        current += text[idx];
        idx++;
      } else {
        clearInterval(interval);
        if (onFinish) onFinish();
      }

      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.isUser) return [...prev, { content: current, isUser: false }];
        return [...prev.slice(0, -1), { content: current, isUser: false }];
      });
    }, 16);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !isSending) sendMessage();
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl p-5 shadow">
      <div className="h-[640px] overflow-y-auto pr-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex my-3 ${m.isUser ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-2 max-w-[80%] rounded-xl text-sm ${m.isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Nhập tin nhắn..."
          className="flex-1 border px-4 py-2 rounded-l-lg outline-none"
          disabled={isSending}
        />
        <button
          onClick={sendMessage}
          disabled={isSending}
          className={`px-6 rounded-r-lg text-white ${isSending ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {isSending ? "Đang gửi..." : "Gửi"}
        </button>
      </div>
    </div>
  );
}
