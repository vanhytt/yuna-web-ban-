-- ================================================
-- YUNA Videos & Reviews Setup Script
-- ================================================

-- 1. Tạo bảng videos (lưu video reviews sản phẩm)
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    url TEXT NOT NULL, -- YouTube/TikTok URL
    thumbnail_url TEXT,
    description TEXT,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    view_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tạo bảng reviews_videos (alternative naming nếu cần)
CREATE TABLE IF NOT EXISTS public.reviews_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    description TEXT,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    reviewer_name TEXT,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Thêm indexes để tăng performance
CREATE INDEX IF NOT EXISTS idx_videos_product_id ON public.videos(product_id);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON public.videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_videos_product_id ON public.reviews_videos(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_videos_created_at ON public.reviews_videos(created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews_videos ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies nếu có (để tránh conflict)
DROP POLICY IF EXISTS "Allow anonymous read access" ON public.videos;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.videos;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.videos;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.videos;

DROP POLICY IF EXISTS "Allow anonymous read access" ON public.reviews_videos;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.reviews_videos;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.reviews_videos;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.reviews_videos;

-- 6. RLS Policies cho bảng videos
-- Cho phép mọi người đọc (kể cả anonymous)
CREATE POLICY "Allow anonymous read access"
    ON public.videos
    FOR SELECT
    USING (true);

-- Chỉ authenticated users (Admin) mới được insert
CREATE POLICY "Allow authenticated insert"
    ON public.videos
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Chỉ authenticated users (Admin) mới được update
CREATE POLICY "Allow authenticated update"
    ON public.videos
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Chỉ authenticated users (Admin) mới được delete
CREATE POLICY "Allow authenticated delete"
    ON public.videos
    FOR DELETE
    TO authenticated
    USING (true);

-- 7. RLS Policies cho bảng reviews_videos
-- Cho phép mọi người đọc (kể cả anonymous)
CREATE POLICY "Allow anonymous read access"
    ON public.reviews_videos
    FOR SELECT
    USING (true);

-- Chỉ authenticated users (Admin) mới được insert
CREATE POLICY "Allow authenticated insert"
    ON public.reviews_videos
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Chỉ authenticated users (Admin) mới được update
CREATE POLICY "Allow authenticated update"
    ON public.reviews_videos
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Chỉ authenticated users (Admin) mới được delete
CREATE POLICY "Allow authenticated delete"
    ON public.reviews_videos
    FOR DELETE
    TO authenticated
    USING (true);

-- 8. Insert sample data (optional - có thể xóa nếu không cần)
INSERT INTO public.videos (title, url, thumbnail_url, description, is_featured)
VALUES 
    ('Review Chảo Inox YUNA - Siêu bền, không dính', 
     'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 
     'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
     'Đánh giá chi tiết chảo inox cao cấp YUNA',
     true),
    ('Hướng dẫn sử dụng nồi áp suất YUNA', 
     'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 
     'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
     'Video hướng dẫn sử dụng nồi áp suất an toàn',
     true),
    ('Review bình đựng nước giữ nhiệt YUNA', 
     'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 
     'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
     'Test giữ nhiệt 24h với bình YUNA',
     false)
ON CONFLICT DO NOTHING;

-- 9. Tạo function tự động update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Tạo triggers cho auto-update timestamp
DROP TRIGGER IF EXISTS update_videos_updated_at ON public.videos;
CREATE TRIGGER update_videos_updated_at
    BEFORE UPDATE ON public.videos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_videos_updated_at ON public.reviews_videos;
CREATE TRIGGER update_reviews_videos_updated_at
    BEFORE UPDATE ON public.reviews_videos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- DONE! Copy đoạn SQL này vào Supabase SQL Editor và chạy
-- ================================================