"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, ShoppingCart, Search } from "lucide-react";
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

export default function Header() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
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
        const saved = localStorage.getItem("yuna_admin_products");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (isMounted) {
              const mapped = (Array.isArray(parsed) ? parsed : []).map((item: any) => ({
                id: item.id,
                name: item.name,
                price: Number(item.salePrice ?? item.price ?? 0),
                originalPrice: item.originalPrice ?? item.original_price ?? undefined,
                brand: "Yuna",
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
            brand: "Yuna",
            image: item.image || "",
            category: [item.category || ""].filter(Boolean),
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.warn("Lỗi khi tải sản phẩm cho tìm kiếm:", err);
        const saved = localStorage.getItem("yuna_admin_products");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (isMounted) {
              const mapped = (Array.isArray(parsed) ? parsed : []).map((item: any) => ({
                id: item.id,
                name: item.name,
                price: Number(item.salePrice ?? item.price ?? 0),
                originalPrice: item.originalPrice ?? item.original_price ?? undefined,
                brand: "Yuna",
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

  return (
    <header className="w-full bg-white shadow-xs font-sans">
      {/* 1. Top Header */}
      <div className="border-b border-gray-100 bg-[#FDFBF7] py-2 text-xs md:text-sm text-gray-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          {/* Left Contact Info */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <a
              href="mailto:yunavietnam.info@gmail.com"
              className="flex items-center gap-1.5 hover:text-[#6B8E23] transition-colors"
            >
              <Mail className="w-4 h-4 text-gray-400" />
              <span>yunavietnam.info@gmail.com</span>
            </a>
            <a
              href="tel:0977500651"
              className="flex items-center gap-1.5 hover:text-[#6B8E23] transition-colors font-medium"
            >
              <Phone className="w-4 h-4 text-gray-400" />
              <span>0977 500 651</span>
            </a>
          </div>

          {/* Right Policies & Socials */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden sm:flex items-center gap-4">
              <a href="#" className="hover:text-[#6B8E23] transition-colors">
                Chính sách mua hàng
              </a>
              <span className="text-gray-300">|</span>
              <a href="#" className="hover:text-[#6B8E23] transition-colors">
                Hỗ trợ khách hàng
              </a>
            </div>
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-black transition-colors"
                aria-label="TikTok"
              >
                {/* Custom TikTok SVG since Lucide doesn't have TikTok by default in older versions */}
                <svg
                  className="w-3.5 h-3.5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.78-.22-.22-.4-.45-.58-.7v5.89c.04 2.23-.74 4.54-2.4 5.97-1.92 1.67-4.73 2.05-7.04 1.25-2.85-1-4.71-3.95-4.47-7.07.19-2.61 2-5.06 4.63-5.69 1.15-.28 2.37-.18 3.48.24v4.16c-.84-.36-1.8-.46-2.67-.14-1.22.42-2.12 1.74-2.02 3.05.12 1.45 1.43 2.62 2.87 2.45 1.52-.07 2.64-1.47 2.58-2.98V.02z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-red-600 transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
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
          <a href="/" className="flex items-center">
            <div className="relative h-14 md:h-16 w-44 md:w-56">
              <Image
                src="/images/logo.png"
                alt="Yuna Vietnam Logo"
                fill
                sizes="(max-width: 768px) 176px, 224px"
                className="object-contain object-left"
                priority
              />
            </div>
          </a>
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
              className="w-full pl-4 pr-12 py-2.5 rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#6B8E23] focus:ring-1 focus:ring-[#6B8E23] text-sm bg-gray-50 transition-all placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="absolute right-3 text-gray-400 hover:text-[#6B8E23] transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Search Dropdown */}
          {showDropdown && searchQuery.trim().length >= 2 && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-xl z-50 overflow-hidden">
              {searchResults.length > 0 ? (
                <div>
                  <div className="divide-y divide-gray-100">
                    {searchResults.slice(0, 5).map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="relative w-10 h-10 shrink-0 border border-gray-100 rounded-md overflow-hidden bg-gray-50">
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
                          <h4 className="text-sm font-semibold text-gray-800 truncate">
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
                    className="w-full text-center py-2.5 border-t border-gray-100 text-xs font-semibold text-[#6B8E23] hover:bg-gray-50 transition-colors"
                  >
                    Xem tất cả kết quả cho "{searchQuery}"
                  </button>
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
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
            <span className="text-xs text-gray-500">Chăm sóc khách hàng</span>
            <a
              href="tel:0977500651"
              className="text-[#D32F2F] font-bold text-lg hover:underline transition-all"
            >
              0977 500 651
            </a>
          </div>

           {/* Cart Icon */}
           <button
             onClick={() => setCartOpen(true)}
             className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#FDFBF7] hover:bg-gray-100 transition-colors border border-gray-100 relative group ml-auto md:ml-0 cursor-pointer"
           >
             <div className="relative">
               <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-[#6B8E23] transition-colors" />
               {totalItems > 0 && (
                 <span className="absolute -top-2.5 -right-2.5 bg-[#C59B27] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                   {totalItems}
                 </span>
               )}
             </div>
             <div className="hidden lg:flex flex-col text-left">
               <span className="text-[10px] text-gray-400 uppercase font-bold">
                 Giỏ hàng
               </span>
               <span className="text-xs font-semibold text-gray-700">
                 {totalPrice > 0 ? totalPrice.toLocaleString("vi-VN") + "đ" : "0đ"}
               </span>
             </div>
           </button>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
