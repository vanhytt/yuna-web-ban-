"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, ShoppingCart, Search, X } from "lucide-react";
import CartDrawer from "./CartDrawer";
import { getProductImage, supabase } from "../../lib/supabase";
import { useCart } from "../context/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  brand: string;
  image: string;
  category: string[];
}

const POLICIES = {
  purchase: {
    title: "Chính sách mua hàng",
    content: [
      "Quy trình đặt hàng: Lựa chọn sản phẩm -> Thêm vào giỏ hàng -> Nhập thông tin giao hàng -> Chọn phương thức thanh toán.",
      "Xác nhận đơn hàng: Sau khi đặt hàng thành công, hệ thống sẽ gửi thông báo xác nhận và nhân viên sẽ liên hệ để xác nhận lại thông tin nếu cần.",
      "Kiểm tra hàng (Đồng kiểm): Khách hàng được quyền kiểm tra sản phẩm trước khi thanh toán và nhận hàng từ đơn vị vận chuyển.",
      "Cam kết: Sản phẩm 100% giống hình ảnh và mô tả trên website Swordsman."
    ]
  },
  support: {
    title: "Hỗ trợ khách hàng",
    content: [
      "Thời gian làm việc: Hỗ trợ tư vấn trực tuyến 24/7 (Hotline & Zalo: 0969 985 008).",
      "Tư vấn chọn sản phẩm: Đội ngũ hỗ trợ nhiệt tình tư vấn chọn kích thước, chất liệu da và quà tặng phù hợp theo từng dịp.",
      "Hỗ trợ sự cố đơn hàng: Xử lý nhanh chóng các trường hợp giao nhầm, thiếu hàng hoặc hư hỏng trong quá trình vận chuyển.",
      "Đóng gói quà tặng: Hỗ trợ gói quà sang trọng, viết thiệp chúc mừng miễn phí theo yêu cầu của khách hàng."
    ]
  }
};

