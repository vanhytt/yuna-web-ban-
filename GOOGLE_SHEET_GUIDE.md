# 📊 Hướng Dẫn Kết Nối Google Sheets với YUNA Web

## 🎯 Tổng Quan

Hệ thống sẽ gửi dữ liệu đơn hàng từ Form "Đăng ký tư vấn" trực tiếp vào Google Sheets thông qua Google Apps Script Webhook.

---

## 📋 Bước 1: Chuẩn Bị Google Sheet

### 1.1 Tạo Google Sheet mới
1. Truy cập [Google Sheets](https://sheets.google.com)
2. Nhấn **"+"** để tạo Spreadsheet mới
3. Đặt tên: **"YUNA Orders"** (hoặc tên khác tùy thích)
4. Bấm **"Tạo"**

### 1.2 Tạo Header (Tiêu đề Cột)
Tại dòng 1, tạo các cột sau:
- **A1**: Thời gian
- **B1**: Họ Tên
- **C1**: Số Điện Thoại
- **D1**: Địa Chỉ
- **E1**: Danh Sách Sản Phẩm
- **F1**: Tổng Tiền

Ví dụ:
```
| Thời gian | Họ Tên | Số Điện Thoại | Địa Chỉ | Danh Sách Sản Phẩm | Tổng Tiền |
|-----------|--------|---------------|--------|------------------|-----------|
```

---

## 🔧 Bước 2: Tạo Google Apps Script

### 2.1 Mở Apps Script Editor
1. Tại **Google Sheet** của bạn, nhấn **"Tiện ích mở rộng"** ⬆️
2. Chọn **"Apps Script"**
3. Một tab mới sẽ mở ra

### 2.2 Xóa Hết Code Cũ
Xóa toàn bộ code mặc định trong editor.

### 2.3 Copy-Paste Đoạn Code Dưới Đây

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Parse JSON từ request body
    const data = JSON.parse(e.postData.contents);
    
    // Lấy dữ liệu từ JSON
    const timestamp = data.timestamp || new Date().toLocaleString('vi-VN');
    const name = data.name || '';
    const phone = data.phone || '';
    const address = data.address || '';
    const productsList = data.productsList || '';
    const totalPrice = data.totalPrice ? data.totalPrice.toLocaleString('vi-VN') + '₫' : '0₫';
    
    // Append dòng mới vào sheet
    sheet.appendRow([
      timestamp,
      name,
      phone,
      address,
      productsList,
      totalPrice
    ]);
    
    // Auto-fit column width
    sheet.autoResizeColumns(1, 6);
    
    // Return response với CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Dữ liệu đã được lưu vào Google Sheets',
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader('Access-Control-Allow-Origin', '*')
      .addHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
      .addHeader('Access-Control-Allow-Headers', 'Content-Type');
      
  } catch (error) {
    Logger.log('Lỗi: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader('Access-Control-Allow-Origin', '*')
      .addHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
      .addHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
}

function doOptions(e) {
  return ContentService
    .createTextOutput()
    .addHeader('Access-Control-Allow-Origin', '*')
    .addHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    .addHeader('Access-Control-Allow-Headers', 'Content-Type');
}

    function testWebhook() {
    const testData = {
        timestamp: new Date().toLocaleString('vi-VN'),
        name: 'Nguyễn Văn A',
        phone: '0968296458',
        address: 'Hà Nội',
        productsList: 'Chảo Inox (SL: 2, Giá: 450.000₫) | Bình Đun (SL: 1, Giá: 380.000₫)',
        totalPrice: 1280000
    };
    
    const sheet = SpreadsheetApp.getActiveSheet();
    sheet.appendRow([
        testData.timestamp,
        testData.name,
        testData.phone,
        testData.address,
        testData.productsList,
        testData.totalPrice.toLocaleString('vi-VN') + '₫'
    ]);
    
    Logger.log('Test dữ liệu đã được thêm vào Sheet!');
    }
```

---

## 🚀 Bước 3: Tạo Web App Deployment

### 3.1 Deploy Code
1. Ở menu trên cùng, nhấn **"Deploy"** (hoặc ⬆️ icon)
2. Chọn **"Triển khai mới"**
3. Chọn type: **"Web App"**
4. **Execute as**: Chọn tài khoản Google của bạn
5. **Who has access**: Chọn **"Anyone"**
6. Nhấn **"Deploy"**

### 3.2 Cho Phép Quyền
- Sẽ xuất hiện popup yêu cầu quyền
- Nhấn **"Cho phép"** và xác nhận

### 3.3 Copy Webhook URL
Sau deploy, sẽ thấy:
```
Deployment ID: Abc...
Web App URL: https://script.google.com/macros/d/Abc.../usercopy
```

**Copy cái "Web App URL"** này.

---

## 🔑 Bước 4: Cấu Hình .env.local

### 4.1 Mở File `.env.local` của Project
Tại thư mục gốc (`d:\dev\yuna\yuna-web`), mở file `.env.local`

### 4.2 Cập Nhật Webhook URL
Tìm dòng:
```env
NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL=YOUR_GOOGLE_APPS_SCRIPT_WEBHOOK_URL_HERE
```

Thay thế bằng URL của bạn, ví dụ:
```env
NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/d/1BxiMVs0XRA5nxxxxxVBxxxxUkxxxxzzzz/usercopy
```

### 4.3 Lưu File

---

## ✅ Bước 5: Test Hệ Thống

### 5.1 Test Bằng Script Sẵn
Tại **Apps Script**, chạy hàm `testWebhook()`:
1. Nhấn **"Run"** (hoặc F5)
2. Chọn `testWebhook`
3. Xem dòng test xuất hiện trong Google Sheet

### 5.2 Test Từ Web
1. Khởi động dev server: `npm run dev`
2. Truy cập: `http://localhost:3000`
3. Thêm sản phẩm vào giỏ
4. Nhấn vào icon Giỏ → Nhập thông tin → Bấm "Đăng ký tư vấn"
5. Xem dữ liệu xuất hiện trong Google Sheet ✨

---

## 🐛 Troubleshooting

### Lỗi: "Webhook URL chưa được cấu hình"
- Kiểm tra file `.env.local` có `NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL` chưa?
- Restart dev server sau khi cập nhật `.env.local`

### Lỗi: "Lỗi gửi dữ liệu. Vui lòng thử lại!"
- Kiểm tra URL Webhook có đúng không?
- Kiểm tra Google Sheet có bị khóa không?
- Mở console (F12) xem chi tiết lỗi

### Dữ liệu không xuất hiện trong Sheet
1. Kiểm tra Apps Script có Deploy chưa?
2. Kiểm tra "Who has access" có phải "Anyone" không?
3. Làm mới Google Sheet (F5)
4. Xem **Execution log** trong Apps Script

---

## 📝 Ghi Chú

- **Thời gian**: Tự động lấy từ hệ thống
- **Danh sách sản phẩm**: Ghi chi tiết tên, số lượng, giá tiền
- **Tổng tiền**: Tính toán tự động từ CartContext
- **Google Sheet**: Tự động mở rộng chiều rộng cột

---

## 💡 Mở Rộng Tương Lai

Có thể thêm:
- Email notification khi có đơn hàng mới
- Gắn với Google Forms
- Tích hợp Google Chat/Slack
- Export dữ liệu thành PDF

---

**Hỏi đáp**: Nếu gặp vấn đề, kiểm tra console (F12) hoặc xem log trong Apps Script! 🎊