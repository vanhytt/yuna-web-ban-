"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

interface NewsArticle {
  id: number;
  title: string;
  sapo: string;
  image: string;
  slug: string;
}

const fallbackArticles: NewsArticle[] = [
  {
    id: 1,
    title: "CÁCH PHÂN BIỆT VÍ DA THẬT VÀ DA GIẢ CHI TIẾT NHẤT",
    sapo:
      "Để không mua nhầm các sản phẩm giả da kém chất lượng, PLOYBAY chia sẻ đến bạn những mẹo đơn giản để phân biệt ví da thật và giả bằng mắt thường và xúc giác.",
    image: "https://images.unsplash.com/photo-1627124356238-3dbb4d5ce4d4?w=600&q=80",
    slug: "cach-phan-biet-vi-da-that-va-da-gia-chi-tiet-nhat",
  },
  {
    id: 2,
    title: "BÍ QUYẾT BẢO QUẢN THẮT LƯNG DA LUÔN NHƯ MỚI",
    sapo:
      "Thắt lưng da nam cao cấp nếu không biết cách bảo quản sẽ dễ bị ẩm mốc, rạn nứt. Hãy lưu lại ngay những bí quyết cực đơn giản giúp món phụ kiện của bạn luôn bền đẹp.",
    image: "https://images.unsplash.com/photo-1624222247344-550fb8ecf78d?w=600&q=80",
    slug: "bi-quyet-bao-quan-that-lung-da-luon-nhu-moi",
  },
  {
    id: 3,
    title: "GỢI Ý SET QUÀ TẶNG QUÝ ÔNG LỊCH LÃM VÀ Ý NGHĨA",
    sapo:
      "Chọn quà tặng cho nam giới chưa bao giờ là dễ dàng. Dưới đây là những set quà tặng ví da, thắt lưng phối sẵn sang trọng và tinh tế phù hợp cho mọi dịp lễ đặc biệt.",
    image: "https://images.unsplash.com/photo-1549439602-43ebca2327af?w=600&q=80",
    slug: "goi-y-set-qua-tang-quy-ong-lich-lam-va-y-nghia",
  },
];

export default function NewsGrid() {
  const [articles, setArticles] = useState<NewsArticle[]>(fallbackArticles);

  const checkConnection = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return !!(url && key && !url.includes("placeholder-url"));
  };

  useEffect(() => {
    const loadArticles = async () => {
      if (!checkConnection()) {
        // Fallback to local storage if saved there by admin, otherwise static fallback
        const saved = localStorage.getItem("ploybay_admin_posts");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const mapped = parsed.map((item: any) => ({
              id: item.id,
              title: item.title,
              sapo: item.content,
              image: item.thumbnail,
              slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
            }));
            setArticles(mapped.slice(0, 3));
          } catch {
            setArticles(fallbackArticles);
          }
        } else {
          setArticles(fallbackArticles);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("status", "Công khai")
          .order("id", { ascending: true })
          .limit(3);

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped: NewsArticle[] = data.map((item) => ({
            id: item.id,
            title: item.title,
            sapo: item.content || "",
            image: item.thumbnail || "https://images.unsplash.com/photo-1627124356238-3dbb4d5ce4d4?w=600&q=80",
            slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
          }));
          setArticles(mapped);
        } else {
          setArticles(fallbackArticles);
        }
      } catch (err) {
        console.warn("Lỗi khi tải bài viết từ Supabase:", err);
        setArticles(fallbackArticles);
      }
    };

    loadArticles();
  }, []);

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="flex-1 max-w-[120px] h-[2px] bg-[#C59B27]" />
          <h2 className="text-2xl md:text-3xl font-bold text-black tracking-widest uppercase whitespace-nowrap">
            TIN TỨC - BÀI VIẾT
          </h2>
          <div className="flex-1 max-w-[120px] h-[2px] bg-[#C59B27]" />
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article, index) => (
            <Link
              key={article.id}
              href={`/tin-tuc/${article.id}`}
              className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  unoptimized
                />
              </div>

              {/* Content */}
              <div className="pt-4 flex flex-col gap-2">
                <h3 className="text-sm md:text-base font-bold text-black uppercase leading-snug group-hover:text-[#C59B27] transition-colors duration-200 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                  {article.sapo}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}