"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, FileText, X, Check, AlertCircle } from "lucide-react";
import { supabase } from "../../../lib/supabase";

interface Post {
  id: number;
  title: string;
  category: string;
  author: string;
  date: string;
  status: "Công khai" | "Nháp";
  thumbnail: string;
  content: string;
}

const initialPosts: Post[] = [
  {
    id: 1,
    title: "5 LÝ DO CHẢO INOX ĐƯỢC ƯA CHUỘNG?",
    category: "Mẹo nhà bếp",
    author: "Yuna Editor",
    date: "08/06/2026",
    status: "Công khai",
    thumbnail: "https://images.unsplash.com/photo-1584990347449-a2d4c2b68783?w=400&q=80",
    content: "Chảo inox 3 đáy hoặc đa lớp được ưa chuộng nhờ khả năng truyền nhiệt tốt, bền bỉ và an toàn vệ sinh thực phẩm."
  },
  {
    id: 2,
    title: "MẸO GIỮ ĐỒ GIA DỤNG LUÔN SÁNG BÓNG",
    category: "Chăm sóc gia đình",
    author: "Yuna Editor",
    date: "08/06/2026",
    status: "Công khai",
    thumbnail: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
    content: "Đồ gia dụng inox sẽ luôn bền đẹp như mới nếu bạn thường xuyên vệ sinh bằng giấm, chanh hoặc baking soda."
  },
  {
    id: 3,
    title: "90% GIA ĐÌNH VẪN ĐANG DÙNG CHẢO CHỐNG DÍNH BỊ TRẦY MÀ KHÔNG BIẾT ĐIỀU NÀY",
    category: "Cảnh báo sức khỏe",
    author: "Admin Yuna",
    date: "07/06/2026",
    status: "Công khai",
    thumbnail: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80",
    content: "Chảo chống dính bị bong tróc lớp phủ Teflon khi đun nấu ở nhiệt độ cao có thể giải phóng chất độc hại vào thức ăn."
  }
];

