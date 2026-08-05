"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { supabase, getProductImage, getCategoryLabel } from "../../lib/supabase";
import { useCart } from "../context/CartContext";

interface Product {
  id: number;
  name: string;
  category: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  image: string;
  tag?: string;
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const { addToCart } = useCart();
  const [showNotification, setShowNotification] = useState<{ id: number; show: boolean } | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProductImage(id: number) {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("image")
          .eq("id", id)
          .single();

        if (error) {
          console.error(`Lỗi khi tải ảnh cho sản phẩm ${id}:`, error.message);
          return;
        }

        if (data && isMounted) {
          setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, image: data.image || "no-image" } : p))
          );
        }
      } catch (err) {
        console.error(`Lỗi không mong muốn khi tải ảnh cho sản phẩm ${id}:`, err);
      }
    }

    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, price, original_price, category")
          .order("id", { ascending: true })
          .limit(8);

        if (error) {
          console.error("Lỗi khi tải sản phẩm:", error.message);
          return;
        }

        if (data && isMounted) {
          const mapped: Product[] = data.map((item) => {
            const originalPrice = Number(item.original_price || item.price);
            const salePrice = Number(item.price);
            const discount =
              originalPrice > salePrice
                ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
                : 0;

            return {
              id: item.id,
              name: item.name,
              category: getCategoryLabel(item.category) || "Chưa phân loại",
              originalPrice,
              salePrice,
              discount,
              image: "", // Trạng thái đang tải ảnh
              tag: originalPrice > salePrice ? "Khuyến Mãi" : undefined,
            };
          });

          setProducts(mapped);

          // Tải ảnh cho từng sản phẩm song song để tránh timeout do dung lượng ảnh base64 quá lớn
          data.forEach((item) => {
            fetchProductImage(item.id);
          });
        }
      } catch (err) {
        console.error("Lỗi không mong muốn:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
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
          Sản phẩm ví da, thắt lưng da cao cấp Swordsman - Sự lựa chọn hoàn hảo của quý ông
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
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
               {/* Shimmer Placeholder */}
               {(!product.image || !loadedImages[product.id]) && (
                 <div className="absolute inset-0 w-full h-full animate-shimmer z-10" />
               )}

               {product.image !== "" && (
                 <Link href={"/product/" + product.id} className="w-full h-full block relative overflow-hidden">
                   <Image
                     src={getProductImage(product.image === "no-image" ? null : product.image)}
                     alt={product.name}
                     fill
                     className={`object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                       loadedImages[product.id] ? "opacity-100" : "opacity-0"
                     }`}
                     loading="lazy"
                     sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                     onLoad={() => {
                       setLoadedImages((prev) => ({ ...prev, [product.id]: true }));
                     }}
                   />
                 </Link>
               )}
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

               {/* Price Details */}
               <div className="mt-auto pt-2 flex flex-col mb-3">
                 <span className="text-xs text-gray-400 line-through">
                   {formatPrice(product.originalPrice)}
                 </span>
                 <span className="text-sm md:text-base font-extrabold text-[#D32F2F] mt-0.5">
                   {formatPrice(product.salePrice)}
                 </span>
               </div>

               {/* Add to Cart Button */}
               <button
                 onClick={(e) => handleAddToCart(e, product)}
                 className="w-full py-2.5 md:py-3 px-3 md:px-4 bg-[#C59B27] hover:bg-[#a17b1d] text-white font-bold text-xs md:text-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                 aria-label="Add to Cart"
               >
                 <ShoppingCart className="w-4 h-4" />
                 <span>Thêm vào giỏ</span>
               </button>
            </div>
          </div>
        ))}
        </div>
      )}
    </section>
  );
}