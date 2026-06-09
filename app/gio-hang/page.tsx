'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  const handleUpdateQuantity = (id: string, action: 'plus' | 'minus') => {
    updateQuantity(id, action);
  };

  const handleRemove = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      removeFromCart(id);
    }
  };

  const handleClearCart = () => {
    if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      clearCart();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#6B8E23] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Tiếp tục mua sắm
            </Link>
          </div>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Giỏ hàng của bạn</h1>
            <p className="text-gray-600">
              {cart.length > 0
                ? `Bạn có ${cart.length} sản phẩm trong giỏ hàng`
                : 'Giỏ hàng trống'}
            </p>
          </div>

          {cart.length === 0 ? (
            /* Empty Cart State */
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Giỏ hàng trống
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Hãy khám phá các sản phẩm tuyệt vời của chúng tôi và thêm chúng vào giỏ hàng!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#6B8E23] text-white font-semibold rounded-lg hover:bg-[#5a781e] transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                Mua sắm ngay
              </Link>
            </div>
          ) : (
            /* Cart with Items */
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-4">
                {/* Clear Cart Button */}
                <div className="flex justify-end mb-2">
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    Xóa toàn bộ giỏ hàng
                  </button>
                </div>

                {/* Cart Items */}
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm p-4 md:p-6 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="relative w-full md:w-32 h-32 shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                      <Image
                        src={item.thumbnail_url}
                        alt={item.title}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/product/${item.id}`}
                          className="text-lg font-bold text-gray-800 hover:text-[#6B8E23] transition-colors line-clamp-2"
                        >
                          {item.title}
                        </Link>
                        <p className="text-xl font-extrabold text-[#D32F2F] mt-2">
                          {item.price.toLocaleString('vi-VN')}đ
                        </p>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 font-medium">
                            Số lượng:
                          </span>
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, 'minus')}
                              className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                              aria-label="Giảm số lượng"
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="px-4 py-2 text-center font-semibold min-w-[3rem]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, 'plus')}
                              className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                              aria-label="Tăng số lượng"
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Xóa sản phẩm"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Subtotal for this item */}
                      <div className="mt-2 text-right">
                        <span className="text-sm text-gray-500">Tạm tính: </span>
                        <span className="text-lg font-bold text-gray-800">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Tổng đơn hàng
                  </h2>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Tạm tính:</span>
                      <span className="font-semibold">
                        {totalPrice.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Phí vận chuyển:</span>
                      <span className="font-semibold text-green-600">Miễn phí</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                      <span className="text-lg font-bold text-gray-800">
                        Tổng cộng:
                      </span>
                      <span className="text-2xl font-extrabold text-[#D32F2F]">
                        {totalPrice.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button className="w-full py-4 bg-[#6B8E23] text-white font-bold text-lg rounded-lg hover:bg-[#5a781e] transition-colors shadow-lg shadow-[#6B8E23]/20">
                    Tiến hành thanh toán
                  </button>

                  {/* Additional Info */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 text-center">
                      <span className="font-semibold">✓</span> Miễn phí vận chuyển toàn quốc
                    </p>
                    <p className="text-xs text-gray-600 text-center mt-1">
                      <span className="font-semibold">✓</span> Hỗ trợ đổi trả trong 7 ngày
                    </p>
                    <p className="text-xs text-gray-600 text-center mt-1">
                      <span className="font-semibold">✓</span> Thanh toán an toàn & bảo mật
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}