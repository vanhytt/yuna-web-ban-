import Header from "./components/Header";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ProductGrid from "./components/ProductGrid";
import VideoReviewSlider from "./components/VideoReviewSlider";
import FloatingButtons from "./components/FloatingButtons";
import NewsGrid from "./components/NewsGrid";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      {/* Header & Navigation */}
      <Header />
      <Navbar />

      {/* Hero Banner — full-width, outside the constrained main container */}
      <HeroSection />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <ProductGrid />
        <VideoReviewSlider />
      </main>

      {/* News & Articles Section */}
      <NewsGrid />

      <Footer />

      {/* Floating Buttons */}
      <FloatingButtons />
    </div>
  );
}

