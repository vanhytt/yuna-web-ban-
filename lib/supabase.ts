import { createClient } from "@supabase/supabase-js";

let supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co").trim();
// Chuẩn hóa URL nếu người dùng dán thừa /rest/v1/ hoặc dấu gạch chéo cuối cùng
supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");

const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key").trim();

// Log để debug
if (typeof window !== 'undefined') {
  console.log('🔧 Supabase Config:', {
    url: supabaseUrl,
    hasKey: !!supabaseAnonKey && supabaseAnonKey !== 'placeholder-anon-key'
  });
}

const categoryLabelMap: Record<string, string> = {
  "dien-gia-dung": "Điện gia dụng",
  "gia-dung-nha-bep": "Gia dụng Nhà Bếp",
  "gia-dung-tien-ich": "Gia dụng Tiện ích",
  "qua-tang-va-phu-kien": "Quà tặng và Phụ kiện",
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'
  }
});

export function normalizeCategorySlug(value: string | null | undefined): string {
  const raw = (value || "").trim();

  if (!raw) return "dien-gia-dung";

  const normalized = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (normalized.includes("dien-gia-dung") || normalized.includes("gia-dung-thong-minh") || normalized.includes("thong-minh")) {
    return "dien-gia-dung";
  }

  if (normalized.includes("nha-bep")) return "gia-dung-nha-bep";
  if (normalized.includes("tien-ich")) return "gia-dung-tien-ich";
  if (normalized.includes("qua-tang") || normalized.includes("phu-kien") || normalized.includes("gift")) {
    return "qua-tang-va-phu-kien";
  }

  return normalized || "dien-gia-dung";
}

export function getCategoryLabel(value: string | null | undefined): string {
  return categoryLabelMap[normalizeCategorySlug(value)] || (value || "Sản phẩm").trim();
}

export function getProductImage(imageStr: string | null | undefined): string {
  if (!imageStr) return "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&w=400&q=80";
  try {
    const trimmed = imageStr.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0];
      }
    }
    const parts = trimmed.split(",");
    if (parts.length > 0 && parts[0].trim()) {
      return parts[0].trim();
    }
  } catch (e) {
    // ignore
  }
  return imageStr;
}

export function getProductGallery(imageStr: string | null | undefined): string[] {
  if (!imageStr) return [];
  try {
    const trimmed = imageStr.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean);
      }
    }
    return trimmed.split(",").map(s => s.trim()).filter(Boolean);
  } catch (e) {
    // ignore
  }
  return [imageStr];
}
