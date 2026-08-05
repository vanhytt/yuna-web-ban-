import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { normalizeCategorySlug, getProductImage } from "../../../lib/supabase";
import ProductDetailClient from "./ProductDetailClient";

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

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

async function getProduct(id: string): Promise<Product | null> {
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder-url")) {
    return null;
  }
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) return null;
    if (data) {
      return {
        id: data.id,
        name: data.name,
        price: Number(data.price),
        originalPrice: data.original_price ? Number(data.original_price) : undefined,
        brand: "Swordsman",
        image: data.image || "",
        category: [normalizeCategorySlug(data.category)],
        description: data.description || ""
      };
    }
  } catch (e) {
    console.error("Error fetching product on server:", e);
  }
  return null;
}

async function getProductWithFallback(id: string): Promise<Product | null> {
  const dbProd = await getProduct(id);
  if (dbProd) return dbProd;

  const foundStatic = allProducts.find((p) => String(p.id) === String(id));
  if (foundStatic) {
    return {
      ...foundStatic,
      description: foundStatic.description || "Sản phẩm phụ kiện da nam cao cấp của Swordsman được chế tác hoàn toàn thủ công từ chất liệu da thật nhập khẩu thượng hạng, đem lại vẻ ngoài lịch lãm, tinh tế cho quý ông."
    };
  }
  return null;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductWithFallback(id);

  if (!product) {
    return {
      title: "Sản phẩm không tồn tại | Swordsman",
      description: "Sản phẩm không tồn tại hoặc đã bị gỡ bỏ khỏi hệ thống.",
      alternates: {
        canonical: `/product/${id}`,
      }
    };
  }

  const title = `${product.name} | Swordsman`;
  const description = product.description 
    ? product.description.slice(0, 155) + "..."
    : `Mua ngay ${product.name} chính hãng Swordsman - quà tặng phụ kiện da nam cao cấp, thiết kế lịch lãm, da thật tinh xảo. Bảo hành dài hạn. Giao hàng toàn quốc.`;
  const imageUrl = getProductImage(product.image);

  return {
    title,
    description,
    alternates: {
      canonical: `/product/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://swordsman.vn/product/${id}`,
      type: "music.song", // Using standard object types or article
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        }
      ],
    }
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductWithFallback(id);

  // Generate JSON-LD Schema (Product)
  let jsonLd = null;
  if (product) {
    const imageUrl = getProductImage(product.image);
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "image": imageUrl,
      "description": product.description || `Mua ngay ${product.name} chính hãng Swordsman - quà tặng phụ kiện da nam cao cấp.`,
      "sku": `SW-${product.id}`,
      "brand": {
        "@type": "Brand",
        "name": "Swordsman"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://swordsman.vn/product/${product.id}`,
        "priceCurrency": "VND",
        "price": product.price,
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Swordsman"
        }
      }
    };
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailClient initialProduct={product} id={id} />
    </>
  );
}