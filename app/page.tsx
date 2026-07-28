import Header from "./components/Header";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ProductGrid from "./components/ProductGrid";
import FloatingButtons from "./components/FloatingButtons";
import NewsGrid from "./components/NewsGrid";
import Footer from "./components/Footer";
import Image from "next/image";
import ScrollReveal from "./components/ScrollReveal";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      {/* Header & Navigation */}
      <Header />
      <Navbar />

      {/* Top Banner Section */}
      <div className="w-full bg-[#131110] overflow-hidden">
        <div className="animate-fade-in opacity-0 translate-y-5 transition-all duration-800 ease-out" style={{ animationFillMode: 'forwards', animationDelay: '100ms' }}>
          <Image
            src="/banner.png"
            alt="Swordsman Banner"
            width={1991}
            height={789}
            priority
            className="w-full h-auto object-contain block"
            unoptimized
          />
        </div>
      </div>

      {/* Hero Banner — full-width, outside the constrained main container */}
      <HeroSection />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <ScrollReveal variant="zoom-in" duration={800}>
          <ProductGrid />
        </ScrollReveal>
      </main>

      {/* News & Articles Section */}
      <ScrollReveal variant="fade-up" duration={800} delay={100}>
        <NewsGrid />
      </ScrollReveal>

      <Footer />

      {/* Floating Buttons */}
      <FloatingButtons />
    </div>
  );
}

