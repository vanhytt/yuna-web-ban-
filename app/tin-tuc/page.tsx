"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingButtons from "../components/FloatingButtons";
import { supabase } from "../../lib/supabase";

interface Post {
  id: number;
  title: string;
  content: string;
  thumbnail?: string;
  category?: string;
  author?: string;
  status?: string;
  created_at?: string;
}

const fallbackPosts: Post[] = [
  {
    id: 1,
    title: "Cách phân biệt ví da thật và da giả chi tiết nhất",
    content: "Để không mua nhầm các sản phẩm giả da kém chất lượng, Swordsman chia sẻ đến bạn những mẹo đơn giản để phân biệt ví da thật và giả bằng mắt thường và xúc giác.",
    thumbnail: "https://images.unsplash.com/photo-1627124356238-3dbb4d5ce4d4?w=600&q=80",
    category: "Tin tức Swordsman",
    author: "Swordsman Editor",
    status: "Công khai",
  },
  {
    id: 2,
    title: "Bí quyết bảo quản thắt lưng da luôn như mới",
    content: "Thắt lưng da nam cao cấp nếu không biết cách bảo quản sẽ dễ bị ẩm mốc, rạn nứt. Hãy lưu lại ngay những bí quyết cực đơn giản giúp món phụ kiện của bạn luôn bền đẹp.",
    thumbnail: "https://images.unsplash.com/photo-1624222247344-550fb8ecf78d?w=600&q=80",
    category: "Tin tức Swordsman",
    author: "Swordsman Editor",
    status: "Công khai",
  },
];

export default function NewsPage() {
  const [posts, setPosts] = useState<Post[]>(fallbackPosts);
  const [loading, setLoading] = useState(true);

  const checkConnection = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return !!(url && key && !url.includes("placeholder-url"));
  };

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);

      if (!checkConnection()) {
        const saved = localStorage.getItem("swordsman_admin_posts");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setPosts(Array.isArray(parsed) ? parsed : fallbackPosts);
          } catch {
            setPosts(fallbackPosts);
          }
        } else {
          setPosts(fallbackPosts);
        }
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("status", "Công khai")
          .order("id", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setPosts(data as Post[]);
        } else {
          const saved = localStorage.getItem("swordsman_admin_posts");
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              setPosts(Array.isArray(parsed) ? parsed : fallbackPosts);
            } catch {
              setPosts(fallbackPosts);
            }
          } else {
            setPosts(fallbackPosts);
          }
        }
      } catch (err) {
        console.warn("Lỗi khi tải danh sách tin tức:", err);
        const saved = localStorage.getItem("swordsman_admin_posts");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setPosts(Array.isArray(parsed) ? parsed : fallbackPosts);
          } catch {
            setPosts(fallbackPosts);
          }
        } else {
          setPosts(fallbackPosts);
        }
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      <Header />
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#C59B27] transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="text-[#C59B27] font-semibold">Tin tức</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-widest">Tin tức</h1>
          <p className="text-gray-500 mt-2">Cập nhật thông tin, xu hướng thời trang và cẩm nang phụ kiện da nam từ Swordsman.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-gray-100 bg-white p-4 animate-pulse shadow-sm">
                <div className="aspect-[4/3] rounded-xl bg-gray-200" />
                <div className="mt-4 h-4 w-1/3 bg-gray-200 rounded" />
                <div className="mt-3 h-5 w-full bg-gray-200 rounded" />
                <div className="mt-2 h-5 w-2/3 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <article key={post.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <Link href={`/tin-tuc/${post.id}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                    <Image
                      src={post.thumbnail || "https://images.unsplash.com/photo-1584990347449-a2d4c2b68783?w=600&q=80"}
                      alt={post.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      unoptimized
                    />
                  </div>
                </Link>

                 <div className="p-5 flex flex-col gap-3">
                   <span className="text-xs uppercase tracking-[0.2em] text-[#C59B27] font-semibold">{post.category || "Tin tức"}</span>
                   <Link href={`/tin-tuc/${post.id}`} className="group">
                     <h2 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-[#C59B27] transition-colors line-clamp-2">{post.title}</h2>
                   </Link>
                   <p className="text-sm text-gray-600 line-clamp-3">{post.content?.replace(/<[^>]+>/g, " ").slice(0, 180)}...</p>
                   <div className="pt-2 flex items-center justify-between text-xs text-gray-500">
                     <span>{post.author || "Swordsman"}</span>
                     <span>{post.created_at ? new Date(post.created_at).toLocaleDateString("vi-VN") : "Mới"}</span>
                   </div>
                 </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
