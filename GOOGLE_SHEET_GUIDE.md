# HƯỚNG DẪN KẾT NỐI GOOGLE SHEETS BẰNG GOOGLE APPS SCRIPT

Tài liệu này hướng dẫn cách kết nối giỏ hàng trên website PLOYBAY với Google Sheets để quản lý đơn hàng tự động thông qua Google Apps Script.

---

## 1. MÃ GOOGLE APPS SCRIPT (GAS)

Mở bảng tính Google Sheets của bạn, chọn **Tiện ích mở rộng (Extensions)** > **Apps Script**, xóa toàn bộ mã mặc định và dán đoạn mã dưới đây vào:

```javascript
// Google Apps Script nhận dữ liệu đặt hàng từ website PLOYBAY
function doPost(e) {
  try {
    // Phân tích payload từ request POST
    var jsonString = e.postData.contents;
    var data = JSON.parse(jsonString);
    
    // Mở active sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // HỖ TRỢ CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (Dùng cho PayOS Webhook khi thanh toán thành công)
    if (data.action === "update_status") {
      var orderId = data.orderId || "";
      var newStatus = data.status || "";
      
      if (!orderId) {
        return ContentService.createTextOutput(JSON.stringify({
          "status": "error",
          "message": "Thiếu orderId để cập nhật!"
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      var lastRow = sheet.getLastRow();
      var foundRow = -1;
      
      if (lastRow > 1) {
        // Đọc toàn bộ cột Mã đơn hàng (Cột B - Cột thứ 2) từ dòng 2 đến dòng cuối
        var range = sheet.getRange(2, 2, lastRow - 1, 1);
        var values = range.getValues();
        
        for (var i = 0; i < values.length; i++) {
          if (String(values[i][0]).trim() === String(orderId).trim()) {
            foundRow = i + 2; // cộng 2 do mảng 0-indexed và bắt đầu từ dòng 2
            break;
          }
        }
      }
      
      if (foundRow !== -1) {
        // Cập nhật ô Trạng thái (Cột I - Cột thứ 9)
        sheet.getRange(foundRow, 9).setValue(newStatus);
        return ContentService.createTextOutput(JSON.stringify({
          "status": "success",
          "message": "Đã cập nhật trạng thái đơn hàng " + orderId + " thành: " + newStatus
        })).setMimeType(ContentService.MimeType.JSON);
      } else {
        // Nếu không tìm thấy đơn hàng gốc, tạo một dòng mới để tránh mất thông tin
        sheet.appendRow([
          new Date().toLocaleString('vi-VN'),
          orderId,
          "Khách ẩn danh (PayOS)",
          "",
          "Xem chi tiết trên cổng PayOS",
          "Thanh toán QR qua PayOS",
          data.totalPrice || 0,
          data.paymentMethod || "payOS QR",
          newStatus
        ]);
        return ContentService.createTextOutput(JSON.stringify({
          "status": "success",
          "message": "Không tìm thấy đơn hàng gốc, đã tự động append dòng mới cho đơn " + orderId
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // TẠO ĐƠN HÀNG MỚI (MẶC ĐỊNH)
    var timestamp = data.timestamp || new Date().toLocaleString('vi-VN');
    var orderId = data.orderId || "";
    var name = data.name || "";
    var phone = data.phone || "";
    var address = data.address || "";
    var productsList = data.productsList || "";
    var totalPrice = data.totalPrice ? Number(data.totalPrice) : 0;
    var paymentMethod = data.paymentMethod || "";
    var status = data.status || "Chờ xác nhận";
    
    // Thêm dòng mới vào Google Sheets
    // Thứ tự các cột: [Thời gian, Mã đơn hàng, Tên khách hàng, SĐT, Địa chỉ, Sản phẩm, Tổng tiền, PTTT, Trạng thái]
    sheet.appendRow([
      timestamp,
      orderId,
      name,
      "'" + phone, // Thêm dấu nháy đơn để Google Sheets không làm mất số 0 ở đầu SĐT
      address,
      productsList,
      totalPrice,
      paymentMethod,
      status
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      "status": "success",
      "message": "Đơn hàng " + orderId + " đã được ghi nhận thành công!"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error",
      "message": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm test thử cấu trúc ghi dữ liệu trực tiếp trong Apps Script console
function testAppend() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([
    new Date().toLocaleString('vi-VN'),
    "PB-12345",
    "Khách hàng Test",
    "'0987654321",
    "123 Đường Test, Quận 1, TP. HCM",
    "Sản phẩm Test (SL: 1, Giá: 100.000₫)",
    100000,
    "COD",
    "Chờ xác nhận"
  ]);
}
```

