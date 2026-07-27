"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FloatingButtons from "../../components/FloatingButtons";
import { supabase } from "../../../lib/supabase";

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

export default function NewsDetailPage() {
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  const checkConnection = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return !!(url && key && !url.includes("placeholder-url"));
  };

  useEffect(() => {
    const loadPost = async () => {
      if (!params?.id) return;

      setLoading(true);

      if (!checkConnection()) {
        const saved = localStorage.getItem("ploybay_admin_posts");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const found = parsed.find((item: Post) => String(item.id) === String(params.id));
            setPost(found || null);
          } catch {
            setPost(null);
          }
        }
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", Number(params.id))
          .single();

        if (error) throw error;
        setPost(data as Post);
      } catch (err) {
        console.warn("Lỗi khi tải bài viết chi tiết:", err);
        const saved = localStorage.getItem("ploybay_admin_posts");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const found = parsed.find((item: Post) => String(item.id) === String(params.id));
            setPost(found || null);
          } catch {
            setPost(null);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
        <Header />
        <Navbar />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-10 w-3/4 bg-gray-200 rounded" />
            <div className="h-80 w-full bg-gray-200 rounded-2xl" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
          </div>
        </main>
        <Footer />
        <FloatingButtons />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
        <Header />
        <Navbar />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Không tìm thấy bài viết</h1>
          <p className="text-gray-500 mt-3">Bài viết bạn đang mở không tồn tại hoặc đã bị xóa.</p>
          <Link href="/tin-tuc" className="inline-flex mt-6 rounded-xl bg-[#C59B27] px-4 py-2.5 text-white font-semibold hover:bg-[#a17b1d] transition-colors">Quay lại Tin tức</Link>
        </main>
        <Footer />
        <FloatingButtons />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans text-gray-900">
      <Header />
      <Navbar />

      <section className="relative w-full overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <div className="relative h-[320px] sm:h-[380px] md:h-[450px] w-full">
          <Image
            src={post.thumbnail || "https://images.unsplash.com/photo-1627124356238-3dbb4d5ce4d4?w=1600&q=80"}
            alt={post.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            unoptimized
          />
        </div>
      </section>

      <main className="flex-1 w-full bg-[#FDFBF7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
          <article className="rounded-[28px] border border-gray-200 bg-white shadow-xl p-6 md:p-8 lg:p-10">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
              <Link href="/" className="hover:text-[#C59B27] transition-colors">Trang chủ</Link>
              <span>/</span>
              <Link href="/tin-tuc" className="hover:text-[#C59B27] transition-colors">Tin tức</Link>
              <span>/</span>
              <span className="text-[#C59B27] font-semibold line-clamp-1">{post.title}</span>
            </nav>

            <div className="mb-8 border-b border-gray-100 pb-6">
              <span className="inline-flex rounded-full bg-[#C59B27] px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-sm">
                {post.category || "TIN TỨC PLOYBAY"}
              </span>

              <h1 className="mt-4 text-3xl md:text-5xl font-black tracking-tight text-gray-900 leading-tight">
                {post.title}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-600 md:text-base">
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 font-medium text-[#B45309]">
                  Viết bởi {post.author || "PLOYBAY Editor"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-gray-600">
                  {post.created_at ? new Date(post.created_at).toLocaleDateString("vi-VN") : "Mới đăng"}
                </span>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] items-start">
              <div className="space-y-6 text-gray-700">
                <p className="text-lg md:text-xl leading-relaxed text-gray-700">
                  {post.content?.replace(/<[^>]+>/g, " ").slice(0, 260) || "Khám phá những câu chuyện thương hiệu, xu hướng thời trang quý ông và cẩm nang bảo quản phụ kiện da cao cấp từ PLOYBAY."}
                </p>

                <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-4 text-sm md:text-base text-gray-700 shadow-sm">
                  <p className="font-semibold text-[#B45309] mb-2">Gợi ý đọc thêm</p>
                  <p>Hãy cùng theo dõi những chia sẻ mới nhất về phong cách sống của quý ông, bí quyết phối đồ da và cẩm nang lựa chọn quà tặng đẳng cấp từ PLOYBAY.</p>
                </div>
              </div>

              <aside className="rounded-3xl bg-gradient-to-br from-[#C59B27] to-[#8c6d17] p-5 text-white shadow-lg">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-100">Bài viết nổi bật</p>
                <h2 className="mt-3 text-xl font-bold leading-snug">{post.title}</h2>
                <p className="mt-3 text-sm text-amber-50/90 leading-relaxed">{post.content?.replace(/<[^>]+>/g, " ").slice(0, 180) || "Bài viết được tối ưu để hiển thị rõ ràng, dễ đọc và hấp dẫn hơn trên mọi thiết bị."}</p>
              </aside>
            </div>

            <section className="mt-10 rounded-3xl border border-gray-100 bg-white p-1">
              <div className="rounded-[24px] bg-[#FDFBF7] p-6 md:p-8 border border-gray-100">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Nội dung chi tiết</h2>
                <div className="mt-6 text-lg md:text-xl leading-8 text-gray-700 whitespace-pre-wrap prose max-w-none">
                  {post.content || "Chưa có nội dung cho bài viết này."}
                </div>

                {post.thumbnail && (
                  <figure className="mt-8 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                    <div className="relative aspect-[16/9] w-full">
                      <Image
                        src={post.thumbnail}
                        alt={`${post.title} illustration`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 900px"
                        unoptimized
                      />
                    </div>
                    <figcaption className="px-4 py-3 text-sm text-gray-500">Hình ảnh minh họa cho bài viết</figcaption>
                  </figure>
                )}
              </div>
            </section>
          </article>
        </div>
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