export default function PostsAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<Partial<Post>>({
    title: "",
    category: "Mẹo nhà bếp",
    author: "Yuna Editor",
    status: "Công khai",
    thumbnail: "",
    content: ""
  });

  const checkConnection = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return !!(url && key && !url.includes("placeholder-url"));
  };

  const showToast = (text: string, type: "success" | "error" | "info") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchPosts = async () => {
    setLoading(true);
    const hasConfig = checkConnection();
    setIsSupabaseConfigured(hasConfig);

    if (!hasConfig) {
      // Load from LocalStorage if offline, or fallback to initialPosts
      const saved = localStorage.getItem("yuna_admin_posts");
      if (saved) {
        try {
          setPosts(JSON.parse(saved));
        } catch {
          setPosts(initialPosts);
        }
      } else {
        setPosts(initialPosts);
      }
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const mapped: Post[] = data.map((item) => {
          const dateObj = new Date(item.created_at);
          const formattedDate = `${String(dateObj.getDate()).padStart(2, "0")}/${String(
            dateObj.getMonth() + 1
          ).padStart(2, "0")}/${dateObj.getFullYear()}`;

          return {
            id: item.id,
            title: item.title,
            category: item.category || "Chưa phân loại",
            author: item.author || "Admin Yuna",
            date: formattedDate,
            status: item.status === "Nháp" ? "Nháp" : "Công khai",
            thumbnail: item.thumbnail || "https://images.unsplash.com/photo-1584990347449-a2d4c2b68783?w=400&q=80",
            content: item.content || ""
          };
        });
        setPosts(mapped);
      } else {
        setPosts(initialPosts);
      }
    } catch (err) {
      console.warn("Lỗi khi kết nối Supabase:", err);
      showToast("Không thể kết nối Supabase. Đang hiển thị bài viết offline.", "info");
      const saved = localStorage.getItem("yuna_admin_posts");
      setPosts(saved ? JSON.parse(saved) : initialPosts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpenAdd = () => {
    setModalMode("add");
    setFormData({
      title: "",
      category: "Mẹo nhà bếp",
      author: "Yuna Editor",
      status: "Công khai",
      thumbnail: "https://images.unsplash.com/photo-1584990347449-a2d4c2b68783?w=400&q=80",
      content: ""
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: Post) => {
    setModalMode("edit");
    setFormData(post);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from("posts").delete().eq("id", id);
        if (error) throw error;
        showToast("Đã xóa bài viết thành công trên Supabase!", "success");
      } catch (err: any) {
        showToast(`Lỗi xóa bài viết: ${err.message}`, "error");
        return;
      }
    } else {
      showToast("Đã xóa bài viết thành công (Offline)!", "success");
    }

    const updated = posts.filter((p) => p.id !== id);
    setPosts(updated);
    localStorage.setItem("yuna_admin_posts", JSON.stringify(updated));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      showToast("Vui lòng điền tiêu đề và nội dung bài viết!", "error");
      return;
    }

    const payload = {
      title: formData.title,
      content: formData.content,
      category: formData.category || "Mẹo nhà bếp",
      author: formData.author || "Yuna Editor",
      status: formData.status,
      thumbnail: formData.thumbnail || "https://images.unsplash.com/photo-1584990347449-a2d4c2b68783?w=400&q=80"
    };

    if (modalMode === "add") {
      const newId = posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1;
      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
        today.getMonth() + 1
      ).padStart(2, "0")}/${today.getFullYear()}`;

      const newPost: Post = {
        id: newId,
        title: formData.title,
        category: formData.category || "Mẹo nhà bếp",
        author: formData.author || "Yuna Editor",
        date: formattedDate,
        status: formData.status as any,
        thumbnail: payload.thumbnail,
        content: formData.content
      };

      if (isSupabaseConfigured) {
        try {
          const { error } = await supabase.from("posts").insert([payload]);
          if (error) throw error;
          showToast("Đã thêm bài viết thành công lên Supabase!", "success");
        } catch (err: any) {
          showToast(`Lỗi thêm bài viết: ${err.message}`, "error");
          return;
        }
      } else {
        showToast("Đã thêm bài viết thành công (Offline)!", "success");
      }

      const updated = [...posts, newPost];
      setPosts(updated);
      localStorage.setItem("yuna_admin_posts", JSON.stringify(updated));
    } else {
      // Edit Mode
      if (isSupabaseConfigured) {
        try {
          const { error } = await supabase
            .from("posts")
            .update(payload)
            .eq("id", formData.id);
          if (error) throw error;
          showToast("Đã cập nhật bài viết thành công trên Supabase!", "success");
        } catch (err: any) {
          showToast(`Lỗi cập nhật bài viết: ${err.message}`, "error");
          return;
        }
      } else {
        showToast("Đã cập nhật bài viết thành công (Offline)!", "success");
      }

      const updated = posts.map((p) => (p.id === formData.id ? (formData as Post) : p));
      setPosts(updated);
      localStorage.setItem("yuna_admin_posts", JSON.stringify(updated));
    }

    setIsModalOpen(false);
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm transition-all duration-300 ${
          notification.type === "success" 
            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
            : notification.type === "error"
            ? "bg-red-50 text-red-800 border-red-200"
            : "bg-blue-50 text-blue-800 border-blue-200"
        }`}>
          {notification.type === "success" && <Check className="w-4 h-4 text-emerald-600" />}
          {notification.type === "error" && <AlertCircle className="w-4 h-4 text-red-600" />}
          {notification.type === "info" && <AlertCircle className="w-4 h-4 text-blue-600" />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Supabase Status Banner */}
      <div className={`p-4 rounded-2xl border text-sm flex items-start gap-3 ${
        isSupabaseConfigured 
          ? "bg-emerald-50/50 text-emerald-800 border-emerald-100"
          : "bg-amber-50/50 text-amber-800 border-amber-100"
      }`}>
        <AlertCircle className={`w-5 h-5 shrink-0 ${isSupabaseConfigured ? "text-emerald-600" : "text-amber-600"}`} />
        <div>
          <span className="font-semibold">{isSupabaseConfigured ? "Đã kết nối Supabase" : "Chế độ Offline/Demo"}</span>
          <p className="text-xs text-slate-500 mt-1">
            {isSupabaseConfigured 
              ? "Hệ thống đang đồng bộ dữ liệu bài viết trực tiếp từ Supabase của bạn."
              : "Bạn chưa điền thông tin Supabase vào .env.local. Dữ liệu đang được lưu tạm trên LocalStorage trình duyệt để Demo."
            }
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Quản lý bài viết</h2>
          <p className="text-xs text-slate-500 mt-0.5">Viết, sửa, xóa các bài viết tin tức và cẩm nang gia đình</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#6B8E23] hover:bg-[#5a781e] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Thêm bài viết
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm tiêu đề, danh mục..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#6B8E23] focus:ring-1 focus:ring-[#6B8E23]"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium self-end md:self-auto">
          {loading ? "Đang tải dữ liệu..." : `Hiển thị ${filteredPosts.length} trên ${posts.length} bài viết`}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Bài viết</th>
                <th className="px-6 py-4">Chuyên mục</th>
                <th className="px-6 py-4">Tác giả</th>
                <th className="px-6 py-4">Ngày đăng</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Đang tải danh sách bài viết...
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Không tìm thấy bài viết nào.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0 bg-slate-50"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 line-clamp-1">{post.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: #BV-{String(post.id).padStart(4, "0")}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{post.category}</td>
                    <td className="px-6 py-4 text-slate-600">{post.author}</td>
                    <td className="px-6 py-4 text-slate-500">{post.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        post.status === "Công khai"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(post)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">
                {modalMode === "add" ? "Thêm bài viết mới" : "Chỉnh sửa bài viết"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Tiêu đề bài viết *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: 5 lý do chảo inox được ưa chuộng..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#6B8E23] focus:ring-1 focus:ring-[#6B8E23]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Chuyên mục</label>
                  <select
                    value={formData.category || "Mẹo nhà bếp"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#6B8E23] focus:ring-1 focus:ring-[#6B8E23] bg-white"
                  >
                    <option value="Mẹo nhà bếp">Mẹo nhà bếp</option>
                    <option value="Chăm sóc gia đình">Chăm sóc gia đình</option>
                    <option value="Cảnh báo sức khỏe">Cảnh báo sức khỏe</option>
                    <option value="Tin tức Yuna">Tin tức Yuna</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Tác giả</label>
                  <input
                    type="text"
                    value={formData.author || "Yuna Editor"}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#6B8E23] focus:ring-1 focus:ring-[#6B8E23]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Trạng thái</label>
                  <select
                    value={formData.status || "Công khai"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#6B8E23] focus:ring-1 focus:ring-[#6B8E23] bg-white"
                  >
                    <option value="Công khai">Công khai</option>
                    <option value="Nháp">Nháp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Đường dẫn ảnh đại diện</label>
                  <input
                    type="text"
                    value={formData.thumbnail || ""}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#6B8E23] focus:ring-1 focus:ring-[#6B8E23]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Nội dung bài viết *</label>
                <textarea
                  required
                  value={formData.content || ""}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Nhập nội dung bài viết chi tiết ở đây..."
                  rows={8}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#6B8E23] focus:ring-1 focus:ring-[#6B8E23]"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6B8E23] hover:bg-[#5a781e] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Lưu bài viết
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}