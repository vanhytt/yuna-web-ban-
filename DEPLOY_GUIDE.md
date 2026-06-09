# 📘 Hướng Dẫn Deploy Lên Vercel

Bản hướng dẫn chi tiết để deploy dự án YUNA Next.js lên Vercel.

---

## 📋 Checklist Chuẩn Bị Trước Deploy

- [x] Kiểm tra build local (`npm run build`)
- [x] Xóa file `.env.local` trước push lên GitHub
- [x] Tạo file `.env.example` (✓ Đã có)
- [ ] Push code lên GitHub
- [ ] Tạo dự án trên Vercel
- [ ] Cấu hình Environment Variables

---

## 🚀 Các Bước Deploy

### **Bước 1: Chuẩn Bị Code Trên Local**

#### 1.1. Kiểm tra Build
```bash
npm run build
```
✅ Nếu thấy "✓ Build successful", tiếp tục bước 2
❌ Nếu có lỗi, xem phần "Khắc Phục Lỗi Build" ở cuối file

#### 1.2. Loại Bỏ File Môi Trường Nhạy Cảm
```bash
git rm --cached .env.local
echo ".env.local" >> .gitignore
```

#### 1.3. Commit Và Push Lên GitHub
```bash
# Kiểm tra trạng thái
git status

# Stage tất cả các thay đổi
git add .

# Commit với message rõ ràng
git commit -m "chore: prepare for Vercel deployment"

# Push lên GitHub (nhánh chính)
git push origin main
# hoặc nếu dùng master:
# git push origin master
```

---

### **Bước 2: Import Dự Án Trên Vercel**

#### 2.1. Truy Cập Vercel
- Mở: https://vercel.com
- Đăng nhập với GitHub account

#### 2.2. Tạo Project Mới
1. Click **"Add New"** → **"Project"**
2. Chọn repository `yuna-web` từ danh sách
3. Vercel sẽ tự nhận diện Next.js framework

#### 2.3. Cấu Hình Build Settings
- **Framework Preset**: Next.js (tự động)
- **Build Command**: `npm run build` (mặc định)
- **Output Directory**: `.next` (mặc định)
- **Install Command**: `npm ci` (mặc định)

---

### **Bước 3: Cấu Hình Environment Variables**

#### 3.1. Thêm Biến Môi Trường
Trên trang Project Settings của Vercel:
1. Mở tab **"Environment Variables"**
2. Thêm từng biến sau:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `your_supabase_url` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your_supabase_key` |
| `NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL` | `your_webhook_url` |

#### 3.2. Cách Lấy Giá Trị
**Supabase URL & Key:**
- Mở: https://supabase.com/dashboard
- Chọn Project → Settings → API
- Copy `Project URL` và `anon (public)` key

**Google Sheets Webhook:**
- Mở: https://script.google.com (nếu đã tạo)
- Deploy → Lấy URL từ deployment mới nhất

#### 3.3. Lưu Và Áp Dụng
- Sau khi thêm xong, click **"Save"**
- Vercel sẽ **tự động rebuild** với biến mới

---

### **Bước 4: Kiểm Tra Deployment**

#### 4.1. Xem Build Log
- Trên Vercel Dashboard, bấm vào deployment
- Xem tab **"Deployments"** → **"Logs"**

#### 4.2. Test Website
- URL mặc định: `https://yuna-web.vercel.app`
- Hoặc domain custom nếu đã setup
- Test các tính năng chính:
  - [ ] Trang chủ load bình thường
  - [ ] Giỏ hàng hoạt động
  - [ ] Admin panel có thể truy cập
  - [ ] API Supabase kết nối OK
  - [ ] Google Sheets sync hoạt động

---

## 🔧 Khắc Phục Lỗi Build Thường Gặp

### Lỗi 1: "Cannot find module"
**Nguyên nhân**: Import sai đường dẫn
**Giải pháp**:
```bash
npm install  # Cài lại dependencies
npm run build  # Build lại
```

### Lỗi 2: "TypeScript error"
**Nguyên nhân**: Type checking thất bại
**Giải pháp**:
```bash
npm run type-check  # Kiểm tra type
# Sửa các lỗi type được liệt kê
```

### Lỗi 3: "Environment variable not found"
**Nguyên nhân**: Thiếu biến môi trường trên Vercel
**Giải pháp**:
- Kiểm tra lại file `.env.example`
- Đảm bảo tất cả biến đã được thêm vào Vercel
- Trigger rebuild sau khi thêm biến

### Lỗi 4: "Build failed after 15 minutes"
**Nguyên nhân**: Build quá chậm (thường do dependencies quá lớn)
**Giải pháp**:
- Tối ưu `next.config.ts`
- Kiểm tra unused dependencies
- Xóa folder `node_modules` và cài lại: `npm ci`

---

## 📝 Tệp Cấu Hình Quan Trọng

| File | Mục Đích |
|------|----------|
| `.env.example` | Danh sách biến môi trường mẫu |
| `.env.local` | ⚠️ KHÔNG push lên GitHub (để trống) |
| `next.config.ts` | Cấu hình Next.js build |
| `package.json` | Dependencies & scripts |
| `tsconfig.json` | TypeScript configuration |

---

## 🎯 Domain Custom (Optional)

Nếu muốn dùng domain riêng:
1. Trên Vercel Dashboard → Settings → Domains
2. Thêm domain mới
3. Cập nhật DNS settings tại nhà cung cấp domain
4. Chờ ~24h để DNS propagate

---

## 📞 Hỗ Trợ

| Vấn Đề | Liên Hệ |
|--------|---------|
| Lỗi Vercel | https://vercel.com/docs |
| Lỗi Supabase | https://supabase.com/docs |
| Lỗi Next.js | https://nextjs.org/docs |

---

## ✅ Checklist Hoàn Thành

Sau khi deploy thành công, kiểm tra:
- [ ] Website load bình thường
- [ ] Không có lỗi trong browser console (F12)
- [ ] Có thể thêm sản phẩm vào giỏ
- [ ] Admin login hoạt động
- [ ] Đơn hàng sync vào Google Sheets
- [ ] Mobile responsive OK

---

**Chúc mừng! 🎉 Dự án của bạn đã live trên Vercel!**