"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, X, Check, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "../../../lib/supabase";

interface VideoItem {
  id?: number;
  title: string;
  video_url: string;
  thumbnail_url?: string;
  product_id?: number | null;
  product_name?: string;
}

interface ProductOption {
  id: number;
  name: string;
}

export default function VideosAdminPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [notification, setNotification] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [formData, setFormData] = useState<VideoItem>({
    title: "",
    video_url: "",
    thumbnail_url: "",
    product_id: null,
    product_name: "",
  });

  const checkConnection = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return !!(url && key && !url.includes("placeholder-url"));
  };

  const safeParseJSON = (str: string | null): any[] => {
    if (!str || str === "undefined" || str === "null") return [];
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const showToast = (text: string, type: "success" | "error" | "info") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadProducts = async () => {
    const hasConfig = checkConnection();

    if (!hasConfig) {
      const saved = localStorage.getItem("yuna_admin_products");
      const parsed = safeParseJSON(saved);
      setProducts(parsed.map((item: any) => ({
        id: item.id,
        name: item.name,
      })));
      return;
    }

    try {
      const { data, error } = await supabase.from("products").select("id, name").order("id", { ascending: true });
      if (error) throw error;
      setProducts((data || []).map((item: any) => ({ id: item.id, name: item.name })));
    } catch (err) {
      console.warn("Lỗi tải danh sách sản phẩm cho video:", err);
       const saved = localStorage.getItem("yuna_admin_products");
       const parsed = safeParseJSON(saved);
       setProducts(parsed.map((item: any) => ({ id: item.id, name: item.name })));
    }
  };

  const loadVideos = async () => {
    setLoading(true);
    const hasConfig = checkConnection();

    if (!hasConfig) {
      const saved = localStorage.getItem("yuna_admin_videos");
      setVideos(safeParseJSON(saved));
      setLoading(false);
      return;
    }

    try {
      const tables = ["reviews_videos", "videos"];
      let rows: any[] = [];
      let lastError: any = null;

      for (const table of tables) {
        const { data, error } = await supabase.from(table).select("*").order("id", { ascending: true });
        if (!error && data) {
          rows = data;
          lastError = null;
          break;
        }
        lastError = error;
      }

      if (lastError && rows.length === 0) throw lastError;

      const mapped = (rows || []).map((item) => ({
        id: item.id,
        title: item.title || item.name || "Video review",
        video_url: item.video_url || item.url || item.link || "",
        thumbnail_url: item.thumbnail_url || item.thumbnail || "",
        product_id: item.product_id ?? item.productId ?? null,
        product_name: item.product_name || item.product || "",
      }));

      setVideos(mapped);
      localStorage.setItem("yuna_admin_videos", JSON.stringify(mapped));
    } catch (err) {
      console.warn("Lỗi tải video từ Supabase:", err);
      const saved = localStorage.getItem("yuna_admin_videos");
      setVideos(safeParseJSON(saved));
      showToast("Không thể kết nối Supabase. Đang dùng dữ liệu offline.", "info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadVideos();

    const channel = supabase
      .channel("admin-videos-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "reviews_videos" }, () => loadVideos())
      .on("postgres_changes", { event: "*", schema: "public", table: "videos" }, () => loadVideos())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const openAddModal = () => {
    setModalMode("add");
    setActiveVideo(null);
    setFormData({ title: "", video_url: "", thumbnail_url: "", product_id: null, product_name: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (video: VideoItem) => {
    setModalMode("edit");
    setActiveVideo(video);
    setFormData({
      id: video.id,
      title: video.title,
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url || "",
      product_id: video.product_id ?? null,
      product_name: video.product_name || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.video_url.trim()) {
      showToast("Vui lòng nhập đủ Tiêu đề và Link video.", "error");
      return;
    }

    const selectedProduct = products.find((item) => item.id === formData.product_id);
    const payload = {
      title: formData.title.trim(),
      video_url: formData.video_url.trim(),
      thumbnail_url: (formData.thumbnail_url || "").trim(),
      product_id: formData.product_id ?? null,
      product_name: selectedProduct?.name || formData.product_name || "",
    };

    const hasConfig = checkConnection();

    if (hasConfig) {
      try {
        if (modalMode === "add") {
          const { error } = await supabase.from("reviews_videos").insert([payload]);
          if (error) throw error;
          showToast("Đã thêm video mới thành công.", "success");
        } else if (activeVideo?.id) {
          const { error } = await supabase.from("reviews_videos").update(payload).eq("id", activeVideo.id);
          if (error) throw error;
          showToast("Đã cập nhật video thành công.", "success");
        }
      } catch (err: any) {
        console.warn("Supabase video save failed, fallback to localStorage:", err);
        showToast("Supabase chưa sẵn sàng. Đã lưu video offline.", "info");
      }
    }

    const saved = localStorage.getItem("yuna_admin_videos");
    const existing = safeParseJSON(saved);

    if (modalMode === "add") {
      const newItem = {
        id: Date.now(),
        ...payload,
      };
      const updated = [...existing, newItem];
      setVideos(updated);
      localStorage.setItem("yuna_admin_videos", JSON.stringify(updated));
    } else if (activeVideo?.id) {
      const updated = existing.map((item: VideoItem) => (item.id === activeVideo.id ? { ...item, ...payload } : item));
      setVideos(updated);
      localStorage.setItem("yuna_admin_videos", JSON.stringify(updated));
    }

    await loadVideos();
    setIsModalOpen(false);
  };

  const handleDelete = async (videoId: number) => {
    if (!confirm("Bạn có chắc muốn xóa video này?")) return;

    const hasConfig = checkConnection();

    if (hasConfig) {
      try {
        const { error } = await supabase.from("reviews_videos").delete().eq("id", videoId);
        if (error) throw error;
        showToast("Đã xóa video trên Supabase.", "success");
      } catch (err) {
        console.warn("Delete failed, fallback to localStorage:", err);
        showToast("Đã xóa video offline.", "info");
      }
    }

    const saved = localStorage.getItem("yuna_admin_videos");
    const existing = safeParseJSON(saved);
    const updated = existing.filter((item: VideoItem) => item.id !== videoId);
    setVideos(updated);
    localStorage.setItem("yuna_admin_videos", JSON.stringify(updated));
    await loadVideos();
  };

  const selectedProductName = useMemo(() => {
    return products.find((item) => item.id === formData.product_id)?.name || formData.product_name || "Không liên kết sản phẩm";
  }, [formData.product_id, formData.product_name, products]);

  return (
    <div className="space-y-6">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-lg ${notification.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : notification.type === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-blue-200 bg-blue-50 text-blue-800"}`}>
          {notification.type === "success" ? <Check className="w-4 h-4" /> : notification.type === "error" ? <AlertCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {notification.text}
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">Admin / Video</p>
            <h2 className="text-2xl font-bold text-slate-900">Quản lý Video Review</h2>
            <p className="text-sm text-slate-500 mt-1">Quản lý các video review thực tế của Yuna và liên kết với sản phẩm.</p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-[#6B8E23] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#5a781e] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm Video Mới
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wide text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Tiêu đề video</th>
                <th className="px-4 py-3 text-left">Link video</th>
                <th className="px-4 py-3 text-left">Sản phẩm liên quan</th>
                <th className="px-4 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Đang tải...</div>
                  </td>
                </tr>
              ) : videos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-slate-500">Chưa có video nào. Hãy thêm video đầu tiên.</td>
                </tr>
              ) : (
                videos.map((video) => (
                  <tr key={video.id} className="border-t border-slate-100 hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-4 font-semibold text-slate-900">{video.title}</td>
                    <td className="px-4 py-4 max-w-xs break-all text-slate-600"><a className="text-[#6B8E23] hover:underline" href={video.video_url} target="_blank" rel="noreferrer">{video.video_url}</a></td>
                    <td className="px-4 py-4 text-slate-600">{video.product_name || "—"}</td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEditModal(video)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-[#6B8E23] hover:text-[#6B8E23] transition-colors"><Edit className="w-4 h-4" /> Sửa</button>
                        <button onClick={() => handleDelete(Number(video.id))} className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-red-600 hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4" /> Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{modalMode === "add" ? "Thêm Video Mới" : "Chỉnh sửa Video"}</h3>
                <p className="text-sm text-slate-500">Nhập link video và liên kết sản phẩm nếu có.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 p-5">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Tiêu đề video</label>
                <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#6B8E23] focus:bg-white" placeholder="Ví dụ: HÚT BỤI LAU NHÀ YUNA" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Đường dẫn video</label>
                <input value={formData.video_url} onChange={(e) => setFormData({ ...formData, video_url: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#6B8E23] focus:bg-white" placeholder="https://www.youtube.com/watch?v=..." />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Ảnh đại diện Video (Thumbnail URL)</label>
                <input
                  value={formData.thumbnail_url || ""}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#6B8E23] focus:bg-white"
                  placeholder="https://images.unsplash.com/..."
                />
                <p className="mt-1 text-xs text-slate-500">Dán link ảnh thumbnail để Hiển thị cover đẹp hơn thay cho nền đen ban đầu.</p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Sản phẩm liên quan</label>
                <select
                  value={formData.product_id ?? ""}
                  onChange={(e) => {
                    const selected = products.find((item) => item.id === Number(e.target.value));
                    setFormData({
                      ...formData,
                      product_id: e.target.value ? Number(e.target.value) : null,
                      product_name: selected?.name || "",
                    });
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#6B8E23] focus:bg-white"
                >
                  <option value="">-- Chọn sản phẩm liên kết --</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-slate-500">Bạn đang chọn: {selectedProductName}</p>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Hủy</button>
                <button type="submit" className="rounded-xl bg-[#6B8E23] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5a781e]">{modalMode === "add" ? "Thêm video" : "Lưu thay đổi"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
