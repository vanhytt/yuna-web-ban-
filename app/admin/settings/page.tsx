"use client";

import React, { useState } from "react";
import { Save, Settings } from "lucide-react";

export default function SettingsAdminPage() {
  const [siteName, setSiteName] = useState("PLOYBAY");
  const [phone, setPhone] = useState("0977 500 651");
  const [address, setAddress] = useState("Hà Nội, Việt Nam");
  const [email, setEmail] = useState("contact@ploybay.vn");
  const [shippingFee, setShippingFee] = useState(30000);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Đã lưu các thay đổi cấu hình hệ thống thành công!");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">Cài đặt cấu hình</h2>
        <p className="text-xs text-slate-500 mt-0.5">Quản lý cấu hình chung cho website PLOYBAY</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <Settings className="w-5 h-5 text-[#C59B27]" />
            <h3 className="font-semibold text-slate-800 text-sm uppercase">Cấu hình chung</h3>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {/* Site Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Tên cửa hàng / Website
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]"
              />
            </div>

            {/* Hotline */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Hotline liên hệ
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Địa chỉ trụ sở
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email nhận thông báo đơn hàng
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]"
              />
            </div>

            {/* Default Shipping Fee */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Phí vận chuyển mặc định (VND)
              </label>
              <input
                type="number"
                value={shippingFee}
                onChange={(e) => setShippingFee(Number(e.target.value))}
                required
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#C59B27] hover:bg-[#a17b1d] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Lưu cấu hình
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}