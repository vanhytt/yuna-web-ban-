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
    desc: "Tất cả sản phẩm ví da, thắt lưng da của PLOYBAY đều được chế tác từ da thật tự nhiên cao cấp, trải qua quy trình kiểm tra nghiêm ngặt trước khi xuất xưởng.",
  },
  {
    icon: Cpu,
    title: "Chế tác tinh xảo",
    desc: "Sự kết hợp giữa công nghệ hiện đại và đôi bàn tay thủ công khéo léo của những thợ da lành nghề, kiến tạo nên những sản phẩm tinh tế trong từng đường kim mũi chỉ.",
  },
  {
    icon: HeartHandshake,
    title: "Tận tâm phục vụ",
    desc: "Đội ngũ tư vấn tận tình, hỗ trợ khách hàng cá nhân hóa quà tặng, ghi thiệp tay và đóng gói các hộp quà sang trọng nhất.",
  },
  {
    icon: BadgeDollarSign,
    title: "Giá trị đích thực",
    desc: "Cam kết mang đến sản phẩm chất lượng cao tương xứng với giá thành, dịch vụ hậu mãi chu đáo và chính sách bảo hành dài hạn.",
  },
];

const whyChooseUs = [
  {
    icon: PackageCheck,
    title: "Bảo hành 12-24 tháng",
    desc: "Bảo hành chính hãng lỗi da và phụ kiện khóa, quy trình bảo hành minh bạch, nhanh chóng và tận tâm.",
  },
  {
    icon: Truck,
    title: "Giao hàng hỏa tốc",
    desc: "Hỗ trợ giao hàng hỏa tốc nội thành trong 2 giờ, giao hàng toàn quốc nhanh chóng, đóng gói hộp quà bảo vệ tỉ mỉ.",
  },
  {
    icon: Clock,
    title: "Hỗ trợ 24/7",
    desc: "Đội ngũ tư vấn hoạt động liên tục, sẵn sàng giải đáp thắc mắc và hỗ trợ chọn quà tặng cho quý ông qua Hotline/Zalo.",
  },
  {
    icon: Star,
    title: "Thương hiệu đẳng cấp",
    desc: "Sản phẩm được hàng nghìn quý ông tin dùng và là đối tác cung cấp set quà tặng doanh nghiệp sang trọng hàng đầu.",
  },
];

