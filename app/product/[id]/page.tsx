"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import NewsGrid from "../../components/NewsGrid";
import Footer from "../../components/Footer";
import FloatingButtons from "../../components/FloatingButtons";
import { ShoppingCart, Heart, Shield, RefreshCw, Truck, Check, Loader2 } from "lucide-react";
import { supabase, getProductImage, getProductGallery, getCategoryLabel, normalizeCategorySlug } from "../../../lib/supabase";
import { useCart } from "../../context/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  brand: string;
  image: string;
  category: string[];
  description?: string;
}

const allProducts: Product[] = [
  {
    id: 1,
    name: "Ví da nam Premium Classic Handcrafted",
    price: 850000,
    originalPrice: 1200000,
    brand: "Swordsman",
    image: "https://images.unsplash.com/photo-1627124356238-3dbb4d5ce4d4?w=600&q=80",
    category: ["vi-da-cao-cap"],
  },
  {
    id: 2,
    name: "Ví đứng Saffiano Black Edition",
    price: 1250000,
    originalPrice: 1800000,
    brand: "Swordsman",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80",
    category: ["vi-da-cao-cap"],
  },
  {
    id: 3,
    name: "Thắt lưng da bò nguyên tấm Luxury Brass",
    price: 950000,
    originalPrice: 1450000,
    brand: "Swordsman",
    image: "https://images.unsplash.com/photo-1624222247344-550fb8ecf78d?w=600&q=80",
    category: ["that-lung-da"],
  },
  {
    id: 4,
    name: "Thắt lưng công sở khóa tự động Premium",
    price: 790000,
    originalPrice: 1150000,
    brand: "Swordsman",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    category: ["that-lung-da"],
  },
  {
    id: 5,
    name: "Giftset Quý Ông Lịch Lãm (Ví & Thắt lưng)",
    price: 1750000,
    originalPrice: 2500000,
    brand: "Swordsman",
    image: "https://images.unsplash.com/photo-1549439602-43ebca2327af?w=600&q=80",
    category: ["bo-qua-tang"],
  },
  {
    id: 6,
    name: "Giftset Quý Ông Thành Đạt Premium (Ví & Bút ký)",
    price: 1490000,
    originalPrice: 2100000,
    brand: "Swordsman",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    category: ["bo-qua-tang"],
  },
  {
    id: 7,
    name: "Bao da chìa khóa Handmade Leather",
    price: 350000,
    originalPrice: 500000,
    brand: "Swordsman",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80",
    category: ["phu-kien-da"],
  },
  {
    id: 8,
    name: "Bao đựng thẻ Minimalist Card Holder",
    price: 420000,
    originalPrice: 600000,
    brand: "Swordsman",
    image: "https://images.unsplash.com/photo-1627124356238-3dbb4d5ce4d4?w=600&q=80",
    category: ["phu-kien-da"],
  }
];

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>("");
  const [showNotification, setShowNotification] = useState(false);

  const checkConnection = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return !!(url && key && !url.includes("placeholder-url"));
  };

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      
      const loadLocalFallback = () => {
        const saved = localStorage.getItem("swordsman_admin_products");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const found = parsed.find((p: any) => String(p.id) === String(id));
            if (found) {
              const prod = {
                id: found.id,
                name: found.name,
                price: found.salePrice,
                originalPrice: found.originalPrice,
                brand: "Swordsman",
                image: found.image,
                category: [normalizeCategorySlug(found.category)],
                description: found.description || ""
              };
              setProduct(prod);
              setActiveImage(getProductImage(prod.image));
              setLoading(false);
              return true;
            }
          } catch (e) {
            // Ignore
          }
        }
        
        // Final fallback: allProducts static list
        const foundStatic = allProducts.find((p) => String(p.id) === String(id));
        if (foundStatic) {
          setProduct({
            ...foundStatic,
            description: "Sản phẩm phụ kiện da nam cao cấp của Swordsman được chế tác hoàn toàn thủ công từ chất liệu da thật nhập khẩu thượng hạng, đem lại vẻ ngoài lịch lãm, tinh tế cho quý ông."
          });
          setActiveImage(getProductImage(foundStatic.image));
        } else {
          setProduct(null);
        }
        setLoading(false);
        return false;
      };

      if (!checkConnection()) {
        loadLocalFallback();
        return;
      }

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (data) {
          const prod: Product = {
            id: data.id,
            name: data.name,
            price: Number(data.price),
            originalPrice: data.original_price ? Number(data.original_price) : undefined,
            brand: "Swordsman",
            image: data.image || "https://images.unsplash.com/photo-1627124356238-3dbb4d5ce4d4?w=600&q=80",
            category: [normalizeCategorySlug(data.category)],
            description: data.description || ""
          };
            setProduct(prod);
            setActiveImage(getProductImage(prod.image));
          } else {
            loadLocalFallback();
          }
      } catch (err) {
        console.warn("Lỗi khi tải chi tiết sản phẩm:", err);
        loadLocalFallback();
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const formatPrice = (n: number) => {
    return n.toLocaleString("vi-VN") + "₫";
  };

  const handleAddToCart = () => {
    if (product) {
      // Thêm từng sản phẩm theo số lượng đã chọn
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: String(product.id),
          title: product.name,
          price: product.price,
          thumbnail_url: getProductImage(product.image),
        });
      }

      // Hiển thị notification
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);

      // Reset quantity về 1
      setQuantity(1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
        <Header />
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-[#8B5A2B]" />
          <p className="mt-4 text-gray-500 text-sm">Đang tải thông tin sản phẩm...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
        <Header />
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Sản phẩm không tồn tại</h2>
          <p className="text-gray-500 mt-2 max-w-md">Sản phẩm bạn đang tìm kiếm không có hoặc đã bị gỡ bỏ.</p>
          <Link href="/" className="mt-6 px-6 py-2.5 bg-[#8B5A2B] text-white font-medium rounded-lg hover:bg-[#704820] transition-colors">
            Quay lại Trang chủ
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Generate gallery thumbnails
  const galleryImages = getProductGallery(product.image);
  const thumbnails = galleryImages.length > 0 
    ? galleryImages 
    : ["https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&w=400&q=80"];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      <Header />
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#8B5A2B] transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href={`/${product.category[0] || 'vi-da-cao-cap'}`} className="hover:text-[#8B5A2B] transition-colors capitalize">
            {getCategoryLabel(product.category[0] || 'vi-da-cao-cap')}
          </Link>
          <span>/</span>
          <span className="text-[#8B5A2B] font-semibold line-clamp-1">{product.name}</span>
        </nav>

        {/* Product Details Section */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden p-6 md:p-10 shadow-xs mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Left Column (60%): Main Image & Gallery */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                <Image
                  src={activeImage || getProductImage(product.image)}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                  unoptimized
                />
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                    Tiết kiệm {discount}%
                  </span>
                )}
              </div>

              {/* Image Gallery */}
              <div className="flex gap-3 overflow-x-auto py-1">
                {thumbnails.map((thumbUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(thumbUrl)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border-2 transition-all shrink-0 ${
                      activeImage === thumbUrl ? "border-[#8B5A2B]" : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={thumbUrl}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column (40%): Info & CTA */}
            <div className="lg:col-span-2 flex flex-col">
              <span className="text-sm font-semibold uppercase tracking-wider text-[#C59B27] mb-2">
                Thương hiệu: {product.brand}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
                {product.name}
              </h1>
 
              {/* Price Block */}
              <div className="bg-[#FDFBF7] rounded-2xl p-4 flex items-baseline gap-4 mb-6 border border-gray-100/50">
                <span className="text-3xl font-extrabold text-[#D32F2F]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
 
              {/* Brief Intro */}
              <div className="text-sm text-gray-600 space-y-3 mb-6 leading-relaxed">
                <p>
                  Sản phẩm phụ kiện da nam cao cấp của Swordsman được chế tác từ chất liệu da cao cấp, hoàn thiện tỉ mỉ bởi các nghệ nhân lành nghề, mang lại đẳng cấp vì sự sang trọng cho phái mạnh
                </p>
                <ul className="space-y-1.5 pl-1">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#C59B27]" /> Sản phẩm đi cùng túi hộp hãng như hình.
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#C59B27]" /> Bảo hành lên đến 12 tháng cho da PU cao cấp
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#C59B27]" /> Bảo hành lên đến 36 tháng cho da bò
                  </li>
                </ul>
              </div>

              {/* Quantity Selection */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-gray-700">Số lượng:</span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-5 py-1.5 text-sm font-semibold text-gray-800 bg-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Notification */}
              {showNotification && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 animate-in fade-in duration-300">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium text-sm">
                    ✓ Đã thêm {quantity} sản phẩm vào giỏ hàng!
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#8B5A2B] hover:bg-[#704820] text-white font-bold rounded-xl shadow-md transition-colors duration-200"
                >
                  <ShoppingCart className="w-5 h-5" />
                  THÊM VÀO GIỎ HÀNG
                </button>
                <button className="px-4 py-4 border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all duration-200">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Assurances */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#8B5A2B]/10 flex items-center justify-center text-[#8B5A2B] shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-gray-900 uppercase">100% Chính Hãng</h4>
                    <span className="text-[11px] text-gray-400">Hoàn tiền 200%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#8B5A2B]/10 flex items-center justify-center text-[#8B5A2B] shrink-0">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-gray-900 uppercase">Lỗi 1 Đổi 1</h4>
                    <span className="text-[11px] text-gray-400">Trong 7 ngày</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#8B5A2B]/10 flex items-center justify-center text-[#8B5A2B] shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-gray-900 uppercase">Giao Nhanh</h4>
                    <span className="text-[11px] text-gray-400">Hỗ trợ vận chuyển</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Bottom Section: Description */}
        <div className="grid grid-cols-1 gap-8 mt-12">
          {/* Description details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-xs">
            <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-4 mb-4 uppercase">
              Mô tả chi tiết sản phẩm
            </h3>
            <div className="prose max-w-none text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description || `Sản phẩm này hiện đang được cập nhật thông tin chi tiết. 
              Vui lòng liên hệ với bộ phận chăm sóc khách hàng hoặc Hotline của Swordsman để được tư vấn đầy đủ nhất.`}
            </div>
          </div>
        </div>
      </main>
      <NewsGrid />
      <Footer />
      <FloatingButtons />
    </div>
  );
}