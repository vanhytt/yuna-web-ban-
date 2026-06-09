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
    title: "5 LÝ DO CHẢO INOX ĐƯỢC ƯA CHUỘNG?",
    sapo:
      "Chảo inox ngày càng được nhiều gia đình tin dùng bởi độ bền cao, an toàn cho sức khỏe và dễ vệ sinh. Khám phá ngay 5 lý do khiến chảo inox trở thành lựa chọn hàng đầu trong gian bếp hiện đại.",
    image: "https://images.unsplash.com/photo-1584990347449-a2d4c2b68783?w=600&q=80",
    slug: "5-ly-do-chao-inox-duoc-ua-chuong",
  },
  {
    id: 2,
    title: "MẸO GIỮ ĐỒ GIA DỤNG LUÔN SÁNG BÓNG",
    sapo:
      "Những bí quyết đơn giản giúp đồ gia dụng nhà bạn luôn sáng bóng như mới dù sử dụng hàng ngày. Chỉ cần vài thao tác nhỏ, bộ đồ bếp của bạn sẽ luôn lấp lánh và bền đẹp theo thời gian.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80",
    slug: "meo-giu-do-gia-dung-luon-sang-bong",
  },
  {
    id: 3,
    title:
      "90% GIA ĐÌNH VẪN ĐANG DÙNG CHẢO CHỐNG DÍNH BỊ TRẦY MÀ KHÔNG BIẾT ĐIỀU NÀY",
    sapo:
      "Nhiều người không biết rằng chảo chống dính bị trầy xước có thể gây nguy hiểm cho sức khỏe. Hãy cùng tìm hiểu dấu hiệu nhận biết và cách xử lý đúng đắn để bảo vệ gia đình bạn.",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80",
    slug: "90-gia-dinh-van-dung-chao-chong-dinh-bi-tray",
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
        const saved = localStorage.getItem("yuna_admin_posts");
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
            image: item.thumbnail || "https://images.unsplash.com/photo-1584990347449-a2d4c2b68783?w=600&q=80",
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
          <div className="flex-1 max-w-[120px] h-[2px] bg-[#6B8E23]" />
          <h2 className="text-2xl md:text-3xl font-bold text-black tracking-widest uppercase whitespace-nowrap">
            TIN TỨC - BÀI VIẾT
          </h2>
          <div className="flex-1 max-w-[120px] h-[2px] bg-[#6B8E23]" />
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
                <h3 className="text-sm md:text-base font-bold text-black uppercase leading-snug group-hover:text-[#6B8E23] transition-colors duration-200 line-clamp-2">
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