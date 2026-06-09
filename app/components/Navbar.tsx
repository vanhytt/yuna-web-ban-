"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Giới thiệu", href: "/gioi-thieu" },
    { label: "Điện gia dụng", href: "/dien-gia-dung" },
    { label: "Gia dụng Nhà Bếp", href: "/gia-dung-nha-bep" },
    { label: "Gia dụng Tiện ích", href: "/gia-dung-tien-ich" },
    { label: "Quà tặng và Phụ kiện", href: "/qua-tang-va-phu-kien" },
    { label: "Tin tức", href: "/tin-tuc" },
    { label: "Liên hệ", href: "#" },
  ];

  return (
    <nav className="w-full bg-[#6B8E23] text-white shadow-md relative z-40 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12 md:h-14">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-[#5a781e] focus:outline-hidden"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2 h-full flex-1 flex-wrap justify-center">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="px-3 lg:px-4 py-2 text-sm lg:text-base font-semibold hover:bg-[#5a781e] transition-colors rounded-md duration-200 whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Smooth slide down) */}
      <div
        className={`md:hidden absolute left-0 right-0 bg-[#6B8E23] border-t border-[#5a781e] transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-screen opacity-100 py-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-4 gap-1">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 text-base font-semibold hover:bg-[#5a781e] rounded-md transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
