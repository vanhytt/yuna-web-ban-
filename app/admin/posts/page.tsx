  "use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, FileText, X, Check, AlertCircle, Upload, Loader2 } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { compressImage } from "../../../lib/imageCompression";

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
    title: "CÁCH CHĂM SÓC VÀ BẢO QUẢN VÍ DA THẬT LUÔN NHƯ MỚI",
    category: "Kiến thức đồ da",
    author: "Swordsman Editor",
    date: "08/06/2026",
    status: "Công khai",
    thumbnail: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80",
    content: "Ví da thật cần được bảo quản ở nơi khô ráo, tránh ánh nắng trực tiếp và làm sạch định kỳ bằng dung dịch chuyên dụng để giữ được độ mềm mại."
  },
  {
    id: 2,
    title: "BÍ QUYẾT CHỌN THẮT LƯNG DA NAM PHÙ HỢP VỚI TRANG PHỤC",
    category: "Phong cách quý ông",
    author: "Swordsman Editor",
    date: "08/06/2026",
    status: "Công khai",
    thumbnail: "https://images.unsplash.com/photo-1624222247344-550fb8ecf7db?w=400&q=80",
    content: "Thắt lưng da nên có màu sắc và chất liệu đồng điệu với đôi giày bạn đang đi để tạo nên một tổng thể lịch lãm và chỉn chu nhất."
  },
  {
    id: 3,
    title: "GỢI Ý SET QUÀ TẶNG DOANH NHÂN SANG TRỌNG VÀ Ý NGHĨA",
    category: "Tin tức quà tặng",
    author: "Admin Swordsman",
    date: "07/06/2026",
    status: "Công khai",
    thumbnail: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80",
    content: "Set quà tặng ví da phối cùng thắt lưng cao cấp từ Swordsman là lựa chọn hàng đầu để tri ân đối tác, khách hàng và cấp trên."
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
    category: "Kiến thức đồ da",
    author: "Swordsman Editor",
    status: "Công khai",
    thumbnail: "",
    content: ""
  });

  // Drag & drop state
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

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
      const saved = localStorage.getItem("swordsman_admin_posts");
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
            author: item.author || "Admin Swordsman",
            date: formattedDate,
            status: item.status === "Nháp" ? "Nháp" : "Công khai",
            thumbnail: item.thumbnail || "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80",
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
      const saved = localStorage.getItem("swordsman_admin_posts");
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
      category: "Kiến thức đồ da",
      author: "Swordsman Editor",
      status: "Công khai",
      thumbnail: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80",
      content: ""
    });
    setUploadedImage("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: Post) => {
    setModalMode("edit");
    setFormData(post);
    setUploadedImage(post.thumbnail || "");
    setIsModalOpen(true);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    const isConfigured = checkConnection();

    if (!file.type.startsWith("image/")) {
      showToast(`File ${file.name} không phải là ảnh hợp lệ!`, "error");
      setIsUploading(false);
      return;
    }

    // Tự động nén dung lượng ảnh và đổi định dạng sang webp
    let compressedFile = file;
    try {
      compressedFile = await compressImage(file);
    } catch (compressErr) {
      console.error("Lỗi khi nén ảnh:", compressErr);
    }

    if (isConfigured) {
      try {
        const fileExt = compressedFile.name.split(".").pop();
        const fileName = `posts/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(fileName, compressedFile, {
            cacheControl: "3600",
            upsert: false
          });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        setUploadedImage(publicUrl);
        setFormData((prev) => ({
          ...prev,
          thumbnail: publicUrl
        }));
        showToast("Đã tối ưu & tải lên ảnh thành công!", "success");
      } catch (err: any) {
        console.warn("Storage upload warning (falling back to base64):", err);
        showToast(`Lỗi upload: ${err.message}. Đang dùng chế độ offline/base64.`, "info");
        const base64Url = await fileToBase64(compressedFile);
        setUploadedImage(base64Url);
        setFormData((prev) => ({
          ...prev,
          thumbnail: base64Url
        }));
      }
    } else {
      const base64Url = await fileToBase64(compressedFile);
      setUploadedImage(base64Url);
      setFormData((prev) => ({
        ...prev,
        thumbnail: base64Url
      }));
      showToast("Đã tối ưu & tải lên ảnh thành công (Base64)!", "success");
    }
    setIsUploading(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFile(e.dataTransfer.files[0]);
      return;
    }

    const uriList = e.dataTransfer.getData("text/uri-list");
    const plainText = e.dataTransfer.getData("text/plain");
    const imageUrl = uriList || plainText;

    if (imageUrl && (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("data:image/"))) {
      const cleanUrl = imageUrl.trim().split("\n")[0];
      setUploadedImage(cleanUrl);
      setFormData((prev) => ({
        ...prev,
        thumbnail: cleanUrl
      }));
      showToast("Đã thêm liên kết ảnh kéo thả thành công!", "success");
    } else {
      showToast("Không tìm thấy tệp tin hoặc liên kết ảnh hợp lệ!", "error");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setUploadedImage("");
    setFormData((prev) => ({
      ...prev,
      thumbnail: ""
    }));
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
    localStorage.setItem("swordsman_admin_posts", JSON.stringify(updated));
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
      category: formData.category || "Kiến thức đồ da",
      author: formData.author || "Swordsman Editor",
      status: formData.status,
      thumbnail: formData.thumbnail || "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80"
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
        category: formData.category || "Kiến thức đồ da",
        author: formData.author || "Swordsman Editor",
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
      localStorage.setItem("swordsman_admin_posts", JSON.stringify(updated));
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
      localStorage.setItem("swordsman_admin_posts", JSON.stringify(updated));
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
          <p className="text-xs text-slate-500 mt-0.5">Viết, sửa, xóa các bài viết tin tức và cẩm nang quà tặng, phong cách quý ông</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#C59B27] hover:bg-[#a17b1d] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
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
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]"
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
                  placeholder="Ví dụ: Cách phân biệt ví da thật và giả..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Chuyên mục</label>
                  <select
                    value={formData.category || "Kiến thức đồ da"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] bg-white"
                  >
                    <option value="Phong cách quý ông">Phong cách quý ông</option>
                    <option value="Kiến thức đồ da">Kiến thức đồ da</option>
                    <option value="Tin tức quà tặng">Tin tức quà tặng</option>
                    <option value="Tin tức Swordsman">Tin tức Swordsman</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Tác giả</label>
                  <input
                    type="text"
                    value={formData.author || "Swordsman Editor"}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Trạng thái</label>
                <select
                  value={formData.status || "Công khai"}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] bg-white"
                >
                  <option value="Công khai">Công khai</option>
                  <option value="Nháp">Nháp</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
                  Ảnh đại diện bài viết
                </label>

                {/* Image Preview */}
                {uploadedImage && (
                  <div className="relative group aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50 mb-4 mt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={uploadedImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
                        title="Xóa ảnh"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <p className="text-white text-sm font-medium">Xóa ảnh</p>
                    </div>
                  </div>
                )}

                {/* Drag and drop Area */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-6 transition-colors flex flex-col items-center justify-center text-center cursor-pointer ${
                    dragActive
                      ? "border-[#C59B27] bg-[#C59B27]/5"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />

                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-[#C59B27] animate-spin" />
                      <p className="text-sm font-semibold text-slate-600">Đang tối ưu & tải ảnh lên...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-semibold text-slate-600">
                        Kéo thả ảnh hoặc click để chọn file
                      </p>
                      <p className="text-xs text-slate-400">
                        Hỗ trợ PNG, JPG, WEBP. Kéo thả từ web khác cũng được!
                      </p>
                    </div>
                  )}
                </div>

                {/* Manual URL Input fallback */}
                <div className="mt-3">
                  <details className="text-xs text-slate-400 cursor-pointer">
                    <summary className="hover:text-slate-600 font-medium">Nhập URL thủ công (Nâng cao)</summary>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={formData.thumbnail || ""}
                        onChange={(e) => {
                          setFormData({ ...formData, thumbnail: e.target.value });
                          setUploadedImage(e.target.value);
                        }}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]"
                      />
                    </div>
                  </details>
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
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]"
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
                  className="px-4 py-2 bg-[#C59B27] hover:bg-[#a17b1d] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
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