import { NextRequest, NextResponse } from "next/server";
import { getPayOS } from "../../../lib/payos";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, phone, address, products, totalPrice } = body;

    if (!name || !phone || !address || !products || !totalPrice) {
      return NextResponse.json(
        { error: "Thiếu thông tin đơn hàng" },
        { status: 400 }
      );
    }

    // Tạo orderCode dạng số nguyên duy nhất (6 chữ số cuối của timestamp + random)
    const orderCode = Number(
      String(Date.now()).slice(-6) + String(Math.floor(Math.random() * 100)).padStart(2, "0")
    );

    // Lấy domain động từ request header origin hoặc biến môi trường
    const origin = request.headers.get("origin");
    const domain = origin || process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";

    // Chuẩn bị items cho payOS (tên, số lượng, giá)
    const items = (products as { title: string; quantity: number; price: number }[]).map(
      (item) => ({
        name: item.title.length > 256 ? item.title.slice(0, 253) + "..." : item.title,
        quantity: item.quantity,
        price: item.price,
      })
    );

    // Tạo description (tối đa 25 ký tự cho payOS)
    const description = `PB${orderCode}`;

    // Tạo sản phẩm hiển thị trên Google Sheet
    const calculatedProductsList = body.productsList || (products as { title: string; quantity: number; price: number }[]).map(
      (item: any) => `${item.title} (SL: ${item.quantity}, Giá: ${item.price.toLocaleString('vi-VN')}₫)`
    ).join(' | ');

    // Gửi thông tin đơn hàng sang Google Sheets với trạng thái "Chờ thanh toán QR" trước khi thanh toán thành công
    const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL;
    if (webhookUrl && !webhookUrl.includes("YOUR_GOOGLE_APPS_SCRIPT")) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timestamp: new Date().toLocaleString("vi-VN"),
            orderId: description,
            name: name.trim(),
            phone: phone.trim(),
            address: address.trim(),
            productsList: calculatedProductsList,
            totalPrice: totalPrice,
            paymentMethod: "payOS QR",
            status: "Chờ thanh toán QR"
          }),
        });
      } catch (sheetError) {
        console.error("Lỗi gửi dữ liệu Google Sheet khi tạo link thanh toán:", sheetError);
      }
    }

    const paymentLinkResponse = await getPayOS().paymentRequests.create({
      orderCode,
      amount: totalPrice,
      description: description.length > 25 ? description.slice(0, 25) : description,
      cancelUrl: `${domain}/gio-hang?cancelled=true`,
      returnUrl: `${domain}/thank-you?orderCode=${orderCode}`,
      items,
      buyerName: name,
      buyerPhone: phone,
      buyerAddress: address,
    });

    return NextResponse.json({
      status: "success",
      checkoutUrl: paymentLinkResponse.checkoutUrl,
      orderCode,
      paymentLinkId: paymentLinkResponse.paymentLinkId,
      qrCode: paymentLinkResponse.qrCode,
    });
  } catch (error) {
    console.error("Lỗi tạo link thanh toán payOS:", error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: errorMsg || "Lỗi tạo link thanh toán" },
      { status: 500 }
    );
  }
}