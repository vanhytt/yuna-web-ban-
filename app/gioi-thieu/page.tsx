import Header from "../components/Header";
import Navbar from "../components/Navbar";
import FloatingButtons from "../components/FloatingButtons";
import Footer from "../components/Footer";
import {
  Target,
  Eye,
  ShieldCheck,
  Cpu,
  HeartHandshake,
  BadgeDollarSign,
  PackageCheck,
  Truck,
  Clock,
  Star,
} from "lucide-react";

const coreValues = [
  {
    icon: ShieldCheck,
    title: "Chất lượng hàng đầu",
    desc: "Tất cả sản phẩm của Yuna đều được kiểm định nghiêm ngặt, đáp ứng tiêu chuẩn chất lượng quốc tế trước khi đến tay khách hàng.",
  },
  {
    icon: Cpu,
    title: "Công nghệ tiên tiến",
    desc: "Ứng dụng công nghệ sản xuất hiện đại, mang lại sản phẩm vừa bền đẹp vừa an toàn cho sức khỏe người dùng.",
  },
  {
    icon: HeartHandshake,
    title: "Tận tâm phục vụ",
    desc: "Đội ngũ tư vấn nhiệt tình, chuyên nghiệp, luôn sẵn sàng hỗ trợ khách hàng trước, trong và sau khi mua hàng.",
  },
  {
    icon: BadgeDollarSign,
    title: "Giá cả hợp lý",
    desc: "Cam kết mức giá cạnh tranh nhất thị trường, không qua trung gian, mang lại giá trị thật sự cho từng đồng tiền bạn bỏ ra.",
  },
];

const whyChooseUs = [
  {
    icon: PackageCheck,
    title: "Bảo hành chính hãng",
    desc: "Bảo hành chính hãng lên đến 36 tháng, quy trình đổi trả minh bạch, không phát sinh chi phí.",
  },
  {
    icon: Truck,
    title: "Giao hàng nhanh chóng",
    desc: "Giao hàng toàn quốc, hoả tốc nội thành trong 2 giờ, đóng gói cẩn thận đảm bảo sản phẩm nguyên vẹn.",
  },
  {
    icon: Clock,
    title: "Tư vấn 24/7",
    desc: "Đội ngũ chăm sóc khách hàng hoạt động 24/7, sẵn sàng giải đáp mọi thắc mắc qua Zalo, Facebook, Hotline.",
  },
  {
    icon: Star,
    title: "Uy tín 10+ năm",
    desc: "Hơn 10 năm kinh nghiệm trong ngành gia dụng, hàng chục nghìn khách hàng tin tưởng và quay lại mua hàng.",
  },
];