export default function GioiThieuPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      <Header />
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative w-full overflow-hidden bg-zinc-900 py-24 md:py-36 flex items-center justify-center text-center">
        {/* Decorative radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[#C59B27]/10 blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <p className="text-[#C59B27] uppercase tracking-[0.35em] text-xs md:text-sm font-semibold mb-4">
            Đẳng cấp quà tặng quý ông
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase leading-tight mb-5 tracking-wide">
            VỀ CHÚNG TÔI
          </h1>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex-1 max-w-[60px] h-px bg-[#C59B27]/60" />
            <span className="text-[#C59B27] text-base font-bold tracking-[0.3em] uppercase">
              PLOYBAY PREMIUM
            </span>
            <div className="flex-1 max-w-[60px] h-px bg-[#C59B27]/60" />
          </div>
          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl mx-auto italic">
            Lịch lãm trong từng chi tiết — Khẳng định bản lĩnh phái mạnh
          </p>
        </div>
      </section>

      {/* ===== CÂU CHUYỆN THƯƠNG HIỆU ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="flex-1 max-w-[80px] h-[2px] bg-[#C59B27]" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-widest uppercase whitespace-nowrap">
              CÂU CHUYỆN THƯƠNG HIỆU
            </h2>
            <div className="flex-1 max-w-[80px] h-[2px] bg-[#C59B27]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Text — 3 cols */}
            <div className="lg:col-span-3 space-y-5 text-gray-600 leading-[1.85] text-[15px]">
              <p>
                <span className="font-bold text-[#C59B27] text-base">
                  PLOYBAY
                </span>{" "}
                được thành lập với sứ mệnh định hình lại phong cách quà tặng phụ kiện da nam cao cấp tại Việt Nam. Chúng tôi tin rằng mỗi chiếc ví da, thắt lưng da không chỉ đơn thuần là vật dụng hàng ngày mà còn là tuyên ngôn cá nhân về phong cách, sự lịch lãm và thành công của người đàn ông.
              </p>
              <p>
                Trải qua hành trình nghiên cứu và chế tác tỉ mỉ, PLOYBAY đã từng bước khẳng định vị thế bằng dòng sản phẩm da thật 100% tinh xảo. Các set quà tặng (Giftset) phối sẵn sang trọng, chỉnh chu được chúng tôi thiết kế riêng nhằm mang đến giải pháp tặng quà hoàn hảo nhất cho quý đối tác, người thân hay chính bản thân bạn.
              </p>
              <p>
                Mỗi sản phẩm PLOYBAY trao đi đều mang theo tâm huyết chế tác cùng cam kết dịch vụ vượt trội. Từ khâu tuyển chọn chất liệu da thuộc nhập khẩu cao cấp cho đến hộp quà đóng gói chỉn chu kèm thiệp viết tay cá nhân hóa.
              </p>
              <blockquote className="border-l-4 border-[#C59B27] pl-5 py-1 text-zinc-800 font-semibold italic text-base">
                &ldquo;Đẳng cấp quà tặng quý ông — Lịch lãm trong từng chi tiết.&rdquo;
              </blockquote>
            </div>

            {/* Stats — 2 cols */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              {[
                { number: "2024", label: "Năm khởi đầu" },
                { number: "10K+", label: "Quý ông lựa chọn" },
                { number: "100+", label: "Mẫu ví & thắt lưng" },
                { number: "100%", label: "Da thật cao cấp" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-zinc-900 rounded-xl p-5 text-center hover:scale-[1.03] transition-transform duration-200"
                >
                  <div className="text-2xl md:text-3xl font-bold text-[#C59B27] mb-1">
                    {s.number}
                  </div>
                  <div className="text-white/60 text-xs uppercase tracking-wider font-medium">
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
            <div className="flex-1 max-w-[80px] h-[2px] bg-[#C59B27]" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-widest uppercase whitespace-nowrap">
              TẦM NHÌN & SỨ MỆNH
            </h2>
            <div className="flex-1 max-w-[80px] h-[2px] bg-[#C59B27]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#C59B27]/40 hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#C59B27] rounded-l-2xl" />
              <div className="w-12 h-12 rounded-lg bg-[#C59B27]/10 flex items-center justify-center mb-5 group-hover:bg-[#C59B27]/20 transition-colors">
                <Target className="w-6 h-6 text-[#C59B27]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3">
                Sứ Mệnh
              </h3>
              <p className="text-gray-500 leading-relaxed text-[15px]">
                Mang đến giải pháp quà tặng phụ kiện da nam cao cấp tinh tế và tiện dụng bậc nhất. Chúng tôi mong muốn cùng phái mạnh đồng hành trên con đường khẳng định bản lĩnh, định hình phong cách sống hiện đại và chuẩn mực.
              </p>
            </div>

            <div className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#C59B27]/40 hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-zinc-800 rounded-l-2xl" />
              <div className="w-12 h-12 rounded-lg bg-zinc-800/10 flex items-center justify-center mb-5 group-hover:bg-zinc-800/20 transition-colors">
                <Eye className="w-6 h-6 text-zinc-800" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3">
                Tầm Nhìn
              </h3>
              <p className="text-gray-500 leading-relaxed text-[15px]">
                Trở thành biểu tượng thương hiệu hàng đầu Việt Nam về quà tặng phụ kiện da nam. PLOYBAY hướng tới nâng cao tiêu chuẩn trải nghiệm quà tặng cao cấp qua các bộ giftset thủ công kết hợp hoàn mỹ giữa chất lượng, thẩm mỹ và sự trân trọng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GIÁ TRỊ CỐT LÕI ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="flex-1 max-w-[80px] h-[2px] bg-[#C59B27]" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-widest uppercase whitespace-nowrap">
              GIÁ TRỊ CỐT LÕI
            </h2>
            <div className="flex-1 max-w-[80px] h-[2px] bg-[#C59B27]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group flex flex-col items-center text-center rounded-2xl p-6 bg-[#FDFBF7] border border-gray-100 hover:bg-zinc-900 hover:border-zinc-900 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center mb-4 group-hover:bg-[#C59B27]/20 transition-colors">
                    <Icon
                      className="w-6 h-6 text-zinc-800 group-hover:text-[#C59B27] transition-colors duration-300"
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

      {/* ===== TẠI SAO CHỌN PLOYBAY ===== */}
      <section className="py-16 md:py-20 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="flex-1 max-w-[60px] h-[2px] bg-[#C59B27]" />
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase whitespace-nowrap">
              TẠI SAO CHỌN PLOYBAY?
            </h2>
            <div className="flex-1 max-w-[60px] h-[2px] bg-[#C59B27]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group flex flex-col items-center text-center rounded-2xl p-6 border border-zinc-800 bg-zinc-800/40 hover:border-[#C59B27]/60 hover:bg-zinc-800/60 transition-all duration-300"
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