// components/core/Navbar.jsx
'use client';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { defaultConfig } from '@/lib/constants';

const navItems = [
    { label: '🗺️ Bản Đồ', href: '/map', section: 'map' },
    { label: '📝 Đăng Ký', href: '/register-service', section: 'register' },
    { label: '😊 Tâm Trạng', href: '/mood', section: 'mood' },
    { label: '💬 Trò Chuyện', href: '/chat', section: 'chat' },
    { label: '🧠 Test Cảm xúc', href: '/emotion-test', section: 'stories' },
    { label: '📖 Câu Chuyện', href: '/stories', section: 'stories' },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const currentSection =
        navItems.find(item => pathname.includes(`/main${item.href}`))?.section || 'map';

    const activeStyle = { backgroundColor: defaultConfig.primary_color };

    return (
        <nav className="w-full flex justify-center bg-white shadow-sm">
            <div className="flex justify-center items-center gap-3 py-3 w-fit mx-auto">
                {navItems.map((item) => (
                    <button
                        key={item.section}
                        className={`nav-btn ${item.section === currentSection ? 'active' : ''}`}
                        onClick={() => router.push(`/main${item.href}`)}
                        style={item.section === currentSection ? activeStyle : {}}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </nav>
    );
}
