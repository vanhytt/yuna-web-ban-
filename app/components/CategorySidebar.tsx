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
  LifeBuoy,
  CookingPot
} from "lucide-react";

export default function CategorySidebar() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const categories = [
    { icon: <Package className="w-4 h-4 text-gray-500" />, label: "Điện gia dụng", href: "/dien-gia-dung", hasSub: true },
    { icon: <CookingPot className="w-4 h-4 text-gray-500" />, label: "Gia dụng nhà bếp", href: "/g  ia-dung-nha-bep", hasSub: true },
    { icon: <Coffee className="w-4 h-4 text-gray-500" />, label: "Gia dụng tiện ích", href: "/gia-dung-tien-ich", hasSub: true },
    { icon: <Gift className="w-4 h-4 text-gray-500" />, label: "Quà tặng và phụ kiện", href: "/qua-tang-va-phu-kien", hasSub: true },

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
