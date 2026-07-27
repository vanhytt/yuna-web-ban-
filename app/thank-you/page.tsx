"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, ShoppingBag, PhoneCall } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const orderCode = searchParams.get("orderCode");

  // Xóa giỏ hàng khi thanh toán thành công
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            Thanh toán thành công!
          </h1>
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã mua sắm tại PLOYBAY. Đơn hàng của bạn đã được ghi nhận và đang được xử lý.
          </p>

          {orderCode && (
            <div className="bg-gray-50 rounded-xl p-4 mb-8 inline-block">
              <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                Mã giao dịch (PayOS)
              </span>
              <span className="text-lg font-bold text-[#8B5A2B] tracking-wide">
                PB{orderCode}
              </span>
            </div>
          )}

          <div className="border-t border-gray-100 pt-6 space-y-3 sm:space-y-0 sm:flex sm:gap-4 sm:justify-center">
            <button
              onClick={() => router.push("/")}
              className="w-full sm:w-auto px-6 py-3 bg-[#8B5A2B] hover:bg-[#704820] text-white font-bold rounded-xl transition-all shadow-md shadow-[#8B5A2B]/10 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Tiếp tục mua sắm
            </button>
            <a
              href="tel:0962386708"
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-5 h-5 text-gray-500" />
              Hỗ trợ Hotline
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B5A2B]"></div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}