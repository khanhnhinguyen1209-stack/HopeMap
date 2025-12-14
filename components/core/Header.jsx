'use client';

import { SignOutButton, useUser } from "@clerk/nextjs";

export default function Header() {
  const { user } = useUser();

  return (
    <header className="relative bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500 text-white">
      
      {/* LOGOUT BUTTON */}
      <div className="absolute top-6 right-6">
        <SignOutButton redirectUrl="/sign-in">
          <button className="px-5 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md 
                             text-sm font-semibold transition shadow-lg">
            🚪 Đăng xuất
          </button>
        </SignOutButton>
      </div>

      <div className="max-w-5xl mx-auto py-16 text-center space-y-5 px-4">
        
        <h1 className="text-5xl md:text-6xl font-extrabold flex items-center justify-center gap-3 drop-shadow-lg">
          🗺️ Hope Map
        </h1>

        <p className="text-lg md:text-xl opacity-95 tracking-wide">
          Bản Đồ Hy Vọng
        </p>

        <p className="italic opacity-90 max-w-2xl mx-auto leading-relaxed">
          “Khi bạn cảm thấy lạc lõng, hãy biết rằng vẫn có ánh sáng ở gần bạn —  
          Hope Map sẽ dẫn đường.”
        </p>

        {/* USER NAME */}
        {user && (
          <p className="mt-6 text-sm opacity-90">
            👋 Xin chào, <span className="font-semibold">{user.firstName || user.username}</span>
          </p>
        )}

      </div>
    </header>
  );
}
