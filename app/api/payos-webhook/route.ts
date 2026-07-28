import { NextRequest, NextResponse } from "next/server";
import { getPayOS } from "../../../lib/payos";

// payOS gửi webhook với phương thức POST khi có giao dịch
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Xác thực chữ ký webhook từ payOS bằng CHECKSUM_KEY
    let webhookData;
    try {
      webhookData = await getPayOS().webhooks.verify(body);
    } catch {
      console.error("payOS webhook signature invalid:", body);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Chỉ xử lý khi code === "00" (giao dịch thành công)
    const isSuccess = body.code === "00" && body.success === true;
    if (!isSuccess) {
      // Có thể là webhook test hoặc giao dịch thất bại — bỏ qua, trả 200 để payOS không retry
      return NextResponse.json({ status: "ignored", desc: body.desc });
    }

    const { orderCode, amount, description } = webhookData;

    // Lấy metadata đơn hàng từ description (dạng "SWxxxxxx")
    // Phần thông tin chi tiết KH (tên, SĐT, địa chỉ, sản phẩm) được lưu tạm
    // ở phía client và gửi kèm qua header X-Order-Meta nếu có,
    // hoặc lấy từ payOS paymentLink nếu đã lưu buyerName, buyerPhone, buyerAddress.

    // Lấy thông tin đơn từ payOS (đã lưu khi tạo link)
    let buyerName = "";
    let buyerPhone = "";
    let buyerAddress = "";
    let productsList = "";

    try {
      const paymentLink = await getPayOS().paymentRequests.get(orderCode);
      // payOS trả về PaymentLink không có buyerName trực tiếp trong get()
      // nên ta đọc thêm metadata từ header hoặc description
      void paymentLink; // sử dụng để tránh lỗi unused variable
    } catch {
      // Bỏ qua nếu không lấy được chi tiết
    }

    // Chuẩn bị payload cập nhật trạng thái gửi về Google Sheet
    const sheetPayload = {
      action: "update_status",
      orderId: description || `SW${orderCode}`,
      status: "ĐÃ THANH TOÁN (Tiền đã về)",
      totalPrice: amount,
      paymentMethod: "payOS QR",
    };

    // Đẩy về Google Sheets qua webhook nội bộ
    const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL;
    if (webhookUrl && !webhookUrl.includes("YOUR_GOOGLE_APPS_SCRIPT")) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sheetPayload),
        });
      } catch (sheetError) {
        console.error("Lỗi gửi dữ liệu Google Sheet:", sheetError);
        // Không throw — vẫn trả 200 cho payOS để tránh retry loop
      }
    }

    // Trả về response thành công đúng chuẩn của payOS và yêu cầu của người dùng
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lỗi xử lý payOS webhook:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// payOS cũng dùng GET để xác thực webhook URL khi đăng ký
export async function GET() {
  return NextResponse.json({ status: "ok", service: "Swordsman payOS Webhook" });
}
