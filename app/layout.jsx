// app/layout.jsx

import './global.css';
import "leaflet/dist/leaflet.css";

import Header from '@/components/core/Header';
import Footer from '@/components/core/Footer';

export const metadata = {
  title: 'Mindful Map | Hỗ trợ Cộng đồng',
  description: 'Ứng dụng bản đồ hỗ trợ tâm lý và kết nối tình nguyện viên.',
};

export default function RootLayout({ children }) {
  return (
    
      <html lang="en">
        <body className="bg-gray-50 min-h-screen flex flex-col">
          
          {/* --- HEADER --- */}
          <Header />

          {/* --- MAIN CONTENT --- */}
          <main className="flex-grow">
            {children}
          </main>

          {/* --- FOOTER --- */}
          <Footer />

        </body>
      </html>
    
  );
}
