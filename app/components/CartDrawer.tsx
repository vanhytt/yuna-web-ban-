"use client";

import Image from "next/image";
import { X, ShoppingBag, Minus, Plus, Trash2, Tag, Loader2, Check } from "lucide-react";
import { useState } from "react";
import { getProductImage } from "../../lib/supabase";
import { useCart } from "../context/CartContext";

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
}


function fmt(n: number) {
  return n.toLocaleString("vi-VN") + "₫";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: Props) {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [coupon, setCoupon] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRegisterConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !address) {
      setToastMessage({ type: 'error', text: 'Vui lòng điền đầy đủ thông tin!' });
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (cart.length === 0) {
      setToastMessage({ type: 'error', text: 'Giỏ hàng trống! Vui lòng thêm sản phẩm.' });
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setLoading(true);

    try {
      const cartData = cart.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      }));

      const orderData = {
        timestamp: new Date().toLocaleString('vi-VN'),
        name,
        phone,
        address,
        products: cartData,
        totalPrice,
        productsList: cart.map(item => `${item.title} (SL: ${item.quantity}, Giá: ${item.price.toLocaleString('vi-VN')}₫)`).join(' | '),
      };

      // Gọi API route thay vì trực tiếp gọi Google Apps Script (tránh CORS)
      const response = await fetch('/api/webhook/sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      setToastMessage({ type: 'success', text: 'Đăng ký tư vấn thành công! YUNA Vietnam sẽ liên hệ bạn trong giây lát.' });
      
      setTimeout(() => {
        clearCart();
        setName("");
        setPhone("");
        setAddress("");
        setToastMessage(null);
        onClose();
      }, 2000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('Lỗi gửi dữ liệu:', errorMsg);
      
      let displayMsg = 'Lỗi gửi dữ liệu!';
      if (errorMsg.includes('chưa được cấu hình')) {
        displayMsg = 'Webhook URL chưa được cấu hình. Xem GOOGLE_SHEET_GUIDE.md!';
      } else if (errorMsg.includes('timeout')) {
        displayMsg = 'Timeout kết nối. Thử lại!';
      } else if (errorMsg.includes('404')) {
        displayMsg = 'API endpoint không tìm thấy.';
      }
      
      setToastMessage({ type: 'error', text: displayMsg });
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-[60] p-4 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in duration-300 max-w-sm ${
          toastMessage.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {toastMessage.type === 'success' ? (
            <Check className="w-5 h-5 shrink-0" />
          ) : (
            <span className="text-lg font-bold shrink-0">!</span>
          )}
          <span className="text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[400px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
         <div className="flex items-center gap-2">
             <ShoppingBag className="w-5 h-5 text-[#6B8E23]" />
             <h2 className="font-bold text-gray-900 text-base uppercase tracking-wide">
               Giỏ hàng
             </h2>
             <span className="bg-[#6B8E23] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
               {cart.reduce((s, it) => s + it.quantity, 0)}
             </span>
           </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

         {/* Items */}
         <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
           {cart.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full text-center py-16">
               <ShoppingBag className="w-14 h-14 text-gray-200 mb-3" />
               <p className="text-gray-400 text-sm">Giỏ hàng đang trống</p>
             </div>
           ) : (
             <>
               <div className="space-y-4">
                 {cart.map((item) => (
                   <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-50">
                     <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-50">
                       <Image
                         src={item.thumbnail_url}
                         alt={item.title}
                         fill
                         sizes="64px"
                         className="object-contain"
                         unoptimized
                       />
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                         {item.title}
                       </p>
                       <p className="text-[#C59B27] font-bold text-sm mt-1">{fmt(item.price)}</p>
                       <div className="flex items-center justify-between mt-2">
                         <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                           <button
                             onClick={() => updateQuantity(item.id, 'minus')}
                             className="px-2 py-1 hover:bg-gray-100 transition-colors font-sans"
                           >
                             <Minus className="w-3 h-3" />
                           </button>
                           <span className="px-2 text-sm font-bold text-gray-800 font-sans">
                             {item.quantity}
                           </span>
                           <button
                             onClick={() => updateQuantity(item.id, 'plus')}
                             className="px-2 py-1 hover:bg-gray-100 transition-colors font-sans"
                           >
                             <Plus className="w-3 h-3" />
                           </button>
                         </div>
                         <button
                           onClick={() => removeFromCart(item.id)}
                           className="p-1 text-gray-300 hover:text-red-400 transition-colors"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>

              {/* Customer Info Form */}
              <form onSubmit={handleRegisterConsultation} className="pt-4 border-t border-gray-100 space-y-4 font-sans">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Thông tin khách hàng
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B8E23] focus:ring-1 focus:ring-[#6B8E23]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ví dụ: 0968296458"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B8E23] focus:ring-1 focus:ring-[#6B8E23]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Địa chỉ nhận hàng <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Ví dụ: Số 12, Ngõ 34, Phố Huế, Hai Bà Trưng, Hà Nội"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B8E23] focus:ring-1 focus:ring-[#6B8E23] resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#6B8E23] hover:bg-[#5a781e] disabled:bg-gray-400 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <span>Đăng ký tư vấn</span>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

         {/* Footer */}
         {cart.length > 0 && (
           <div className="px-5 py-4 border-t border-gray-100 space-y-3 font-sans">
             {/* Coupon */}
             <div className="flex gap-2">
               <div className="relative flex-1">
                 <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                 <input
                   type="text"
                   value={coupon}
                   onChange={(e) => setCoupon(e.target.value)}
                   placeholder="Nhập mã giảm giá"
                   className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B8E23] focus:ring-1 focus:ring-[#6B8E23]"
                 />
               </div>
               <button className="px-4 py-2.5 bg-[#6B8E23]/10 text-[#6B8E23] font-semibold text-sm rounded-lg hover:bg-[#6B8E23]/20 transition-colors whitespace-nowrap cursor-pointer">
                 Áp dụng
               </button>
             </div>

             {/* Total */}
             <div className="flex items-center justify-between py-2">
               <span className="text-gray-500 text-sm">Tổng cộng:</span>
               <span className="text-xl font-bold text-[#C59B27]">{fmt(totalPrice)}</span>
             </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 border border-gray-200 text-gray-500 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        )}
      </div>
    </>
  );
}