---

## 2. CÁC BƯỚC DEPLOY APPS SCRIPT DƯỚI DẠNG "WEB APP"

Để website có thể gửi yêu cầu `POST` đến Google Sheet, bạn cần xuất bản script dưới dạng ứng dụng Web công khai theo các bước sau:

1. **Đặt tên cho dự án Apps Script**: Thay đổi chữ "Dự án không có tiêu đề" thành `PLOYBAY Order Webhook`.
2. **Lưu dự án**: Bấm biểu tượng nút **Lưu (Save - hình đĩa mềm)** hoặc nhấn `Ctrl + S`.
3. **Triển khai (Deploy)**: 
   - Nhấn nút **Triển khai (Deploy)** ở góc trên bên phải > Chọn **Triển khai mới (New deployment)**.
   - Bấm vào biểu tượng bánh răng **Loại triển khai (Select type)** > Chọn **Ứng dụng web (Web app)**.
4. **Cấu hình Web App**:
   - **Mô tả (Description)**: Nhập gì đó tùy ý, ví dụ: `v1.0.0`.
   - **Thực thi dưới dạng (Execute as)**: Chọn **Tôi (Email của bạn)**.
   - **Ai có quyền truy cập (Who has access)**: Chọn **Bất kỳ ai (Anyone)**. *(Lưu ý: Bắt buộc chọn "Bất kỳ ai" thì API từ website mới có quyền gửi đơn mà không bị lỗi xác thực)*.
5. **Tiến hành Deploy**:
   - Nhấn nút **Triển khai (Deploy)**.
   - Google sẽ yêu cầu cấp quyền truy cập tài khoản (Authorize Access). Hãy nhấn **Ủy quyền truy cập (Authorize Access)**.
   - Chọn tài khoản Google của bạn.
   - Nếu có cảnh báo *"Google chưa xác minh ứng dụng này"*, nhấn vào chữ **Nâng cao (Advanced)** ở góc dưới bên trái > Chọn **Đi tới PLOYBAY Order Webhook (Không an toàn) / Go to PLOYBAY Order Webhook (unsafe)**.
   - Bấm **Cho phép (Allow)**.
6. **Sao chép URL Webhook**:
   - Sau khi hoàn thành, Google sẽ cấp cho bạn một **URL Ứng dụng web (Web app URL)** có định dạng dạng như:
     `https://script.google.com/macros/s/AKfycb.../exec`
   - Bấm **Sao chép (Copy)** URL này.

---

## 3. CẤU HÌNH TRÊN WEB CODE (FILE .ENV)

1. Mở file cấu hình môi trường `.env` hoặc `.env.local` ở thư mục gốc của dự án.
2. Thêm hoặc cập nhật biến môi trường `NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL` với URL đã sao chép ở trên:

```env
NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/AKfycb.../exec"
```

3. Khởi động lại Server hoặc Build lại ứng dụng để Next.js cập nhật biến môi trường mới:
   ```bash
   npm run dev
   ```

---

## 4. CẤU TRÚC TIÊU ĐỀ BẢNG TÍNH GOOGLE SHEETS KHUYÊN DÙNG

Tại dòng số 1 của trang tính, hãy chuẩn bị các cột theo đúng thứ tự sau:

| A (Cột 1) | B (Cột 2) | C (Cột 3) | D (Cột 4) | E (Cột 5) | F (Cột 6) | G (Cột 7) | H (Cột 8) | I (Cột 9) |
|---|---|---|---|---|---|---|---|---|
| **Thời gian** | **Mã đơn hàng** | **Tên khách hàng** | **SĐT** | **Địa chỉ** | **Sản phẩm** | **Tổng tiền** | **PTTT** | **Trạng thái** |