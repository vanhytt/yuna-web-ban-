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

    const domain = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";

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