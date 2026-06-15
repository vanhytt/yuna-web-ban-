"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const ease = "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]";

  return (
    <section className="relative w-full min-h-[88vh] bg-[#070e03] overflow-hidden flex items-center">
      {/* ── STRUCTURED DATA (JSON-LD) FOR SEO ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "YUNA Vietnam",
            "url": "https://yuna.vn",
            "logo": "https://yuna.vn/icon.png",
            "description": "YUNA chuyên cung cấp các giải pháp thiết bị điện gia dụng, gia dụng nhà bếp, gia dụng tiện ích thông minh chính hãng cho gia đình Việt.",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+84-977-500-651",
              "contactType": "customer service",
              "email": "yunavietnam.info@gmail.com",
              "areaServed": "VN",
              "availableLanguage": "Vietnamese"
            },
            "sameAs": [
              "https://www.facebook.com/yunavietnamfanpage/",
              "https://www.tiktok.com/@yunavietnamm",
              "https://shopee.vn/yunavietnam68"
            ]
          })
        }}
      />

      {/* ── AMBIENT RADIAL GLOW ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[650px] h-[650px] bg-[#6B8E23]/[0.08] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#C59B27]/[0.06] rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#6B8E23]/[0.04] rounded-full blur-[80px]" />
      </div>

      {/* ── FILM GRAIN TEXTURE ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />

      {/* ── SUBTLE HORIZONTAL RULE TOP ── */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* ── MAIN LAYOUT ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-16 py-16 md:py-20 flex flex-col lg:flex-row items-center gap-14 lg:gap-10">

        {/* ════════════════════════════════
            LEFT — Typography & CTAs
        ════════════════════════════════ */}
        <div className="flex-1 lg:max-w-[55%] flex flex-col gap-7 w-full">

          {/* Eyebrow badge */}
          <div
            className={`${ease} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            style={{ transitionDelay: "0ms" }}
          >
            <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#6B8E23]/30 bg-[#6B8E23]/[0.08] text-[#9fc75a] text-[10px] uppercase tracking-[0.22em] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9fc75a] animate-pulse shrink-0" />
              Gia dụng thông minh · Việt Nam
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`${ease} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"}`}
            style={{
              transitionDelay: "90ms",
              fontFamily: "var(--font-playfair), Georgia, serif",
            }}
          >
            <span className="sr-only">YUNA - Thiết Bị Gia Dụng Thông Minh Cao Cấp: </span>
            <span className="block text-white text-[2.6rem] sm:text-[3.4rem] md:text-[3.8rem] lg:text-[4rem] xl:text-[4.5rem] leading-[1.05] font-bold tracking-tight">
              Nâng tầm
            </span>
            <span className="block text-[#C59B27] text-[2.6rem] sm:text-[3.4rem] md:text-[3.8rem] lg:text-[4rem] xl:text-[4.5rem] leading-[1.05] font-bold italic tracking-tight">
              không gian sống
            </span>
            <span className="block text-white text-[2.6rem] sm:text-[3.4rem] md:text-[3.8rem] lg:text-[4rem] xl:text-[4.5rem] leading-[1.05] font-bold tracking-tight">
              mỗi ngày
            </span>
          </h1>

          {/* Thin gold separator */}
          <div
            className={`${ease} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="w-16 h-px bg-gradient-to-r from-[#C59B27]/70 via-[#C59B27]/25 to-transparent" />
          </div>

          {/* Description */}
          <p
            className={`text-white/50 text-[14.5px] md:text-[15px] leading-[1.8] max-w-[440px] ${ease} ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "270ms" }}
          >
            <strong>YUNA</strong> mang đến các giải pháp <strong>gia dụng thực dụng</strong>, tối ưu hóa sự tiện nghi và tiết kiệm thời gian quý báu cho mỗi gia đình Việt.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-3 ${ease} ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "350ms" }}
          >
            {/* Primary — button-in-button pattern */}
            <Link
              href="/dien-gia-dung"
              title="Mua sắm thiết bị điện gia dụng thông minh YUNA chính hãng"
              className="group inline-flex items-center justify-between gap-2 pl-6 pr-2 py-2 bg-[#6B8E23] hover:bg-[#5c7b1d] text-white font-semibold rounded-full text-sm tracking-wide transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.025] active:scale-[0.97] shadow-xl shadow-[#6B8E23]/20 w-fit"
            >
              <span>Mua ngay</span>
              <span className="w-8 h-8 rounded-full bg-white/15 group-hover:bg-white/20 flex items-center justify-center shrink-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 17L17 7M17 7H7M17 7v10"
                  />
                </svg>
              </span>
            </Link>

            {/* Secondary */}
            <Link
              href="/gioi-thieu"
              title="Tìm hiểu thêm câu chuyện thương hiệu và sứ mệnh của gia dụng YUNA"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/12 hover:border-white/28 text-white/60 hover:text-white/90 rounded-full text-sm font-medium tracking-wide transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/[0.04] w-fit"
            >
              Tìm hiểu thêm
            </Link>
          </div>

          {/* Stats row */}
          <div
            className={`flex items-center gap-8 pt-1 ${ease} ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "430ms" }}
          >
            {[
              { num: "10K+", label: "Khách hàng" },
              { num: "500+", label: "Sản phẩm" },
              { num: "5 ★", label: "Đánh giá" },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div className="w-px h-8 bg-white/[0.08] shrink-0" />}
                <div className="flex flex-col gap-0.5">
                  <span
                    className="text-white font-bold text-xl leading-none"
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                    }}
                  >
                    {s.num}
                  </span>
                  <span className="text-white/35 text-[10px] uppercase tracking-[0.15em]">
                    {s.label}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Social icons */}
          <div
            className={`flex items-center gap-3 ${ease} ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "510ms" }}
          >
            <span className="text-white/20 text-[9px] uppercase tracking-[0.2em] font-medium shrink-0">
              Follow
            </span>
            <div className="w-6 h-px bg-white/[0.12]" />

            <a
              href="https://www.facebook.com/yunavietnamfanpage/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook YUNA"
              title="Theo dõi YUNA Vietnam trên Facebook"
              className="w-8 h-8 rounded-full border border-white/[0.09] hover:border-blue-500/50 hover:bg-blue-600/10 flex items-center justify-center text-white/35 hover:text-blue-400 transition-all duration-300 hover:scale-110"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            <a
              href="https://www.tiktok.com/@yunavietnamm?_r=1&_t=ZS-975BbJaGGNU"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok YUNA"
              title="Theo dõi các video review gia dụng YUNA trên TikTok"
              className="w-8 h-8 rounded-full border border-white/[0.09] hover:border-white/35 hover:bg-white/[0.05] flex items-center justify-center text-white/35 hover:text-white transition-all duration-300 hover:scale-110"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.78-.22-.22-.4-.45-.58-.7v5.89c.04 2.23-.74 4.54-2.4 5.97-1.92 1.67-4.73 2.05-7.04 1.25-2.85-1-4.71-3.95-4.47-7.07.19-2.61 2-5.06 4.63-5.69 1.15-.28 2.37-.18 3.48.24v4.16c-.84-.36-1.8-.46-2.67-.14-1.22.42-2.12 1.74-2.02 3.05.12 1.45 1.43 2.62 2.87 2.45 1.52-.07 2.64-1.47 2.58-2.98V.02z" />
              </svg>
            </a>

            <a
              href="https://shopee.vn/yunavietnam68?entryPoint=ShopBySearch&searchKeyword=yunavietnam"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Shopee YUNA"
              title="Mua sắm trực tuyến các sản phẩm YUNA chính hãng trên Shopee"
              className="w-8 h-8 rounded-full border border-white/[0.09] hover:border-[#EE4D2D]/50 hover:bg-[#EE4D2D]/10 flex items-center justify-center text-white/35 hover:text-[#EE4D2D] transition-all duration-300 hover:scale-110"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19.7 6.4h-3.2C16 3.2 14.2 1 12 1S8 3.2 7.5 6.4H4.3C3.6 6.4 3 7 3 7.7v12.2C3 21.3 4.2 23 5.7 23h12.6c1.5 0 2.7-1.7 2.7-3.1V7.7c0-.7-.6-1.3-1.3-1.3zM12 3c1.1 0 2 1.5 2.2 3.4H9.8C10 4.5 10.9 3 12 3zm0 13c-2.4 0-4.3-1.8-4.3-4.1h1.7c0 1.3 1.2 2.4 2.6 2.4s2.6-1.1 2.6-2.4h1.7c0 2.3-1.9 4.1-4.3 4.1z" />
              </svg>
            </a>
          </div>
        </div>

        {/* ════════════════════════════════
            RIGHT — Double-Bezel Image Frame
        ════════════════════════════════ */}
        <div
          className={`w-full lg:flex-1 lg:max-w-[43%] ${ease} ${
            visible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-10 scale-[0.96]"
          }`}
          style={{ transitionDelay: "180ms" }}
        >
          {/* Outer shell — Doppelrand */}
          <div className="relative p-2 bg-white/[0.025] ring-1 ring-white/[0.07] rounded-[2.5rem]">
            {/* Inner core */}
            <div
              className="relative overflow-hidden rounded-[2rem] w-full aspect-[3/4] md:aspect-[4/5]"
              style={{
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.06)",
              }}
            >
              <Image
                src="https://i.pinimg.com/736x/18/0d/e9/180de9e2db8641926032c1c5bcb54f94.jpg"
                alt="Không gian bếp hiện đại với các sản phẩm gia dụng thông minh cao cấp của YUNA Vietnam"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 43vw"
                className="object-cover object-center"
              />

              {/* Inner vignette — bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070e03]/65 via-[#070e03]/10 to-transparent" />
              {/* Inner vignette — sides */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#070e03]/20 via-transparent to-[#070e03]/10" />

              {/* ── Floating warranty badge (bottom-left) — double bezel ── */}
              <div className="absolute bottom-5 left-5">
                {/* badge outer shell */}
                <div className="p-1.5 bg-black/20 ring-1 ring-white/[0.09] rounded-2xl">
                  {/* badge inner core */}
                  <div
                    className="bg-[#0a1405]/85 rounded-[calc(0.75rem)] px-4 py-3 flex items-center gap-3"
                    style={{
                      boxShadow: "inset 0 1px 0px rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#6B8E23]/15 border border-[#6B8E23]/25 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4 text-[#9fc75a]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white text-[12px] font-semibold leading-tight">
                        Bảo hành chính hãng
                      </p>
                      <p className="text-white/35 text-[10px] mt-0.5 leading-tight">
                        12 tháng · Hỗ trợ tại nhà
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Contact info beneath frame ── */}
          <div
            className="mt-4 px-2 flex items-center justify-between"
            aria-label="Thông tin liên hệ"
          >
            <a
              href="mailto:yunavietnam.info@gmail.com"
              className="text-white/25 hover:text-white/50 text-[10px] tracking-wide transition-colors duration-300"
            >
              yunavietnam.info@gmail.com
            </a>
            <a
              href="tel:0977500651"
              className="text-white/25 hover:text-white/50 text-[10px] tracking-wide transition-colors duration-300"
            >
              0977 500 651
            </a>
          </div>
        </div>
      </div>

      {/* ── SCROLL INDICATOR ── */}
      <div
        className={`absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 ${ease} ${
          visible ? "opacity-25" : "opacity-0"
        }`}
        style={{ transitionDelay: "900ms" }}
      >
        <span className="text-white text-[9px] uppercase tracking-[0.25em] font-light">
          Khám phá
        </span>
        {/* Mouse scroll icon */}
        <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center pt-1.5">
          <div className="w-[3px] h-2 bg-white/70 rounded-full animate-bounce" />
        </div>
      </div>

      {/* ── BOTTOM EDGE FADE TO PAGE BG ── */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#FDFBF7]/[0.06] to-transparent pointer-events-none" />
    </section>
  );
}