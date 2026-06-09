-- Hướng dẫn: Sao chép và dán toàn bộ nội dung file này vào Supabase SQL Editor để tạo bảng.

-- 1. Tạo bảng Products (Sản phẩm)
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    image TEXT,
    category TEXT,
    description TEXT,
    video_url TEXT,
    status TEXT DEFAULT 'Còn hàng',
    rating NUMERIC DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Tạo bảng Posts (Bài viết/Tin tức)
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    thumbnail TEXT,
    category TEXT DEFAULT 'Mẹo nhà bếp',
    author TEXT DEFAULT 'Yuna Editor',
    status TEXT DEFAULT 'Công khai',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Bật Row Level Security (RLS) cho các bảng (Tùy chọn, ở đây tắt để test nhanh hoặc mở policy công khai)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
-- Nếu bảng video đã tồn tại, thêm cột thumbnail_url để lưu ảnh cover của video review
ALTER TABLE reviews_videos ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
-- Tạo policy cho phép tất cả mọi người đọc dữ liệu
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on posts" ON posts FOR SELECT USING (true);

-- Tạo policy cho phép tất cả mọi người thao tác dữ liệu (để test từ admin)
CREATE POLICY "Allow all access on products for admin" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access on posts for admin" ON posts FOR ALL USING (true) WITH CHECK (true);

-- Chèn dữ liệu mẫu cho bảng Products
INSERT INTO products (name, price, original_price, image, category, description, video_url, status, rating, reviews_count)
VALUES 
('Robot hút bụi thông minh YUNA X10 Pro', 5950000, 8500000, 'https://images.unsplash.com/photo-1618134278327-a39709ec7414?auto=format&fit=crop&w=400&q=80', 'Gia dụng thông minh', 'Robot hút bụi thông minh tự động lau dọn', 'https://www.tiktok.com', 'Còn hàng', 5, 124),
('Máy lọc không khí YUNA Pure Air 5', 2940000, 4200000, 'https://images.unsplash.com/photo-1601628768048-9343f5eabfe0?auto=format&fit=crop&w=400&q=80', 'Gia dụng thông minh', 'Máy lọc không khí mang lại bầu không khí trong lành', '', 'Còn hàng', 4.8, 89),
('Nồi chiên không dầu đa năng YUNA 6.5L', 1990000, 3100000, 'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&w=400&q=80', 'Gia dụng nhà bếp', 'Nồi chiên không dầu đa năng cho gia đình', 'https://www.shopee.vn', 'Còn hàng', 4.9, 215);

-- Chèn dữ liệu mẫu cho bảng Posts
INSERT INTO posts (title, content, thumbnail, category, author, status)
VALUES
('5 LÝ DO CHẢO INOX ĐƯỢC ƯA CHUỘNG?', 'Nội dung chi tiết về chảo inox được ưa chuộng...', 'https://images.unsplash.com/photo-1584990347449-a2d4c2b68783?w=400&q=80', 'Mẹo nhà bếp', 'Yuna Editor', 'Công khai'),
('MẸO GIỮ ĐỒ GIA DỤNG LUÔN SÁNG BÓNG', 'Nội dung chi tiết về mẹo giữ đồ gia dụng...', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80', 'Chăm sóc gia đình', 'Yuna Editor', 'Công khai'),
('90% GIA ĐÌNH VẪN ĐANG DÙNG CHẢO CHỐNG DÍNH BỊ TRẦY MÀ KHÔNG BIẾT ĐIỀU NÀY', 'Nội dung cảnh báo về chảo chống dính trầy xước...', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80', 'Cảnh báo sức khỏe', 'Admin Yuna', 'Công khai');