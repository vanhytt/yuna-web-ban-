"use client";

import React from "react";
import { MessageSquare, PhoneCall } from "lucide-react";

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-8 left-8 z-50 flex flex-col items-start gap-3.5 font-sans pointer-events-none">
      {/* 1. Chat Zalo Button */}
      <a
        href="https://zalo.me/0969985008"
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto flex items-center w-11 h-11 hover:w-[145px] bg-[#0068FF] hover:bg-[#0056D6] text-white rounded-full shadow-lg transition-all duration-300 ease-in-out overflow-hidden group"
      >
        <div className="w-11 h-11 flex items-center justify-center shrink-0">
          <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#0068FF] font-black text-xs shrink-0 group-hover:rotate-12 transition-transform">
            Z
          </span>
        </div>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 whitespace-nowrap pr-5 font-bold text-xs md:text-sm tracking-wide shrink-0">
          Chat Zalo
        </span>
      </a>

      {/* 2. Chat Facebook Button */}
      <a
        href="https://www.facebook.com/share/1AKmNJSXfa/?mibextid=wwXIfr"
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto flex items-center w-11 h-11 hover:w-[175px] bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-full shadow-lg transition-all duration-300 ease-in-out overflow-hidden group"
      >
        <div className="w-11 h-11 flex items-center justify-center shrink-0">
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#1877F2] shrink-0 group-hover:rotate-12 transition-transform">
            <MessageSquare className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 whitespace-nowrap pr-5 font-bold text-xs md:text-sm tracking-wide shrink-0">
          Chat Facebook
        </span>
      </a>

      {/* 3. Hotline Pulse Button */}
      <a
        href="tel:0969985008"
        className="pointer-events-auto flex items-center w-11 h-11 hover:w-[235px] bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-full shadow-lg transition-all duration-300 ease-in-out overflow-hidden animate-pulse hover:animate-none group"
      >
        <div className="w-11 h-11 flex items-center justify-center shrink-0">
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#D32F2F] shrink-0 group-hover:scale-110 transition-transform">
            <PhoneCall className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 whitespace-nowrap pr-5 font-bold text-xs md:text-sm tracking-wide shrink-0">
          Hotline: 0969 985 008
        </span>
      </a>
    </div>
  );
}