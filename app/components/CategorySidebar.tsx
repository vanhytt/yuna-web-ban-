"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  ChevronRight,
  Coffee,
  Wine,
  Award,
  BookOpen,
  Laptop,
  Briefcase,
  Watch,
  Gift,
  Umbrella,
  Flame,
  Package,
  Baby,
  Gem,
  LifeBuoy
} from "lucide-react";

export default function CategorySidebar() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const categories = [
    { icon: <Coffee className="w-4 h-4 text-gray-500" />, label: "Cốc - Bình giữ nhiệt - Bình nước", href: "/coc-binh-giu-nhiet", hasSub: true },
    { icon: <Wine className="w-4 h-4 text-gray-500" />, label: "Hộp đựng rượu vang", href: "/hop-dung-ruou-vang", hasSub: true },
    { icon: <Award className="w-4 h-4 text-gray-500" />, label: "Biển tên - Huy hiệu - Vinh danh", href: "/bien-ten-huy-hieu-vinh-danh", hasSub: true },
    { icon: <BookOpen className="w-4 h-4 text-gray-500" />, label: "Bút - Sổ - Hộp namecard", href: "/but-so-hop-namecard", hasSub: true },
    { icon: <Laptop className="w-4 h-4 text-gray-500" />, label: "Quà tặng IT", href: "/qua-tang-it", hasSub: false },
    { icon: <Briefcase className="w-4 h-4 text-gray-500" />, label: "Balo - Túi - Ví - Cặp", href: "/balo-tui-vi-cap", hasSub: true },
    { icon: <Watch className="w-4 h-4 text-gray-500" />, label: "Vòng tay - Quạt - Móc khóa", href: "/vong-tay-quat-moc-khoa", hasSub: true },
    { icon: <Umbrella className="w-4 h-4 text-gray-500" />, label: "Ô - Áo - Mũ - Thẻ hành lý", href: "/o-ao-mu-the-hanh-ly", hasSub: true },
    { icon: <Flame className="w-4 h-4 text-gray-500" />, label: "Gạt tàn - Bật lửa - Lót ly", href: "/gat-tan-bat-lua-lot-ly", hasSub: true },
    { icon: <Package className="w-4 h-4 text-gray-500" />, label: "Bộ quà tặng - Bộ giftset", href: "/bo-qua-tang-bo-giftset", hasSub: true },
    { icon: <Watch className="w-4 h-4 text-gray-500" />, label: "Quà tặng đồng hồ", href: "/qua-tang-dong-ho", hasSub: true },
    { icon: <Baby className="w-4 h-4 text-gray-500" />, label: "Quà tặng dành cho trẻ em", href: "/qua-tang-danh-cho-tre-em", hasSub: true },
    { icon: <Gem className="w-4 h-4 text-gray-500" />, label: "Quà tặng cao cấp", href: "/qua-tang-cao-cap", hasSub: true },
    { icon: <LifeBuoy className="w-4 h-4 text-gray-500" />, label: "Bộ sản phẩm bơm hơi", href: "/bo-san-pham-bom-hoi", hasSub: true },
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden font-sans h-full flex flex-col">
      {/* Header */}
      <div className="bg-[#588f27] text-white px-4 py-3.5 flex items-center gap-2 font-bold uppercase text-sm tracking-wide shrink-0">
        <Menu className="w-5 h-5" />
        DANH MỤC SẢN PHẨM
      </div>

      {/* Category List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-1 custom-scrollbar">
        <ul className="flex flex-col">
          {categories.map((category, idx) => (
            <li
              key={idx}
              onMouseEnter={() => setActiveCategory(idx)}
              onMouseLeave={() => setActiveCategory(null)}
              className="group relative"
            >
              <Link
                href={category.href}
                className="flex items-center justify-between px-4 py-2.5 text-xs lg:text-[13px] text-gray-700 hover:text-[#588f27] hover:bg-green-50 transition-colors border-b border-gray-50 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  {/* Icon container */}
                  <span className="group-hover:text-[#588f27] transition-colors">
                    {React.cloneElement(category.icon as any, {
                      className: `w-4 h-4 ${activeCategory === idx ? 'text-[#588f27]' : 'text-gray-400'}`
                    })}
                  </span>
                  <span className="font-medium truncate max-w-[160px] lg:max-w-[180px] xl:max-w-[200px]">
                    {category.label}
                  </span>
                </div>
                {category.hasSub && (
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${activeCategory === idx ? 'text-[#588f27]' : 'text-gray-300'}`} />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
