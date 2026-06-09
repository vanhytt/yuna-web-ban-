export default function Footer() {
  return (
    <footer className="w-full bg-[#1a2910] text-white/60 py-10 border-t border-[#6B8E23]/20 text-xs md:text-sm font-sans mt-0">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-[#C59B27] font-bold mb-3 text-base tracking-wide">
            VỀ YUNA VIỆT NAM
          </h4>
          <p className="leading-relaxed text-white/50">
            YUNA là thương hiệu chuyên cung cấp các giải pháp gia dụng thông
            minh, tiện ích cho gia đình Việt. Cam kết chất lượng, bảo hành
            chính hãng và hỗ trợ khách hàng tận tâm.
          </p>
        </div>
        <div>
          <h4 className="text-[#C59B27] font-bold mb-3 text-base tracking-wide">
            HỖ TRỢ KHÁCH HÀNG
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-white/50 hover:text-[#6B8E23] transition-colors">
                Chính sách bảo hành
              </a>
            </li>
            <li>
              <a href="#" className="text-white/50 hover:text-[#6B8E23] transition-colors">
                Chính sách đổi trả
              </a>
            </li>
            <li>
              <a href="#" className="text-white/50 hover:text-[#6B8E23] transition-colors">
                Chính sách vận chuyển
              </a>
            </li>
            <li>
              <a href="#" className="text-white/50 hover:text-[#6B8E23] transition-colors">
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
            <strong className="text-white/70">Địa chỉ:</strong> Khu đô thị mới, Hà Nội, Việt Nam
          </p>
          <p className="leading-relaxed mb-2 text-white/50">
            <strong className="text-white/70">Hotline:</strong> 0977 500 651
          </p>
          <p className="leading-relaxed text-white/50">
            <strong className="text-white/70">Email:</strong> yunavietnam.info@gmail.com
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-[#6B8E23]/20 text-center text-xs text-white/30">
        &copy; {new Date().getFullYear()} YUNA Việt Nam. All rights reserved.
      </div>
    </footer>
  );
}