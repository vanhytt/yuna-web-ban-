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
  metadataBase: new URL("https://swordsman.vn"),
  title: {
    default: "Swordsman - Quà Tặng Phụ Kiện Da Nam Cao Cấp | Lịch Lãm & Đẳng Cấp",
    template: "%s | Swordsman"
  },
  description: "Thương hiệu quà tặng phụ kiện da nam cao cấp (ví da, thắt lưng da, quà tặng quý ông) thủ công tinh xảo, lịch lãm trong từng chi tiết.",
  keywords: ['swordsman', 'ví da nam cao cấp', 'thắt lưng da nam', 'quà tặng quý ông', 'phụ kiện da nam', 'quà tặng nam giới', 'ví handmade', 'thắt lưng da thật'],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Swordsman - Quà Tặng Phụ Kiện Da Nam Cao Cấp | Lịch Lãm & Đẳng Cấp",
    description: "Thương hiệu quà tặng phụ kiện da nam cao cấp (ví da, thắt lưng da, quà tặng quý ông) thủ công tinh xảo, lịch lãm trong từng chi tiết.",
    url: "https://swordsman.vn",
    siteName: "Swordsman",
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: 'Swordsman - Quà Tặng Phụ Kiện Da Nam Cao Cấp',
      }
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
