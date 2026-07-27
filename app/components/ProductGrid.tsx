"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { supabase, getProductImage, getCategoryLabel } from "../../lib/supabase";
import { useCart } from "../context/CartContext";

interface Product {
  id: number;
  name: string;
  category: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  rating: number;
  reviewsCount: number;
  image: string;
  tag?: string;
}

interface StoredProduct {
  id?: number;
  name?: string;
  category?: string;
  originalPrice?: number | string;
  original_price?: number | string;
  salePrice?: number | string;
  price?: number | string;
  discount?: number;
  rating?: number;
  reviewsCount?: number;
  reviews_count?: number;
  image?: string;
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [showNotification, setShowNotification] = useState<{ id: number; show: boolean } | null>(null);

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

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setLoading(true);

      if (!checkConnection()) {
        const saved = localStorage.getItem("ploybay_admin_products");
        const parsed = safeParseJSON(saved);
        if (isMounted) setProducts(parsed);
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped: Product[] = data.map((item) => {
            const originalPrice = Number(item.original_price || item.price);
            const salePrice = Number(item.price);
            const discount = originalPrice > salePrice ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;

            return {
              id: item.id,
              name: item.name,
              category: getCategoryLabel(item.category) || "Chưa phân loại",
              originalPrice,
              salePrice,
              discount,
              rating: Number(item.rating || 5.0),
              reviewsCount: Number(item.reviews_count || 0),
              image: item.image || "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&w=400&q=80",
              tag: originalPrice > salePrice ? "Khuyến Mãi" : undefined
            };
          });

          if (isMounted) {
            setProducts(mapped);
          }
        } else {
          const saved = localStorage.getItem("ploybay_admin_products");
          const parsed = safeParseJSON(saved);
          if (isMounted) setProducts(parsed);
        }
      } catch (err) {
        console.warn("Lỗi khi tải sản phẩm từ Supabase:", err);
        const saved = localStorage.getItem("ploybay_admin_products");
        const parsed = safeParseJSON(saved);
        if (isMounted) setProducts(parsed);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProducts();

    const channel = supabase
      .channel("home-products-realtime")
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    
    addToCart({
      id: String(product.id),
      title: product.name,
      price: product.salePrice,
      thumbnail_url: getProductImage(product.image),
    });

    // Hiển thị notification
    setShowNotification({ id: product.id, show: true });
    setTimeout(() => {
      setShowNotification(null);
    }, 2000);
  };

  return (
    <section className="w-full py-8 font-sans">
      {/* Title Section */}
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight relative pb-3 text-center">
          SẢN PHẨM NỔI BẬT
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#C59B27] rounded-full" />
        </h2>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Sản phẩm ví da, thắt lưng da cao cấp PLOYBAY - Sự lựa chọn hoàn hảo của quý ông
        </p>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-gray-100 bg-white p-3 md:p-4"
            >
              <div className="aspect-square rounded-xl bg-gray-200" />
              <div className="mt-3 space-y-2">
                <div className="h-3 w-16 rounded bg-gray-200" />
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-2/3 rounded bg-gray-200" />
                <div className="h-5 w-1/2 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
          >
            {/* Tag Badge */}
            {product.tag && (
              <span className="absolute top-3 left-3 z-10 bg-[#C59B27] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                {product.tag}
              </span>
            )}

            {/* Discount Badge */}
            {product.discount > 0 && (
              <span className="absolute top-3 right-3 z-10 bg-[#C59B27] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                -{product.discount}%
              </span>
            )}

            {/* Product Image Area */}
            <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
              <Link href={"/product/" + product.id} className="w-full h-full block relative overflow-hidden">
                <Image
                  src={getProductImage(product.image)}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </Link>
              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                <Link
                  href={"/product/" + product.id}
                  className="w-10 h-10 rounded-full bg-white text-gray-700 hover:text-[#C59B27] flex items-center justify-center shadow-md transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 active:scale-95"
                  aria-label="Quick View"
                >
                  <Eye className="w-5 h-5" />
                </Link>
                 <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-10 h-10 rounded-full bg-[#C59B27] text-white hover:bg-[#a17b1d] flex items-center justify-center shadow-md transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 hover:scale-110 active:scale-95 cursor-pointer"
                    aria-label="Add to Cart"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-3 md:p-4 flex flex-col flex-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                {product.category}
              </span>
              <Link href={"/product/" + product.id} className="block">
                 <h3 className="text-xs md:text-sm font-bold text-gray-800 line-clamp-2 min-h-[32px] md:min-h-[40px] group-hover:text-[#C59B27] transition-colors">
                   {product.name}
                 </h3>
               </Link>

               {/* Add to Cart Notification */}
               {showNotification?.id === product.id && showNotification?.show && (
                 <div className="text-center text-xs text-green-600 font-semibold mb-1">
                   ✓ Đã thêm vào giỏ
                 </div>
               )}

               {/* Rating summary */}
              <div className="flex items-center gap-1 my-1.5">
                <span className="text-[10px] text-gray-400 font-medium">
                  ({product.reviewsCount} đánh giá)
                </span>
              </div>

              {/* Price Details */}
              <div className="mt-auto pt-2 flex flex-col">
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-sm md:text-base font-extrabold text-[#D32F2F] mt-0.5">
                  {formatPrice(product.salePrice)}
                </span>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </section>
  );
}