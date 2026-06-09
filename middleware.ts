import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cho phép truy cập /admin/login mà không cần kiểm tra
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Middleware đơn giản: chỉ cho phép route /admin nếu có session token trong cookie
  // (Session được lưu bởi client-side khi login thành công)
  if (pathname.startsWith("/admin")) {
    // Kiểm tra xem có session cookie từ Supabase không
    const sessionCookie = request.cookies.get("sb-session");
    
    // Nếu không có cookie và không phải login page, redirect về login
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
