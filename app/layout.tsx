import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "YUNA - Gia Dụng Thông Minh & Tiện Ích Hiện Đại",
  description: "Chuyên cung cấp các giải pháp dọn dẹp hiện đại, robot hút bụi, máy lọc không khí và đồ gia dụng thông minh chính hãng cho gia đình bạn.",
  keywords: ['gia dung thong minh', 'yuna', 'robot hut bui', 'thiet bi tien ich', 'yuna gia dung'],
  openGraph: {
    title: "YUNA - Gia Dụng Thông Minh & Tiện Ích Hiện Đại",
    description: "Chuyên cung cấp các giải pháp dọn dẹp hiện đại, robot hút bụi, máy lọc không khí và đồ gia dụng thông minh chính hãng cho gia đình bạn.",
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'YUNA - Gia Dụng Thông Minh',
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
