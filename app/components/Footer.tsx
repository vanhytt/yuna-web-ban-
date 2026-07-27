export default function Footer() {
  return (
    <footer id="footer" className="w-full bg-[#131110] text-white/60 py-10 border-t border-[#8C6239]/20 text-xs md:text-sm font-sans mt-0">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-[#C59B27] font-bold mb-3 text-base tracking-wide">
            VỀ PLOYBAY
          </h4>
          <p className="leading-relaxed text-white/50">
            PLOYBAY là thương hiệu chuyên cung cấp các sản phẩm quà tặng phụ kiện da nam cao cấp (ví da, thắt lưng da, quà tặng quý ông) thủ công tinh xảo, lịch lãm trong từng chi tiết.
          </p>
        </div>
        <div>
          <h4 className="text-[#C59B27] font-bold mb-3 text-base tracking-wide">
            HỖ TRỢ KHÁCH HÀNG
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-white/50 hover:text-[#8C6239] transition-colors">
                Chính sách bảo hành
              </a>
            </li>
            <li>
              <a href="#" className="text-white/50 hover:text-[#8C6239] transition-colors">
                Chính sách đổi trả
              </a>
            </li>
            <li>
              <a href="#" className="text-white/50 hover:text-[#8C6239] transition-colors">
                Chính sách vận chuyển
              </a>
            </li>
            <li>
              <a href="#" className="text-white/50 hover:text-[#8C6239] transition-colors">
                Hướng dẫn thanh toán
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-[#C59B27] font-bold mb-3 text-base tracking-wide">
            THÔNG TIN LIÊN HỆ
          </h4>
          <p className="leading-relaxed mb-2 text-white/50">
            <strong className="text-white/70">Địa chỉ:</strong> Số 2CK1/7 khu đô thị làng nghề Vạn Phúc, Vạn Phúc, Hà Đông, Hà Nội
          </p>
          <p className="leading-relaxed mb-2 text-white/50">
            <strong className="text-white/70">Hotline:</strong> 09xx xxx xxx
          </p>
          <p className="leading-relaxed text-white/50">
            <strong className="text-white/70">Email:</strong> contact@ploybay.vn
          </p>
          <div className="mt-5">
            <h5 className="text-white/40 font-medium mb-3 text-xs uppercase tracking-widest">
              Kết nối với chúng tôi
            </h5>
            <div className="flex items-center gap-3">
              {/* Facebook */}
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-[#8C6239]/20 border border-[#8C6239]/30 flex items-center justify-center text-white hover:bg-[#8C6239] hover:-translate-y-0.5 transition-all duration-200 shadow-md"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* TikTok */}
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-[#8C6239]/20 border border-[#8C6239]/30 flex items-center justify-center text-white hover:bg-[#8C6239] hover:-translate-y-0.5 transition-all duration-200 shadow-md"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.78-.22-.22-.4-.45-.58-.7v5.89c.04 2.23-.74 4.54-2.4 5.97-1.92 1.67-4.73 2.05-7.04 1.25-2.85-1-4.71-3.95-4.47-7.07.19-2.61 2-5.06 4.63-5.69 1.15-.28 2.37-.18 3.48.24v4.16c-.84-.36-1.8-.46-2.67-.14-1.22.42-2.12 1.74-2.02 3.05.12 1.45 1.43 2.62 2.87 2.45 1.52-.07 2.64-1.47 2.58-2.98V.02z" />
                </svg>
              </a>
              {/* Shopee */}
              <a
                href="#"
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
        &copy; {new Date().getFullYear()} PLOYBAY. All rights reserved.
      </div>
    </footer>
  );
}
