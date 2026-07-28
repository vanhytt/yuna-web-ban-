"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const POLICIES = {
  warranty: {
    title: "Chính sách bảo hành",
    content: [
      "Bảo hành 12 tháng đối với các sản phẩm da PU.",
      "Bảo hành 36 tháng đối với các sản phẩm da bò.",
      "Áp dụng bảo hành đối với các lỗi phát sinh do nhà sản xuất trong thời gian bảo hành.",
      "Support tận tâm trong suốt quá trình sử dụng."
    ]
  },
  exchange: {
    title: "Chính sách đổi trả",
    content: [
      "Đổi mới trong vòng 07 ngày kể từ ngày nhận hàng nếu sản phẩm bị lỗi do nhà sản xuất.",
      "Sản phẩm còn đầy đủ phụ kiện, hộp đựng và quà tặng đi kèm (nếu có)."
    ]
  },
  shipping: {
    title: "Chính sách vận chuyển",
    content: [
      "Giao hàng trên toàn quốc thông qua các đơn vị vận chuyển uy tín.",
      "Đơn hàng sẽ được đóng gói cẩn thận và bàn giao cho đơn vị vận chuyển trong thời gian sớm nhất."
    ]
  },
  payment: {
    title: "Hướng dẫn thanh toán",
    content: [
      "Hỗ trợ thanh toán linh hoạt qua Chuyển khoản QR ngân hàng (payOS) hoặc Thanh toán khi nhận hàng (COD)."
    ]
  }
};

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<keyof typeof POLICIES | null>(null);

  const openPolicy = (policyKey: keyof typeof POLICIES) => {
    setSelectedPolicy(policyKey);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPolicy(null);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const currentPolicy = selectedPolicy ? POLICIES[selectedPolicy] : null;

  return (
    <>
      <footer id="footer" className="w-full bg-[#131110] text-white/60 py-10 border-t border-[#8C6239]/20 text-xs md:text-sm font-sans mt-0">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-[#C59B27] font-bold mb-3 text-base tracking-wide">
              VỀ SWORDSMAN
            </h4>
            <p className="leading-relaxed text-white/50">
              Swordsman là thương hiệu chuyên cung cấp các sản phẩm quà tặng phụ kiện da nam cao cấp (ví da, thắt lưng da, quà tặng quý ông) thủ công tinh xảo, lịch lãm trong từng chi tiết.
            </p>
          </div>
          <div>
            <h4 className="text-[#C59B27] font-bold mb-3 text-base tracking-wide">
              HỖ TRỢ KHÁCH HÀNG
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => openPolicy("warranty")}
                  className="text-white/50 hover:text-[#8C6239] transition-colors text-left cursor-pointer"
                >
                  Chính sách bảo hành
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy("exchange")}
                  className="text-white/50 hover:text-[#8C6239] transition-colors text-left cursor-pointer"
                >
                  Chính sách đổi trả
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy("shipping")}
                  className="text-white/50 hover:text-[#8C6239] transition-colors text-left cursor-pointer"
                >
                  Chính sách vận chuyển
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy("payment")}
                  className="text-white/50 hover:text-[#8C6239] transition-colors text-left cursor-pointer"
                >
                  Hướng dẫn thanh toán
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#C59B27] font-bold mb-3 text-base tracking-wide">
              THÔNG TIN LIÊN HỆ
            </h4>
            <p className="leading-relaxed mb-2 text-white/50">
              <strong className="text-white/70">Địa chỉ:</strong> CT3A Mễ Trì Thượng, Nam Từ Liêm, Hà Nội
            </p>
            <p className="leading-relaxed mb-2 text-white/50">
              <strong className="text-white/70">Hotline:</strong> 0969 985 008
            </p>
            <p className="leading-relaxed text-white/50">
              <strong className="text-white/70">Email:</strong> Adamstore1986@gmail.com
            </p>
            <div className="mt-5">
              <h5 className="text-white/40 font-medium mb-3 text-xs uppercase tracking-widest">
                Kết nối với chúng tôi
              </h5>
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/share/1AKmNJSXfa/?mibextid=wwXIfr"
                  className="w-10 h-10 rounded-lg bg-[#8C6239]/20 border border-[#8C6239]/30 flex items-center justify-center text-white hover:bg-[#8C6239] hover:-translate-y-0.5 transition-all duration-200 shadow-md"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                {/* TikTok */}
                <a
                  href="https://vt.tiktok.com/ZS9rc4rG6ESCv-mNEHX/"
                  className="w-10 h-10 rounded-lg bg-[#8C6239]/20 border border-[#8C6239]/30 flex items-center justify-center text-white hover:bg-[#8C6239] hover:-translate-y-0.5 transition-all duration-200 shadow-md"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.78-.22-.22-.4-.45-.58-.7v5.89c.04 2.23-.74 4.54-2.4 5.97-1.92 1.67-4.73 2.05-7.04 1.25-2.85-1-4.71-3.95-4.47-7.07.19-2.61 2-5.06 4.63-5.69 1.15-.28 2.37-.18 3.48.24v4.16c-.84-.36-1.8-.46-2.67-.14-1.22.42-2.12 1.74-2.02 3.05.12 1.45 1.43 2.62 2.87 2.45 1.52-.07 2.64-1.47 2.58-2.98V.02z" />
                  </svg>
                </a>
                {/* Shopee */}
                <a
                  href="https://s.shopee.vn/5ArEX7sMGq"
                  className="w-10 h-10 rounded-lg bg-[#8C6239]/20 border border-[#8C6239]/30 flex items-center justify-center text-white hover:bg-[#8C6239] hover:-translate-y-0.5 transition-all duration-200 shadow-md"
                  aria-label="Shopee"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.7 6.4h-3.2C16 3.2 14.2 1 12 1S8 3.2 7.5 6.4H4.3C3.6 6.4 3 7 3 7.7v12.2C3 21.3 4.2 23 5.7 23h12.6c1.5 0 2.7-1.7 2.7-3.1V7.7c0-.7-.6-1.3-1.3-1.3zM12 3c1.1 0 2 1.5 2.2 3.4H9.8C10 4.5 10.9 3 12 3zm0 13c-2.4 0-4.3-1.8-4.3-4.1h1.7c0 1.3 1.2 2.4 2.6 2.4s2.6-1.1 2.6-2.4h1.7c0 2.3-1.9 4.1-4.3 4.1z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-[#8C6239]/20 text-center text-xs text-white/30">
          &copy; {new Date().getFullYear()} SWORDSMAN. All rights reserved.
        </div>
      </footer>

      {/* Modal Backdrop */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Modal */}
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto relative z-[10000]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-50 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 pr-8">
                {currentPolicy?.title}
              </h2>

              <div className="space-y-4">
                {currentPolicy?.content.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-[#C59B27] text-white text-sm font-semibold">
                        ✓
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              {/* Close Button (Bottom) */}
              <button
                onClick={closeModal}
                className="mt-8 w-full bg-[#8C6239] hover:bg-[#734d29] text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}