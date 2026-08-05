import { Metadata } from "next";
import { getCategoryLabel } from "@/lib/supabase";
import CategoryPageClient from "./CategoryPageClient";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryName = getCategoryLabel(category);
  
  const title = `${categoryName} | Phụ Kiện Da Nam Cao Cấp Swordsman`;
  const description = `Khám phá bộ sưu tập ${categoryName} cao cấp chính hãng Swordsman. Chất liệu da thật nhập khẩu thượng hạng, thiết kế tinh tế lịch lãm.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${category}`,
    },
    openGraph: {
      title,
      description,
      url: `https://swordsman.vn/${category}`,
      type: "website",
    }
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  return <CategoryPageClient category={category} />;
}