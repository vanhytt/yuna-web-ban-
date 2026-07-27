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
  "vi-da-cao-cap": "Ví da cao cấp",
  "that-lung-da": "Thắt lưng da",
  "bo-qua-tang": "Bộ quà tặng (Giftset)",
  "phu-kien-da": "Phụ kiện da",
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

  if (!raw) return "vi-da-cao-cap";

  const normalized = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (normalized.includes("vi-da") || normalized.includes("vi") || normalized.includes("wallet")) {
    return "vi-da-cao-cap";
  }

  if (normalized.includes("that-lung") || normalized.includes("belt") || normalized.includes("day-lung")) {
    return "that-lung-da";
  }

  if (normalized.includes("giftset") || normalized.includes("bo-qua-tang") || normalized.includes("qua-tang-quy-ong") || normalized.includes("set-qua")) {
    return "bo-qua-tang";
  }

  if (normalized.includes("phu-kien") || normalized.includes("accessory")) {
    return "phu-kien-da";
  }

  return normalized || "vi-da-cao-cap";
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
