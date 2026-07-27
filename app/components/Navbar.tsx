"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const productSubItems = [
    { label: "Ví da cao cấp", href: "/vi-da-cao-cap" },
    { label: "Thắt lưng da", href: "/that-lung-da" },
    { label: "Bộ quà tặng (Giftset)", href: "/bo-qua-tang" },
    { label: "Phụ kiện da", href: "/phu-kien-da" },
  ];

  return (
    <nav className="w-full bg-[#1c1917] text-white shadow-md relative z-45 font-sans border-b border-[#8C6239]/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12 md:h-14">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-[#8C6239] focus:outline-hidden"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2 h-full flex-1 justify-center">
            {/* Trang chủ */}
            <Link
              href="/"
              className="relative px-3 lg:px-4 py-2 text-sm lg:text-base font-medium tracking-wide transition-colors rounded-md duration-200 whitespace-nowrap group"
            >
              <span>Trang chủ</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#C59B27] transition-all duration-300 group-hover:w-[80%]" />
            </Link>

            {/* Giới thiệu */}
            <Link
              href="/gioi-thieu"
              className="relative px-3 lg:px-4 py-2 text-sm lg:text-base font-medium tracking-wide transition-colors rounded-md duration-200 whitespace-nowrap group"
            >
              <span>Giới thiệu</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#C59B27] transition-all duration-300 group-hover:w-[80%]" />
            </Link>

            {/* Sản phẩm (Dropdown Menu) */}
            <div className="group relative py-2">
              <button
                className="relative px-3 lg:px-4 py-2 text-sm lg:text-base font-medium tracking-wide transition-colors rounded-md duration-200 whitespace-nowrap inline-flex items-center gap-1.5 cursor-pointer"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span>Sản phẩm</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#C59B27] transition-all duration-300 group-hover:w-[80%]" />
              </button>
              {/* Dropdown container */}
              <div className="absolute top-[85%] left-0 hidden group-hover:block w-56 bg-[#1c1917] border border-[#8C6239]/30 rounded-md shadow-xl py-1.5 z-50">
                {productSubItems.map((sub, sIdx) => (
                  <Link
                    key={sIdx}
                    href={sub.href}
                    className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-[#8C6239] transition-colors duration-150"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Tin tức */}
            <Link
              href="/tin-tuc"
              className="relative px-3 lg:px-4 py-2 text-sm lg:text-base font-medium tracking-wide transition-colors rounded-md duration-200 whitespace-nowrap group"
            >
              <span>Tin tức</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#C59B27] transition-all duration-300 group-hover:w-[80%]" />
            </Link>

            {/* Liên hệ */}
            <Link
              href="#footer"
              className="relative px-3 lg:px-4 py-2 text-sm lg:text-base font-medium tracking-wide transition-colors rounded-md duration-200 whitespace-nowrap group"
            >
              <span>Liên hệ</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#C59B27] transition-all duration-300 group-hover:w-[80%]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Smooth slide down) */}
      <div
        className={`md:hidden absolute left-0 right-0 bg-[#1c1917] border-t border-[#8C6239]/30 transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-screen opacity-100 py-3" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col px-4 gap-1.5">
          {/* Trang chủ */}
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="px-3 py-2 text-base font-medium tracking-wide hover:bg-[#8C6239] rounded-md transition-colors"
          >
            Trang chủ
          </Link>

          {/* Giới thiệu */}
          <Link
            href="/gioi-thieu"
            onClick={() => setIsOpen(false)}
            className="px-3 py-2 text-base font-medium tracking-wide hover:bg-[#8C6239] rounded-md transition-colors"
          >
            Giới thiệu
          </Link>

          {/* Sản phẩm Accordion */}
          <div>
            <button
              onClick={() => setIsProductsOpen(!isProductsOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-base font-medium tracking-wide hover:bg-[#8C6239] rounded-md transition-colors text-left"
            >
              <span>Sản phẩm</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProductsOpen ? "rotate-180" : ""}`} />
            </button>
            <div
              className={`pl-4 flex flex-col gap-1 transition-all duration-300 overflow-hidden ${
                isProductsOpen ? "max-h-60 mt-1" : "max-h-0 opacity-0 pointer-events-none"
              }`}
            >
              {productSubItems.map((sub, sIdx) => (
                <Link
                  key={sIdx}
                  href={sub.href}
                  onClick={() => {
                    setIsOpen(false);
                    setIsProductsOpen(false);
                  }}
                  className="px-3 py-2 text-sm font-medium tracking-wide hover:bg-[#8C6239]/50 rounded-md text-white/80 transition-colors"
                >
                  {sub.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Tin tức */}
          <Link
            href="/tin-tuc"
            onClick={() => setIsOpen(false)}
            className="px-3 py-2 text-base font-medium tracking-wide hover:bg-[#8C6239] rounded-md transition-colors"
          >
            Tin tức
          </Link>

          {/* Liên hệ */}
          <Link
            href="#footer"
            onClick={() => setIsOpen(false)}
            className="px-3 py-2 text-base font-medium tracking-wide hover:bg-[#8C6239] rounded-md transition-colors"
          >
            Liên hệ
          </Link>
        </div>
      </div>
    </nav>
  );
}