export default function GioiThieuPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      <Header />
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative w-full overflow-hidden bg-[#1a2910] py-24 md:py-36 flex items-center justify-center text-center">
        {/* Decorative radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[#6B8E23]/20 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <p className="text-[#C59B27] uppercase tracking-[0.35em] text-xs md:text-sm font-semibold mb-4">
            Được tin dùng từ 2024
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase leading-tight mb-5 tracking-wide">
            VỀ CHÚNG TÔI
          </h1>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex-1 max-w-[60px] h-px bg-[#C59B27]/60" />
            <span className="text-[#C59B27] text-base font-bold tracking-[0.3em] uppercase">
              YUNA VIỆT NAM
            </span>
            <div className="flex-1 max-w-[60px] h-px bg-[#C59B27]/60" />
          </div>
          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Bảo vệ tổ ấm — Nâng tầm cuộc sống
          </p>
        </div>
      </section>

      {/* ===== CÂU CHUYỆN THƯƠNG HIỆU ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="flex-1 max-w-[80px] h-[2px] bg-[#6B8E23]" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-widest uppercase whitespace-nowrap">
              CÂU CHUYỆN THƯƠNG HIỆU
            </h2>
            <div className="flex-1 max-w-[80px] h-[2px] bg-[#6B8E23]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Text — 3 cols */}
            <div className="lg:col-span-3 space-y-5 text-gray-600 leading-[1.85] text-[15px]">
              <p>
                <span className="font-bold text-[#6B8E23] text-base">
                  YUNA Việt Nam
                </span>{" "}
                được thành lập năm{" "}
                <span className="font-semibold text-gray-900">2024</span>, với
                sứ mệnh mang đến những sản phẩm gia dụng thông minh, chất
                lượng cao cho hàng triệu gia đình Việt Nam.
              </p>
              <p>
                Khởi đầu từ một cửa hàng nhỏ tại Hà Nội, trải qua hơn một thập
                kỷ nỗ lực không ngừng, Yuna đã phát triển thành một hệ thống
                phân phối uy tín với hàng nghìn khách hàng trung thành trên
                khắp cả nước.
              </p>
              <p>
                Chúng tôi tin rằng một căn bếp tốt là trái tim của mỗi ngôi
                nhà. Vì thế, mọi sản phẩm tại Yuna đều được tuyển chọn kỹ
                lưỡng — đảm bảo{" "}
                <span className="font-semibold text-gray-900">
                  bền đẹp, an toàn, và tiện dụng
                </span>
                .
              </p>
              <blockquote className="border-l-4 border-[#C59B27] pl-5 py-1 text-[#6B8E23] font-semibold italic text-base">
                &ldquo;Bảo vệ tổ ấm, nâng tầm cuộc sống.&rdquo;
              </blockquote>
            </div>

            {/* Stats — 2 cols */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              {[
                { number: "2024", label: "Năm thành lập" },
                { number: "50K+", label: "Khách hàng" },
                { number: "500+", label: "Sản phẩm" },
                { number: "63", label: "Tỉnh thành" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-[#1a2910] rounded-xl p-5 text-center hover:scale-[1.03] transition-transform duration-200"
                >
                  <div className="text-2xl md:text-3xl font-bold text-[#C59B27] mb-1">
                    {s.number}
                  </div>
                  <div className="text-[#6B8E23]/70 text-xs uppercase tracking-wider font-medium">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TẦM NHÌN & SỨ MỆNH ===== */}
      <section className="py-16 md:py-20 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="flex-1 max-w-[80px] h-[2px] bg-[#6B8E23]" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-widest uppercase whitespace-nowrap">
              TẦM NHÌN & SỨ MỆNH
            </h2>
            <div className="flex-1 max-w-[80px] h-[2px] bg-[#6B8E23]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#6B8E23]/40 hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#6B8E23] rounded-l-2xl" />
              <div className="w-12 h-12 rounded-lg bg-[#6B8E23]/10 flex items-center justify-center mb-5 group-hover:bg-[#6B8E23]/20 transition-colors">
                <Target className="w-6 h-6 text-[#6B8E23]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3">
                Sứ Mệnh
              </h3>
              <p className="text-gray-500 leading-relaxed text-[15px]">
                Mang đến những sản phẩm gia dụng công nghệ hiện đại, tiện ích
                nhất cho mọi gia đình Việt. Chúng tôi cam kết không ngừng đổi
                mới để mỗi sản phẩm là người bạn đồng hành đáng tin cậy trong
                gian bếp của bạn.
              </p>
            </div>

            <div className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#C59B27]/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#C59B27] rounded-l-2xl" />
              <div className="w-12 h-12 rounded-lg bg-[#C59B27]/10 flex items-center justify-center mb-5 group-hover:bg-[#C59B27]/20 transition-colors">
                <Eye className="w-6 h-6 text-[#C59B27]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3">
                Tầm Nhìn
              </h3>
              <p className="text-gray-500 leading-relaxed text-[15px]">
                Trở thành hệ thống phân phối đồ gia dụng thông minh hàng đầu
                Việt Nam — nơi mà mỗi khách hàng được trải nghiệm dịch vụ tận
                tâm nhất, với sản phẩm tốt nhất và giá cả minh bạch nhất.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GIÁ TRỊ CỐT LÕI ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="flex-1 max-w-[80px] h-[2px] bg-[#6B8E23]" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-widest uppercase whitespace-nowrap">
              GIÁ TRỊ CỐT LÕI
            </h2>
            <div className="flex-1 max-w-[80px] h-[2px] bg-[#6B8E23]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group flex flex-col items-center text-center rounded-2xl p-6 bg-[#FDFBF7] border border-gray-100 hover:bg-[#1a2910] hover:border-[#1a2910] transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-full bg-[#6B8E23]/10 flex items-center justify-center mb-4 group-hover:bg-[#6B8E23]/20 transition-colors">
                    <Icon
                      className="w-6 h-6 text-[#6B8E23] group-hover:text-[#C59B27] transition-colors duration-300"
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="text-xs text-[#C59B27] font-bold mb-2 tracking-wider">
                    0{idx + 1}
                  </span>
                  <h3 className="font-bold text-gray-900 group-hover:text-white text-sm uppercase tracking-wide mb-2 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 group-hover:text-white/60 text-sm leading-relaxed transition-colors duration-300">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TẠI SAO CHỌN YUNA ===== */}
      <section className="py-16 md:py-20 bg-[#1a2910]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="flex-1 max-w-[60px] h-[2px] bg-[#C59B27]" />
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase whitespace-nowrap">
              TẠI SAO CHỌN YUNA?
            </h2>
            <div className="flex-1 max-w-[60px] h-[2px] bg-[#C59B27]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group flex flex-col items-center text-center rounded-2xl p-6 border border-[#6B8E23]/30 bg-[#6B8E23]/10 hover:border-[#C59B27]/60 hover:bg-[#6B8E23]/20 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-full border-2 border-[#C59B27]/40 flex items-center justify-center mb-4 group-hover:border-[#C59B27] group-hover:bg-[#C59B27]/10 transition-all duration-300">
                    <Icon
                      className="w-6 h-6 text-[#C59B27]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="font-bold text-white text-sm uppercase tracking-wide mb-2">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
}