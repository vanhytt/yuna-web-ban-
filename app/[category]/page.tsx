"use client";

import { use, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import NewsGrid from "../components/NewsGrid";
import Footer from "../components/Footer";
import FloatingButtons from "../components/FloatingButtons";
import { ShoppingCart, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { supabase, getProductImage, normalizeCategorySlug } from "../../lib/supabase";
import { useCart } from "../context/CartContext";

/* ───────── TYPES ───────── */
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  brand: string;
  image: string;
  category: string[];
}

/* ───────── CATEGORY MAP ───────── */
const categoryMap: Record<string, string> = {
  "vi-da-cao-cap": "Ví da cao cấp",
  "that-lung-da": "Thắt lưng da",
  "bo-qua-tang": "Bộ quà tặng (Giftset)",
  "phu-kien-da": "Phụ kiện da",
};

/* ───────── FILTER OPTIONS ───────── */
const priceRanges = [
  { label: "Dưới 500.000₫", min: 0, max: 500000 },
  { label: "500.000₫ - 1.000.000₫", min: 500000, max: 1000000 },
  { label: "1.000.000₫ - 2.000.000₫", min: 1000000, max: 2000000 },
  { label: "Trên 2.000.000₫", min: 2000000, max: Infinity },
];

const sortOptions = [
  { value: "default", label: "Mặc định" },
  { value: "price-asc", label: "Giá thấp đến cao" },
  { value: "price-desc", label: "Giá cao đến thấp" },
  { value: "newest", label: "Mới nhất" },
];

/* ───────── HELPERS ───────── */
function formatPrice(n: number) {
  return n.toLocaleString("vi-VN") + "₫";
}

function discount(orig: number, sale: number) {
  return Math.round(((orig - sale) / orig) * 100);
}

/* ───────── PAGE COMPONENT ───────── */
export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const categoryName = categoryMap[category] || "Sản phẩm";

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("default");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { addToCart } = useCart();
  const [showNotification, setShowNotification] = useState<number | null>(null);

  const checkConnection = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return !!(url && key && !url.includes("placeholder-url"));
  };

  useEffect(() => {
    const loadProducts = async () => {
      if (!checkConnection()) {
        const saved = localStorage.getItem("swordsman_admin_products");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const mapped = parsed.map((item: any) => ({
              id: item.id,
              name: item.name,
              price: item.salePrice,
              originalPrice: item.originalPrice,
              brand: "Swordsman",
              image: item.image,
              category: [item.category],
            }));
            setProducts(mapped);
          } catch {
            setProducts([]);
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

        if (data && data.length > 0) {
          const mapped: Product[] = data.map((item) => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            originalPrice: item.original_price ? Number(item.original_price) : undefined,
            brand: "Swordsman",
            image: item.image || "",
            category: [item.category || "vi-da-cao-cap"],
          }));
          setProducts(mapped);
        } else {
          // Supabase trả về 0 sản phẩm → fallback về localStorage
          const saved = localStorage.getItem("swordsman_admin_products");
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              const mapped = parsed.map((item: any) => ({
                id: item.id,
                name: item.name,
                price: item.salePrice || item.price || 0,
                originalPrice: item.originalPrice || item.original_price,
                brand: "Swordsman",
                image: item.image,
                category: [normalizeCategorySlug(item.category)],
              }));
              setProducts(mapped);
            } catch {
              setProducts([]);
            }
          }
        }
      } catch (err) {
        console.warn("Lỗi khi tải sản phẩm từ Supabase:", err);
        const saved = localStorage.getItem("swordsman_admin_products");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const mapped = parsed.map((item: any) => ({
              id: item.id,
              name: item.name,
              price: item.salePrice,
              originalPrice: item.originalPrice,
              brand: "Swordsman",
              image: item.image,
              category: [item.category],
            }));
            setProducts(mapped);
          } catch {
            setProducts([]);
          }
        }
      }
    };

    loadProducts();
  }, []);

  // Toggle helpers
  const togglePrice = (idx: number) =>
    setSelectedPrices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );

  const clearFilters = () => {
    setSelectedPrices([]);
    setSortBy("default");
  };

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    const currentCategory = normalizeCategorySlug(category);

    list = list.filter((p) =>
      p.category.some((item) => normalizeCategorySlug(item) === currentCategory)
    );

    // Price filter
    if (selectedPrices.length > 0) {
      list = list.filter((p) =>
        selectedPrices.some((idx) => {
          const range = priceRanges[idx];
          return p.price >= range.min && p.price < range.max;
        })
      );
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.sort((a, b) => b.id - a.id);
        break;
    }

    return list;
  }, [category, selectedPrices, sortBy, products]);

  const activeFilterCount = selectedPrices.length;

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    
    addToCart({
      id: String(product.id),
      title: product.name,
      price: product.price,
      thumbnail_url: getProductImage(product.image),
    });

    // Show notification
    setShowNotification(product.id);
    setTimeout(() => {
      setShowNotification(null);
    }, 2000);
  };

  /* ──── SIDEBAR CONTENT (reused for desktop & mobile) ──── */
  const FilterSidebar = (
    <div className="space-y-6">
      {/* Price filter */}
      <div>
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-3">
          Khoảng giá
        </h3>
        <div className="space-y-2">
          {priceRanges.map((range, idx) => (
            <label
              key={idx}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedPrices.includes(idx)}
                onChange={() => togglePrice(idx)}
                className="w-4 h-4 rounded border-gray-300 text-[#C59B27] focus:ring-[#C59B27] accent-[#C59B27]"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2 pt-2">
        <button
          onClick={clearFilters}
          className="w-full py-2.5 px-4 border-2 border-[#C59B27] text-[#C59B27] rounded-lg text-sm font-semibold hover:bg-[#C59B27]/5 transition-colors"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      <Header />
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-[#C59B27] transition-colors">
            Trang chủ
          </a>
          <span>/</span>
          <span className="text-[#C59B27] font-semibold">{categoryName}</span>
        </nav>

        {/* Page title */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 max-w-[60px] h-[2px] bg-[#C59B27]" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-widest uppercase whitespace-nowrap">
            {categoryName}
          </h1>
          <div className="flex-1 max-w-[60px] h-[2px] bg-[#C59B27]" />
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 mb-4 px-4 py-2.5 rounded-lg border border-[#C59B27] text-[#C59B27] text-sm font-semibold hover:bg-[#C59B27]/5 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Bộ lọc
          {activeFilterCount > 0 && (
            <span className="bg-[#C59B27] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Mobile filter drawer overlay */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-[300px] bg-white shadow-xl p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg text-gray-900">Bộ lọc</h2>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {FilterSidebar}
            </div>
          </div>
        )}

        {/* Main layout: sidebar + products */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-[260px] shrink-0">
            <div className="sticky top-6 bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-bold text-base text-gray-900 uppercase tracking-wide mb-5 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#C59B27]" />
                Bộ lọc sản phẩm
              </h2>
              {FilterSidebar}
            </div>
          </aside>

          {/* Products area */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-lg border border-gray-200 px-4 py-3">
              <span className="text-sm text-gray-500">
                Hiển thị{" "}
                <strong className="text-gray-900">
                  {filteredProducts.length}
                </strong>{" "}
                sản phẩm
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent pl-3 pr-8 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <Link href={`/product/${product.id}`} className="w-full h-full block relative">
                        <Image
                          src={getProductImage(product.image)}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          unoptimized
                        />
                      </Link>
                      {product.originalPrice && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                          -{discount(product.originalPrice, product.price)}%
                        </span>
                      )}
                    </div>

                     {/* Info */}
                     <div className="p-4 flex flex-col gap-2">
                       <span className="text-[11px] text-[#C59B27] font-semibold uppercase tracking-wider">
                         {product.brand}
                       </span>
                       <Link href={`/product/${product.id}`} className="block">
                         <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#C59B27] transition-colors">
                           {product.name}
                         </h3>
                       </Link>
                       
                       {/* Add to Cart Notification */}
                       {showNotification === product.id && (
                         <div className="text-center text-xs text-green-600 font-semibold">
                           ✓ Đã thêm vào giỏ
                         </div>
                       )}
                       
                       <div className="flex items-center gap-2 mt-1">
                         <span className="text-lg font-bold text-[#C59B27]">
                           {formatPrice(product.price)}
                         </span>
                         {product.originalPrice && (
                           <span className="text-sm text-gray-400 line-through">
                             {formatPrice(product.originalPrice)}
                           </span>
                         )}
                       </div>
                       <button
                         onClick={(e) => handleAddToCart(e, product)}
                         className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 bg-[#C59B27] hover:bg-[#a17b1d] text-white text-sm font-semibold rounded-lg transition-colors duration-200 active:scale-95 cursor-pointer"
                       >
                         <ShoppingCart className="w-4 h-4" />
                         Thêm vào giỏ
                       </button>
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <ShoppingCart className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 text-base mb-1">
                  Không tìm thấy sản phẩm nào
                </p>
                <p className="text-gray-400 text-sm">
                  Hãy thử thay đổi bộ lọc hoặc{" "}
                  <button
                    onClick={clearFilters}
                    className="text-[#C59B27] font-semibold hover:underline"
                  >
                    xóa bộ lọc
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <NewsGrid />
      <Footer />
      <FloatingButtons />
    </div>
  );
}