export default function Header() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<keyof typeof POLICIES | null>(null);
  const { totalItems, totalPrice } = useCart();

  const checkConnection = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return !!(url && key && !url.includes("placeholder-url"));
  };

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      if (!checkConnection()) {
        const saved = localStorage.getItem("swordsman_admin_products");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (isMounted) {
              const mapped = (Array.isArray(parsed) ? parsed : []).map((item: any) => ({
                id: item.id,
                name: item.name,
                price: Number(item.salePrice ?? item.price ?? 0),
                originalPrice: item.originalPrice ?? item.original_price ?? undefined,
                brand: "Swordsman",
                image: item.image || "",
                category: [item.category || ""].filter(Boolean),
              }));
              setProducts(mapped);
            }
          } catch {
            if (isMounted) setProducts([]);
          }
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: true });

        if (error) throw error;

        if (isMounted) {
          const mapped = (data || []).map((item) => ({
            id: item.id,
            name: item.name,
            price: Number(item.price || 0),
            originalPrice: item.original_price ? Number(item.original_price) : undefined,
            brand: "Swordsman",
            image: item.image || "",
            category: [item.category || ""].filter(Boolean),
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.warn("Lỗi khi tải sản phẩm cho tìm kiếm:", err);
        const saved = localStorage.getItem("swordsman_admin_products");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (isMounted) {
              const mapped = (Array.isArray(parsed) ? parsed : []).map((item: any) => ({
                id: item.id,
                name: item.name,
                price: Number(item.salePrice ?? item.price ?? 0),
                originalPrice: item.originalPrice ?? item.original_price ?? undefined,
                brand: "Swordsman",
                image: item.image || "",
                category: [item.category || ""].filter(Boolean),
              }));
              setProducts(mapped);
            }
          } catch {
            if (isMounted) setProducts([]);
          }
        }
      }
    };

    loadProducts();

    const channel = supabase
      .channel("header-search-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          loadProducts();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const openPolicy = (policyKey: keyof typeof POLICIES) => {
    setSelectedPolicy(policyKey);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPolicy(null);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const handleSearch = (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault?.();
    setShowDropdown(searchQuery.trim().length >= 2);
  };

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query || query.length < 2) return [];

    return products.filter((p) =>
      p.name.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [products, searchQuery]);

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  const currentPolicy = selectedPolicy ? POLICIES[selectedPolicy] : null;

  return (
    <>
     <header className="w-full bg-black shadow-xs font-sans">
         {/* 1. Top Header */}
         <div className="border-b border-gray-800 bg-black py-2 text-xs md:text-sm text-gray-300">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
            {/* Left Contact Info */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <a
                 href="mailto:Adamstore1986@gmail.com"
                 className="flex items-center gap-1.5 text-gray-300 hover:text-amber-400 transition-colors"
               >
                 <Mail className="w-4 h-4 text-gray-400" />
                 <span>Adamstore1986@gmail.com</span>
              </a>
              <a
                 href="tel:0969985008"
                 className="flex items-center gap-1.5 text-gray-300 hover:text-amber-400 transition-colors font-medium"
               >
                 <Phone className="w-4 h-4 text-gray-400" />
                 <span>0969 985 008</span>
              </a>
            </div>

            {/* Right Policies & Socials */}
            <div className="flex items-center gap-4 md:gap-6">
              <div className="hidden sm:flex items-center gap-4">
                 <button
                   onClick={() => openPolicy("purchase")}
                   className="text-gray-300 hover:text-amber-400 transition-colors cursor-pointer text-left"
                 >
                   Chính sách mua hàng
                 </button>
                 <span className="text-gray-600">|</span>
                 <button
                   onClick={() => openPolicy("support")}
                   className="text-gray-300 hover:text-amber-400 transition-colors cursor-pointer text-left"
                 >
                   Hỗ trợ khách hàng
                 </button>
              </div>
               <div className="flex items-center gap-3 border-l border-gray-700 pl-4">
                 <a
                   href="https://www.facebook.com/share/1AKmNJSXfa/?mibextid=wwXIfr"
                   className="text-gray-400 hover:text-amber-400 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                 <a
                   href="https://vt.tiktok.com/ZS9rc4rG6ESCv-mNEHX/"
                   className="text-gray-400 hover:text-amber-400 transition-colors"
                  aria-label="TikTok"
                >
                  <svg
                    className="w-3.5 h-3.5 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.78-.22-.22-.4-.45-.58-.7v5.89c.04 2.23-.74 4.54-2.4 5.97-1.92 1.67-4.73 2.05-7.04 1.25-2.85-1-4.71-3.95-4.47-7.07.19-2.61 2-5.06 4.63-5.69 1.15-.28 2.37-.18 3.48.24v4.16c-.84-.36-1.8-.46-2.67-.14-1.22.42-2.12 1.74-2.02 3.05.12 1.45 1.43 2.62 2.87 2.45 1.52-.07 2.64-1.47 2.58-2.98V.02z" />
                  </svg>
                </a>
                 <a
                   href="https://s.shopee.vn/5ArEX7sMGq"
                   className="text-gray-400 hover:text-amber-400 transition-colors"
                  aria-label="Shopee"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.7 6.4h-3.2C16 3.2 14.2 1 12 1S8 3.2 7.5 6.4H4.3C3.6 6.4 3 7 3 7.7v12.2C3 21.3 4.2 23 5.7 23h12.6c1.5 0 2.7-1.7 2.7-3.1V7.7c0-.7-.6-1.3-1.3-1.3zM12 3c1.1 0 2 1.5 2.2 3.4H9.8C10 4.5 10.9 3 12 3zm0 13c-2.4 0-4.3-1.8-4.3-4.1h1.7c0 1.3 1.2 2.4 2.6 2.4s2.6-1.1 2.6-2.4h1.7c0 2.3-1.9 4.1-4.3 4.1z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Main Header */}
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo3.png"
                alt="Swordsman Logo"
                width={180}
                height={60}
                className="h-10 md:h-12 w-auto object-contain"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="w-full md:max-w-xl relative">
            <form
              onSubmit={handleSearch}
              className="w-full flex items-center relative"
            >
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, danh mục..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onBlur={handleBlur}
                className="w-full pl-4 pr-12 py-2.5 rounded-lg border border-gray-700 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm bg-neutral-800 text-white transition-all placeholder:text-gray-500"
              />
              <button
                type="submit"
                className="absolute right-3 text-gray-400 hover:text-amber-400 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Search Dropdown */}
            {showDropdown && searchQuery.trim().length >= 2 && (
              <div className="absolute left-0 right-0 mt-1 bg-neutral-900 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                {searchResults.length > 0 ? (
                  <div>
                    <div className="divide-y divide-gray-100">
                      {searchResults.slice(0, 5).map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.id}`}
                          className="flex items-center gap-3 p-3 hover:bg-neutral-800 transition-colors"
                        >
                          <div className="relative w-10 h-10 shrink-0 border border-gray-700 rounded-md overflow-hidden bg-neutral-800">
                            <Image
                              src={getProductImage(product.image)}
                              alt={product.name}
                              fill
                              sizes="40px"
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <h4 className="text-sm font-semibold text-white truncate">
                              {product.name}
                            </h4>
                            <span className="text-xs font-bold text-[#D32F2F]">
                              {product.price.toLocaleString("vi-VN")}đ
                            </span>
                            {product.originalPrice && (
                              <span className="text-[10px] text-gray-400 line-through ml-2">
                                {product.originalPrice.toLocaleString("vi-VN")}đ
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                    <button
                      onClick={handleSearch}
                      className="w-full text-center py-2.5 border-t border-gray-700 text-xs font-semibold text-amber-400 hover:bg-neutral-800 transition-colors"
                    >
                      Xem tất cả kết quả cho "{searchQuery}"
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-400">
                    Không tìm thấy sản phẩm nào khớp với "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hotline & Cart */}
          <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-6 sm:gap-8">
            {/* Hotline info */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs text-gray-400">Chăm sóc khách hàng</span>
              <a
                href="tel:09xxxxxxxx"
                className="text-amber-400 font-bold text-lg hover:underline transition-all"
              >
                0969 985 008
              </a>
            </div>

             {/* Cart Icon */}
             <button
               onClick={() => setCartOpen(true)}
               className="flex items-center gap-3 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors border border-gray-700 relative group ml-auto md:ml-0 cursor-pointer"
             >
               <div className="relative">
                 <ShoppingCart className="w-6 h-6 text-white group-hover:text-amber-400 transition-colors" />
                 {totalItems > 0 && (
                   <span className="absolute -top-2.5 -right-2.5 bg-amber-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                     {totalItems}
                   </span>
                 )}
               </div>
               <div className="hidden lg:flex flex-col text-left">
                 <span className="text-[10px] text-gray-400 uppercase font-bold">
                   Giỏ hàng
                 </span>
                 <span className="text-xs font-semibold text-white">
                   {totalPrice > 0 ? totalPrice.toLocaleString("vi-VN") + "đ" : "0đ"}
                 </span>
               </div>
             </button>
          </div>
        </div>

        {/* Cart Drawer */}
        <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      </header>

      {/* Policy Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Modal */}
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto relative z-[10000]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-50 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 pr-8">
                {currentPolicy?.title}
              </h2>

              <div className="space-y-4">
                {currentPolicy?.content.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-[#C59B27] text-white text-sm font-semibold">
                        ✓
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              {/* Close Button (Bottom) */}
              <button
                onClick={closeModal}
                className="mt-8 w-full bg-[#8C6239] hover:bg-[#734d29] text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}