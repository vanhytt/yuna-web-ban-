"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Edit, Trash2, X, Check, AlertCircle, Upload, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { supabase, getProductImage, getProductGallery } from "../../../lib/supabase";

interface Product {
  id: number;
  name: string;
  category: string;
  originalPrice: number;
  salePrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  status: "Còn hàng" | "Hết hàng";
  description: string;
}

/* ───────── CATEGORY MAP (slug → display name) ───────── */
const categoryDisplayMap: Record<string, string> = {
  "vi-da-cao-cap": "Ví da cao cấp",
  "that-lung-da": "Thắt lưng da",
  "bo-qua-tang": "Bộ quà tặng (Giftset)",
  "phu-kien-da": "Phụ kiện da"
};

const PRODUCT_IMAGES_BUCKET = "product-images";

const navbarCategoryOptions = [
  { value: "vi-da-cao-cap", label: "Ví da cao cấp" },
  { value: "that-lung-da", label: "Thắt lưng da" },
  { value: "bo-qua-tang", label: "Bộ quà tặng (Giftset)" },
  { value: "phu-kien-da", label: "Phụ kiện da" }
];

function fmt(n: number) {
  return n.toLocaleString("vi-VN") + "₫";
}

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Drag & drop state
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    category: "vi-da-cao-cap",
    originalPrice: 0,
    salePrice: 0,
    image: "",
    status: "Còn hàng",
    description: ""
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

  const categoryOptions = useMemo(
    () =>
      navbarCategoryOptions.map((option) => ({
        value: option.value,
        label: option.label,
      })),
    []
  );

  /* ── Helper: load from localStorage ── */
  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem("ploybay_admin_products");
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch {
        setProducts([]);
      }
    } else {
      setProducts([]);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    const hasConfig = checkConnection();
    setIsSupabaseConfigured(hasConfig);

    if (!hasConfig) {
      loadFromLocalStorage();
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const mapped: Product[] = data.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category || "vi-da-cao-cap",
          originalPrice: Number(item.original_price || item.price),
          salePrice: Number(item.price),
          image: item.image || "",
          status: item.status === "Hết hàng" ? "Hết hàng" : "Còn hàng",
          description: item.description || "",
          rating: Number(item.rating || 5.0),
          reviewsCount: Number(item.reviews_count || 0)
        }));
        setProducts(mapped);
      } else {
        // Supabase trả 0 sản phẩm → fallback localStorage
        loadFromLocalStorage();
      }
    } catch (err) {
      console.warn("Lỗi khi kết nối Supabase:", err);
      showToast("Không thể kết nối Supabase. Đang hiển thị dữ liệu offline.", "info");
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setModalMode("add");
    setFormData({
      name: "",
      category: "vi-da-cao-cap",
      originalPrice: 0,
      salePrice: 0,
      image: "",
      status: "Còn hàng",
      description: ""
    });
    setUploadedImages([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setModalMode("edit");
    setFormData(product);
    setUploadedImages(getProductGallery(product.image));
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

  const uploadFiles = async (files: FileList) => {
    setIsUploading(true);
    const newUploadedUrls: string[] = [];
    const isConfigured = checkConnection();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        showToast(`File ${file.name} không phải là ảnh hợp lệ!`, "error");
        continue;
      }

      if (isConfigured) {
        try {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

          const { data, error } = await supabase.storage
            .from(PRODUCT_IMAGES_BUCKET)
            .upload(fileName, file, {
              cacheControl: "3600",
              upsert: false
            });

          if (error) throw error;

          const { data: { publicUrl } } = supabase.storage
            .from(PRODUCT_IMAGES_BUCKET)
            .getPublicUrl(fileName);

          newUploadedUrls.push(publicUrl);
        } catch (err: any) {
          console.warn("Storage upload warning (falling back to base64):", err);
          showToast(`Lỗi upload: ${err.message}. Đang dùng chế độ offline/base64 cho ảnh này.`, "info");
          const base64Url = await fileToBase64(file);
          newUploadedUrls.push(base64Url);
        }
      } else {
        const base64Url = await fileToBase64(file);
        newUploadedUrls.push(base64Url);
      }
    }

    if (newUploadedUrls.length > 0) {
      const updatedImages = [...uploadedImages, ...newUploadedUrls];
      setUploadedImages(updatedImages);
      setFormData((prev) => ({
        ...prev,
        image: JSON.stringify(updatedImages)
      }));
      showToast(`Đã tải lên thành công ${newUploadedUrls.length} ảnh!`, "success");
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

    // 1. Check if local files are being dropped
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFiles(e.dataTransfer.files);
      return;
    }

    // 2. Check if a web image link is being dropped (e.g. from another browser tab)
    const uriList = e.dataTransfer.getData("text/uri-list");
    const plainText = e.dataTransfer.getData("text/plain");
    const imageUrl = uriList || plainText;

    if (imageUrl && (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("data:image/"))) {
      const cleanUrl = imageUrl.trim().split("\n")[0];
      const updatedImages = [...uploadedImages, cleanUrl];
      setUploadedImages(updatedImages);
      setFormData((prev) => ({
        ...prev,
        image: JSON.stringify(updatedImages)
      }));
      showToast("Đã thêm liên kết ảnh kéo thả thành công!", "success");
    } else {
      showToast("Không tìm thấy tệp tin hoặc liên kết ảnh hợp lệ!", "error");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFiles(e.target.files);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updated = uploadedImages.filter((_, idx) => idx !== indexToRemove);
    setUploadedImages(updated);
    setFormData((prev) => ({
      ...prev,
      image: JSON.stringify(updated)
    }));
  };

  const moveImage = (index: number, direction: "left" | "right") => {
    if (direction === "left" && index === 0) return;
    if (direction === "right" && index === uploadedImages.length - 1) return;

    const targetIndex = direction === "left" ? index - 1 : index + 1;
    const updated = [...uploadedImages];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setUploadedImages(updated);
    setFormData((prev) => ({
      ...prev,
      image: JSON.stringify(updated)
    }));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) throw error;
        showToast("Đã xóa sản phẩm thành công trên Supabase!", "success");
      } catch (err: any) {
        console.warn("Supabase delete failed, fallback to localStorage:", err);
        showToast("Supabase chưa sẵn sàng. Đã xóa sản phẩm offline!", "info");
      }
    } else {
      showToast("Đã xóa sản phẩm thành công (Offline)!", "success");
    }

    // Luôn cập nhật localStorage dù Supabase thành công hay thất bại
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem("ploybay_admin_products", JSON.stringify(updated));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.salePrice) {
      showToast("Vui lòng điền đầy đủ Tên và Giá bán!", "error");
      return;
    }

    const payload = {
      name: formData.name,
      category: formData.category || "vi-da-cao-cap",
      price: Number(formData.salePrice),
      original_price: Number(formData.originalPrice || formData.salePrice),
      image: formData.image || "",
      status: formData.status,
      description: formData.description || "",
      rating: formData.rating || 5.0,
      reviews_count: formData.reviewsCount || 0
    };

    if (modalMode === "add") {
      const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      const newProduct: Product = {
        id: newId,
        name: formData.name,
        category: formData.category || "vi-da-cao-cap",
        originalPrice: Number(formData.originalPrice || formData.salePrice),
        salePrice: Number(formData.salePrice),
        rating: formData.rating || 5.0,
        reviewsCount: formData.reviewsCount || 0,
        image: payload.image,
        status: formData.status as any,
        description: payload.description
      };

      if (isSupabaseConfigured) {
        try {
          const { error } = await supabase.from("products").insert([payload]);
          if (error) throw error;
          showToast("Đã thêm sản phẩm thành công lên Supabase!", "success");
          await fetchProducts();
        } catch (err: any) {
          console.warn("Supabase insert failed, fallback to localStorage:", err);
          // Fallback: lưu vào localStorage khi Supabase lỗi
          const updated = [...products, newProduct];
          setProducts(updated);
          localStorage.setItem("ploybay_admin_products", JSON.stringify(updated));
          showToast("Supabase chưa sẵn sàng. Đã lưu sản phẩm offline!", "info");
        }
      } else {
        const updated = [...products, newProduct];
        setProducts(updated);
        localStorage.setItem("ploybay_admin_products", JSON.stringify(updated));
        showToast("Đã thêm sản phẩm thành công (Offline)!", "success");
      }
    } else {
      // Edit Mode
      if (isSupabaseConfigured) {
        try {
          const { error } = await supabase
            .from("products")
            .update(payload)
            .eq("id", formData.id);
          if (error) throw error;
          showToast("Đã cập nhật sản phẩm thành công trên Supabase!", "success");
          await fetchProducts();
        } catch (err: any) {
          console.warn("Supabase update failed, fallback to localStorage:", err);
          // Fallback: cập nhật localStorage khi Supabase lỗi
          const updated = products.map((p) => (p.id === formData.id ? (formData as Product) : p));
          setProducts(updated);
          localStorage.setItem("ploybay_admin_products", JSON.stringify(updated));
          showToast("Supabase chưa sẵn sàng. Đã cập nhật sản phẩm offline!", "info");
        }
      } else {
        const updated = products.map((p) => (p.id === formData.id ? (formData as Product) : p));
        setProducts(updated);
        localStorage.setItem("ploybay_admin_products", JSON.stringify(updated));
        showToast("Đã cập nhật sản phẩm thành công (Offline)!", "success");
      }
    }

    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (categoryDisplayMap[p.category] || p.category).toLowerCase().includes(search.toLowerCase())
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
              ? "Hệ thống đang đồng bộ dữ liệu sản phẩm trực tiếp từ Supabase của bạn."
              : "Bạn chưa điền thông tin Supabase vào .env.local. Dữ liệu đang được lưu tạm trên LocalStorage trình duyệt để Demo."
            }
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Quản lý sản phẩm</h2>
          <p className="text-xs text-slate-500 mt-0.5">Thêm, sửa, xóa sản phẩm</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#8B5A2B] hover:bg-[#704820] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Thêm sản phẩm
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
            placeholder="Tìm kiếm sản phẩm, danh mục..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B5A2B] focus:ring-1 focus:ring-[#8B5A2B]"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium self-end md:self-auto">
          {loading ? "Đang tải dữ liệu..." : `Hiển thị ${filteredProducts.length} trên ${products.length} sản phẩm`}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Sản phẩm</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Giá bán</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Đang tải danh sách sản phẩm...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <Search className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-medium">Chưa có sản phẩm nào</p>
                      <p className="text-xs">Nhấn &quot;Thêm sản phẩm&quot; để bắt đầu thêm sản phẩm mới</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getProductImage(product.image)}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0 bg-slate-50"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: #SP-{String(product.id).padStart(4, "0")}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {categoryDisplayMap[product.category] || product.category}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-[#D32F2F]">{fmt(product.salePrice)}</p>
                        <p className="text-xs text-slate-400 line-through mt-0.5">{fmt(product.originalPrice)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        product.status === "Còn hàng"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-red-50 text-red-600 border border-red-100"
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
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
          <div className="bg-white rounded-2xl w-full max-w-lg border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">
                {modalMode === "add" ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
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
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Ví da nam Handmade Epsom..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B5A2B] focus:ring-1 focus:ring-[#8B5A2B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Giá bán (₫) *</label>
                  <input
                    type="number"
                    required
                    value={formData.salePrice || 0}
                    onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B5A2B] focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Giá gốc (₫)</label>
                  <input
                    type="number"
                    value={formData.originalPrice || 0}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B5A2B] focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Danh mục</label>
                  <select
                    value={formData.category || "vi-da-cao-cap"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B5A2B] focus:ring-1 focus:ring-[#8B5A2B] bg-white"
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Trạng thái</label>
                  <select
                    value={formData.status || "Còn hàng"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B5A2B] focus:ring-1 focus:ring-[#8B5A2B] bg-white"
                  >
                    <option value="Còn hàng">Còn hàng</option>
                    <option value="Hết hàng">Hết hàng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
                  Hình ảnh sản phẩm ({uploadedImages.length} ảnh)
                </label>

                {/* Image Previews & Actions Grid */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 mt-2">
                    {uploadedImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgUrl}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute top-1.5 left-1.5 bg-[#8B5A2B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                            Ảnh chính
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
                            title="Xóa ảnh"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <div className="mt-auto flex justify-center gap-1.5 w-full">
                            <button
                              type="button"
                              onClick={() => moveImage(idx, "left")}
                              disabled={idx === 0}
                              className="p-1 bg-white/20 hover:bg-white/40 disabled:opacity-30 disabled:hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
                              title="Di chuyển qua trái"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveImage(idx, "right")}
                              disabled={idx === uploadedImages.length - 1}
                              className="p-1 bg-white/20 hover:bg-white/40 disabled:opacity-30 disabled:hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
                              title="Di chuyển qua phải"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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
                      ? "border-[#8B5A2B] bg-[#8B5A2B]/5"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />

                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-[#8B5A2B] animate-spin" />
                      <p className="text-sm font-semibold text-slate-600">Đang tải lên ảnh...</p>
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
                        value={formData.image || ""}
                        onChange={(e) => {
                          setFormData({ ...formData, image: e.target.value });
                          try {
                            const parsed = JSON.parse(e.target.value);
                            if (Array.isArray(parsed)) {
                              setUploadedImages(parsed);
                            } else {
                              setUploadedImages([e.target.value]);
                            }
                          } catch {
                            setUploadedImages([e.target.value]);
                          }
                        }}
                        placeholder='["https://...", "https://..."] hoặc URL đơn lẻ'
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B5A2B] focus:ring-1 focus:ring-[#8B5A2B]"
                      />
                    </div>
                  </details>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Mô tả sản phẩm</label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nhập thông số hoặc mô tả ngắn..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B5A2B] focus:ring-1 focus:ring-[#8B5A2B]"
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
                  className="px-4 py-2 bg-[#8B5A2B] hover:bg-[#704820] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}