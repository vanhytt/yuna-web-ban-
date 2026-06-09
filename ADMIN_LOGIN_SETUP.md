# 🔐 Hướng Dẫn Đăng Nhập Admin - YUNA

## ⚡ Cách Nhanh Nhất (3 bước)

### Bước 1: Mở Supabase Dashboard
- Truy cập: https://supabase.com/dashboard
- Chọn project **riwsclivpfyzbfadhdcg**
- Bên trái → **Authentication** → **Users**

### Bước 2: Tạo User Admin
- Click nút **"Add user"** (góc trên phải)
- Chọn **"Create new user"**
- Nhập thông tin:
  ```
  Email: admin@yuna.vn
  Password: Admin@123456
  ```
- ✅ Bật **"Auto confirm user"** (để không cần verify email)
- Click **"Create user"**

### Bước 3: Đăng nhập
- Truy cập: http://localhost:3000/admin/login
- Nhập:
  - **Email**: admin@yuna.vn
  - **Mật khẩu**: Admin@123456
- Click **"Đăng nhập"**
- ✅ Thành công → Redirect vào Admin Dashboard

---

## 🎯 Chi tiết từng bước (Có Screenshot)

### 1. Đăng nhập Supabase

1. Vào https://supabase.com/login
2. Đăng nhập bằng tài khoản của bạn
3. Chọn project: **riwsclivpfyzbfadhdcg**

### 2. Vào Authentication

Trên sidebar bên trái:
```
Home
├── Project Settings
Authentication ← CLICK VÀO ĐÂY
├── Policies
├── SQL Editor
...
```

### 3. Chọn Tab "Users"

```
[Overview] [Users] [Policies] ...
           ↑
         CLICK VÀO
```

### 4. Click "Add user"

Button ở góc trên phải màu xanh dương.

### 5. Chọn "Create new user"

```
[+ Add user] (dropdown)
├── Create new user ← SELECT
└── Invite existing user
```

### 6. Điền Form

```
Email: 
[admin@yuna.vn]

Password:
[••••••••] (nhập: Admin@123456)

☑ Auto Confirm User
(PHẢI CHECKED để không verify email)
```

### 7. Click "Create user"

Chờ vài giây...

✅ User được tạo thành công!

---

## 🔑 Đăng Nhập Vào Admin

### URL trang đăng nhập
```
http://localhost:3000/admin/login
```

### Nhập Credentials
```
Email: admin@yuna.vn
Password: Admin@123456
```

### Nếu Thành Công
✅ Tự động redirect vào `/admin` → Thấy dashboard

### Nếu Thất Bại
❌ Hiển thị lỗi: "Email hoặc mật khẩu không chính xác"

**Kiểm tra:**
- Email chính xác?
- Password chính xác?
- User đã được "Auto Confirm" chưa?

---

## ⚠️ Gặp Lỗi "Email not confirmed"?

1. Vào Supabase Dashboard
2. Authentication → Users
3. Tìm user vừa tạo
4. Click vào user → Menu **"..."** (3 chấm)
5. Chọn **"Confirm email"**

Thử đăng nhập lại.

---

## 🚀 Tạo Tài Khoản Khác

Lặp lại các bước trên với email/password khác nhau:

```
Email: manager@yuna.vn      (quản lý)
Email: editor@yuna.vn       (chỉnh sửa)
Email: viewer@yuna.vn       (xem dữ liệu)
```

---

## 🔒 Bảo Mật

- **Middleware**: Tự động chặn truy cập `/admin` khi chưa đăng nhập
- **Session**: Được lưu an toàn bởi Supabase
- **Logout**: Bấm nút "Đăng xuất" ở sidebar → Redirect `/admin/login`

---

## 📝 Lưu Ý

- Tài khoản admin có quyền truy cập tất cả route `/admin/*`
- Thay đổi password trong Supabase Dashboard (Authentication → Users)
- Session sẽ tự động hết hạn sau khoảng thời gian (default: 1 giờ)

---

## 💡 Mẹo

Muốn tạo user nhanh? Copy lệnh dưới vào Terminal:

```bash
# Sử dụng Supabase CLI (nếu cài đặt)
supabase auth users create \
  --email admin@yuna.vn \
  --password Admin@123456 \
  --confirm

# Nếu chưa cài Supabase CLI, hãy dùng dashboard
```

---

**Cần giúp?** Hãy cho biết lỗi bạn gặp!