"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Flame, CheckCircle } from "lucide-react";
import CategorySidebar from "./CategorySidebar";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Gia Dụng Thông Minh",
      subtitle: "Tiện ích hơn cho mọi người - Thông minh hơn cho mỗi nhà",
      tagline: "ƯU ĐÃI LÊN ĐẾN 40%",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
      cta: "Mua Ngay",
      badge: "Xu Hướng 2026",
      badgeColor: "bg-[#6B8E23]"
    },
    {
      title: "Giải Pháp Dọn Dẹp Hiện Đại",
      subtitle: "Robot hút bụi và máy lọc không khí thế hệ mới",
      tagline: "BẢO HÀNH CHÍNH HÃNG 2 NĂM",
      image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=1200&q=80",
      cta: "Khám Phá",
      badge: "Bán Chạy Nhất",
      badgeColor: "bg-[#C59B27]"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="w-full py-6 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar - 3 cols */}
        <div className="hidden lg:block lg:col-span-3 h-[320px] md:h-[420px]">
          <CategorySidebar />
        </div>

        {/* Center Slider - 6 cols */}
        <div className="lg:col-span-6 relative h-[320px] md:h-[420px] rounded-2xl overflow-hidden shadow-md group">
          {/* Slides */}
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.15) 100%), url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 text-white">
                <span className={`self-start text-xs font-bold px-3 py-1 rounded-full ${slide.badgeColor} text-white mb-3 tracking-wider flex items-center gap-1 shadow-xs`}>
                  <Sparkles className="w-3 h-3" />
                  {slide.badge}
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight max-w-lg">
                  {slide.title}
                </h1>
                <p className="text-sm md:text-lg mb-6 text-gray-200 font-medium max-w-md leading-relaxed">
                  {slide.subtitle}
                </p>
                <div className="flex items-center gap-2 mb-8">
                  <span className="text-[#C59B27] font-bold text-sm tracking-wide bg-[#C59B27]/10 border border-[#C59B27]/30 px-3 py-1 rounded-sm">
                    {slide.tagline}
                  </span>
                </div>
                <a
                  href="#"
                  className="self-start px-8 py-3 bg-[#6B8E23] hover:bg-[#5a781e] text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] shadow-md text-sm md:text-base"
                >
                  {slide.cta}
                </a>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-xs transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-xs transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicator Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? "bg-[#C59B27] w-6" : "bg-white/50 hover:bg-white"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Side Banners - 3 cols, stacked */}
        <div className="lg:col-span-3 flex flex-col gap-6 justify-between h-[320px] md:h-[420px]">
          {/* Upper Banner: Gia dụng nhà bếp */}
          <div
            className="relative h-[148px] md:h-[198px] rounded-2xl overflow-hidden shadow-md group flex items-center"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%), url('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-[#6B8E23]/10 mix-blend-multiply group-hover:bg-transparent transition-all duration-300" />
            <div className="relative z-10 px-6 text-white flex flex-col">
              <span className="text-[10px] font-bold tracking-widest text-[#C59B27] uppercase mb-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-current" />
                Tiện nghi mỗi ngày
              </span>
              <h2 className="text-xl md:text-2xl font-bold leading-tight mb-1">
                Gia dụng nhà bếp
              </h2>
              <p className="text-xs text-gray-200 mb-4 max-w-[200px]">
                Nơi khơi nguồn ấm áp, nâng tầm bữa ăn gia đình
              </p>
              <a
                href="#"
                className="self-start text-xs font-bold text-white border-b-2 border-white hover:border-[#C59B27] hover:text-[#C59B27] transition-all pb-0.5"
              >
                XEM BỘ SƯU TẬP
              </a>
            </div>
          </div>

          {/* Lower Banner: Gia dụng tiện ích */}
          <div
            className="relative h-[148px] md:h-[198px] rounded-2xl overflow-hidden shadow-md group flex items-center"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%), url('https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-[#C59B27]/10 mix-blend-multiply group-hover:bg-transparent transition-all duration-300" />
            <div className="relative z-10 px-6 text-white flex flex-col">
              <span className="text-[10px] font-bold tracking-widest text-[#C59B27] uppercase mb-1 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Thiết thực & Thông minh
              </span>
              <h2 className="text-xl md:text-2xl font-bold leading-tight mb-1">
                Gia dụng tiện ích
              </h2>
              <p className="text-xs text-gray-200 mb-4 max-w-[200px]">
                Tối ưu hóa không gian, tiết kiệm thời gian
              </p>
              <a
                href="#"
                className="self-start text-xs font-bold text-white border-b-2 border-white hover:border-[#C59B27] hover:text-[#C59B27] transition-all pb-0.5"
              >
                XEM CHI TIẾT
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
