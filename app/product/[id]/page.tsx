"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
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
  video_url?: string;
}

const allProducts: Product[] = [
  {
    id: 1,
    name: "Robot hút bụi thông minh YUNA X10 Pro",
    price: 5950000,
    originalPrice: 8500000,
    brand: "Yuna",
    image: "https://images.unsplash.com/photo-1618134278327-a39709ec7414?auto=format&fit=crop&w=400&q=80",
    category: ["gia-dung-thong-minh"],
  },
  {
    id: 2,
    name: "Máy lọc không khí YUNA Pure Air 5",
    price: 2940000,
    originalPrice: 4200000,
    brand: "Yuna",
    image: "https://images.unsplash.com/photo-1601628768048-9343f5eabfe0?auto=format&fit=crop&w=400&q=80",
    category: ["gia-dung-thong-minh"],
  },
  {
    id: 3,
    name: "Nồi chiên không dầu đa năng YUNA 6.5L",
    price: 1990000,
    originalPrice: 3100000,
    brand: "Yuna",
    image: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&w=400&q=80",
    category: ["gia-dung-nha-bep"],
  },
  {
    id: 4,
    name: "Quạt tích điện thông minh YUNA Breeze F1",
    price: 1190000,
    originalPrice: 1800000,
    brand: "Yuna",
    image: "https://images.unsplash.com/photo-1618945833293-10e3fa3f565c?auto=format&fit=crop&w=400&q=80",
    category: ["gia-dung-tien-ich"],
  },
  {
    id: 5,
    name: "Máy làm sữa hạt đa năng YUNA Nutri Max",
    price: 1850000,
    originalPrice: 2900000,
    brand: "Yuna",
    image: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&w=400&q=80",
    category: ["gia-dung-nha-bep"],
  },
  {
    id: 6,
    name: "Ấm siêu tốc giữ nhiệt thông minh YUNA Kettle",
    price: 650000,
    originalPrice: 950000,
    brand: "Yuna",
    image: "https://images.unsplash.com/photo-1594227513513-d022b79930f3?auto=format&fit=crop&w=400&q=80",
    category: ["gia-dung-tien-ich"],
  },
  {
    id: 7,
    name: "Bộ dao làm bếp thép Đức YUNA Chef Pro",
    price: 1540000,
    originalPrice: 2200000,
    brand: "Yuna",
    image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=400&q=80",
    category: ["gia-dung-nha-bep"],
  },
  {
    id: 8,
    name: "Máy hút bụi cầm tay YUNA Handy H2",
    price: 990000,
    originalPrice: 1500000,
    brand: "Yuna",
    image: "https://images.unsplash.com/photo-1563161402-e414c7709c3e?auto=format&fit=crop&w=400&q=80",
    category: ["gia-dung-tien-ich"],
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
        const saved = localStorage.getItem("yuna_admin_products");
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
                brand: "Yuna",
                image: found.image,
                category: [normalizeCategorySlug(found.category)],
                description: found.description || "",
                video_url: found.video_url || ""
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
            description: "Sản phẩm gia dụng chất lượng cao của YUNA, được sản xuất với dây chuyền hiện đại, đáp ứng mọi tiêu chuẩn chất lượng khắt khe nhất.",
            video_url: ""
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
            brand: "Yuna",
            image: data.image || "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&w=400&q=80",
            category: [normalizeCategorySlug(data.category)],
            description: data.description || "",
            video_url: data.video_url || ""
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

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const getTiktokEmbedUrl = (url: string) => {
    if (!url) return null;
    const match = url.match(/\/video\/(\d+)/);
    return match ? `https://www.tiktok.com/embed/v2/${match[1]}` : null;
  };

  const isDirectVideo = (url: string) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg)$/i) || url.includes("mixkit.co") || url.includes("video");
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
          <Loader2 className="w-10 h-10 animate-spin text-[#6B8E23]" />
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
          <Link href="/" className="mt-6 px-6 py-2.5 bg-[#6B8E23] text-white font-medium rounded-lg hover:bg-[#5a781e] transition-colors">
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
          <Link href="/" className="hover:text-[#6B8E23] transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href={`/${product.category[0] || 'dien-gia-dung'}`} className="hover:text-[#6B8E23] transition-colors capitalize">
            {getCategoryLabel(product.category[0] || 'dien-gia-dung')}
          </Link>
          <span>/</span>
          <span className="text-[#6B8E23] font-semibold line-clamp-1">{product.name}</span>
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
                      activeImage === thumbUrl ? "border-[#6B8E23]" : "border-gray-100 hover:border-gray-300"
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
              <span className="text-sm font-semibold uppercase tracking-wider text-[#6B8E23] mb-2">
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
                  Sản phẩm gia dụng chất lượng cao của YUNA, được làm từ các vật liệu tuyển chọn bền bỉ, an toàn tuyệt đối cho sức khỏe của người tiêu dùng Việt Nam.
                </p>
                <ul className="space-y-1.5 pl-1">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#6B8E23]" /> Thiết kế hiện đại, tiện lợi.
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#6B8E23]" /> Chất liệu thân thiện, dễ làm sạch.
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#6B8E23]" /> Bảo hành chính hãng uy tín 12 tháng.
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
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#6B8E23] hover:bg-[#5a781e] text-white font-bold rounded-xl shadow-md transition-colors duration-200"
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
                  <div className="w-10 h-10 rounded-full bg-[#6B8E23]/10 flex items-center justify-center text-[#6B8E23] shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-gray-900 uppercase">100% Chính Hãng</h4>
                    <span className="text-[11px] text-gray-400">Hoàn tiền 200%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#6B8E23]/10 flex items-center justify-center text-[#6B8E23] shrink-0">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-gray-900 uppercase">Lỗi 1 Đổi 1</h4>
                    <span className="text-[11px] text-gray-400">Trong 7 ngày</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#6B8E23]/10 flex items-center justify-center text-[#6B8E23] shrink-0">
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

        {/* Bottom Section: Description & Video Review */}
        <div className="grid grid-cols-1 gap-8 mt-12">
          {/* Description details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-xs">
            <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-4 mb-4 uppercase">
              Mô tả chi tiết sản phẩm
            </h3>
            <div className="prose max-w-none text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description || `Sản phẩm này hiện đang được cập nhật thông tin chi tiết. 
              Vui lòng liên hệ với bộ phận chăm sóc khách hàng hoặc Hotline của YUNA để được tư vấn đầy đủ nhất.`}
            </div>
          </div>

          {/* Video Review section */}
          {product.video_url && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-xs">
              <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-4 mb-6 uppercase">
                Video Review Thực Tế
              </h3>
              
              <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-black aspect-video flex items-center justify-center relative">
                {getYoutubeEmbedUrl(product.video_url) ? (
                  <iframe
                    className="w-full h-full absolute inset-0 border-0"
                    src={getYoutubeEmbedUrl(product.video_url)!}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                ) : getTiktokEmbedUrl(product.video_url) ? (
                  <iframe
                    className="w-full h-full absolute inset-0 border-0"
                    src={getTiktokEmbedUrl(product.video_url)!}
                    title="TikTok video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                ) : isDirectVideo(product.video_url) ? (
                  <video
                    src={product.video_url}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="p-8 text-center flex flex-col items-center">
                    <p className="text-gray-400 mb-4 text-sm">Xem video review trực tiếp tại đường dẫn dưới đây:</p>
                    <a
                      href={product.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 bg-[#6B8E23] hover:bg-[#5a781e] text-white font-medium rounded-lg text-sm transition-colors"
                    >
                      Mở Video Review
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  );
}