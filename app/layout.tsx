import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Swordsman - Quà Tặng Phụ Kiện Da Nam Cao Cấp | Lịch Lãm & Đẳng Cấp",
  description: "Thương hiệu quà tặng phụ kiện da nam cao cấp (ví da, thắt lưng da, quà tặng quý ông) thủ công tinh xảo, lịch lãm trong từng chi tiết.",
  keywords: ['swordsman', 'vi da nam cao cap', 'that lung da nam', 'qua tang quy ong', 'phu kien da nam', 'qua tang nam gioi'],
  openGraph: {
    title: "Swordsman - Quà Tặng Phụ Kiện Da Nam Cao Cấp | Lịch Lãm & Đẳng Cấp",
    description: "Thương hiệu quà tặng phụ kiện da nam cao cấp (ví da, thắt lưng da, quà tặng quý ông) thủ công tinh xảo, lịch lãm trong từng chi tiết.",
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Swordsman - Quà Tặng Phụ Kiện Da Nam Cao Cấp',
      }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
