"use client";

import React, { useState } from "react";
import { Search, Eye, CheckCircle, XCircle } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  phone: string;
  total: number;
  date: string;
  status: "Chờ xử lý" | "Đã giao" | "Đã hủy";
}

const initialOrders: Order[] = [
  { id: "#DH-0041", customer: "Nguyễn Thị Mai", phone: "0912345678", total: 1250000, date: "08/06/2026", status: "Đã giao" },
  { id: "#DH-0040", customer: "Trần Văn Hùng", phone: "0987654321", total: 890000, date: "08/06/2026", status: "Chờ xử lý" },
  { id: "#DH-0039", customer: "Lê Thu Hương", phone: "0905123456", total: 2100000, date: "07/06/2026", status: "Đã giao" },
  { id: "#DH-0038", customer: "Phạm Quốc Bảo", phone: "0934567890", total: 450000, date: "07/06/2026", status: "Chờ xử lý" },
  { id: "#DH-0037", customer: "Vũ Thị Lan", phone: "0976543210", total: 3600000, date: "06/06/2026", status: "Đã giao" },
];

function fmt(n: number) {
  return n.toLocaleString("vi-VN") + "₫";
}

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Tất cả");

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);
    const matchesStatus = statusFilter === "Tất cả" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: "Đã giao" | "Đã hủy") => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">Quản lý đơn hàng</h2>
        <p className="text-xs text-slate-500 mt-0.5">Theo dõi và xử lý các đơn hàng đăng ký tư vấn từ khách hàng</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mã ĐH, khách hàng, SĐT..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#6B8E23] focus:ring-1 focus:ring-[#6B8E23]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#6B8E23] focus:ring-1 focus:ring-[#6B8E23] bg-white cursor-pointer"
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Chờ xử lý">Chờ xử lý</option>
            <option value="Đã giao">Đã giao</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
        <div className="text-xs text-slate-500 font-medium self-end md:self-auto">
          Hiển thị {filteredOrders.length} trên {orders.length} đơn hàng
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Mã ĐH</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Tổng tiền</th>
                <th className="px-6 py-4">Ngày đặt</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Xử lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-700">
                    {order.id}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-800">{order.customer}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{order.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    {fmt(order.total)}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      order.status === "Đã giao"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : order.status === "Chờ xử lý"
                        ? "bg-amber-50 text-amber-600 border border-amber-100"
                        : "bg-rose-50 text-rose-600 border border-rose-100"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => alert(`Xem chi tiết đơn hàng ${order.id}`)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {order.status === "Chờ xử lý" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(order.id, "Đã giao")}
                            className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer"
                            title="Hoàn tất đơn"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(order.id, "Đã hủy")}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-500 transition-colors cursor-pointer"
                            title="Hủy đơn"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}