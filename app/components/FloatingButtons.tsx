"use client";

import React from "react";
import { MessageSquare, PhoneCall } from "lucide-react";

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 font-sans max-w-[280px]">
      {/* 1. Chat Zalo Button */}
      <a
        href="https://zalo.me/0977500651"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-2.5 bg-[#0068FF] hover:bg-[#0056D6] text-white font-bold rounded-full shadow-lg transition-all transform hover:scale-[1.05] hover:-translate-y-0.5 text-xs md:text-sm group"
      >
        <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#0068FF] font-black text-xs shrink-0 group-hover:rotate-12 transition-transform">
          Z
        </span>
        <span className="tracking-wide shadow-xs">Chat Zalo</span>
      </a>

      {/* 2. Chat Facebook Button */}
      <a
        href="https://www.facebook.com/yunavietnamfanpage/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-2.5 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold rounded-full shadow-lg transition-all transform hover:scale-[1.05] hover:-translate-y-0.5 text-xs md:text-sm group"
      >
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#1877F2] shrink-0 group-hover:rotate-12 transition-transform">
          <MessageSquare className="w-3.5 h-3.5 fill-current" />
        </div>
        <span className="tracking-wide shadow-xs">Chat Facebook</span>
      </a>

      {/* 3. Hotline Pulse Button */}
      <a
        href="tel:0977500651"
        className="flex items-center gap-2.5 px-4 py-2.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold rounded-full shadow-lg transition-all transform hover:scale-[1.05] hover:-translate-y-0.5 text-xs md:text-sm animate-pulse group"
      >
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#D32F2F] shrink-0 group-hover:scale-110 transition-transform">
          <PhoneCall className="w-3.5 h-3.5 fill-current" />
        </div>
        <span className="tracking-wide shadow-xs">Hotline: 0977 500 651</span>
      </a>
    </div>
  );
}
