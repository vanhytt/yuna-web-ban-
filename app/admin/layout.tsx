"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import {
  LayoutDashboard,
  Package,
  FileText,
  Settings,
  ChevronLeft,
  Menu,
  LogOut,
  Loader2,
} from "lucide-react";

const navItems = [
  { href: "/admin/products", label: "Quản lý sản phẩm", icon: Package },
  { href: "/admin/posts", label: "Quản lý bài viết", icon: FileText },
  { href: "/admin/settings", label: "Cài đặt", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      // Xóa session cookie
      document.cookie = "sb-session=; path=/; max-age=0;";
      
      await supabase.auth.signOut();
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-slate-100">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-16" : "w-64"
        } bg-slate-900 text-white flex flex-col transition-all duration-300 ease-in-out shrink-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-700">
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-widest text-white">
                Swordsman
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest -mt-0.5">
                Admin Panel
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors ml-auto cursor-pointer"
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <Menu className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                      isActive
                        ? "bg-[#C59B27] text-white"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {!collapsed && (
                      <span className="text-sm font-medium truncate">
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

         {/* Sidebar Footer */}
         <div className="border-t border-slate-700 p-3">
           <button
             onClick={handleLogout}
             disabled={loggingOut}
             className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
             title={collapsed ? "Đăng xuất" : undefined}
           >
             {loggingOut ? (
               <Loader2 className="w-5 h-5 shrink-0 animate-spin" />
             ) : (
               <LogOut className="w-5 h-5 shrink-0" />
             )}
             {!collapsed && (
               <span className="text-sm font-medium">
                 {loggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
               </span>
             )}
           </button>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-100 min-h-screen overflow-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-sm text-slate-500">
            Admin /{" "}
            <span className="text-slate-800 font-semibold">
              {navItems.find((i) => pathname.startsWith(i.href))?.label ?? "Trang quản trị"}
            </span>
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C59B27] flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <span className="text-sm text-slate-700 font-medium hidden sm:block">
              Admin Swordsman
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}