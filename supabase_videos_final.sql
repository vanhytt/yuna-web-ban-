-- ================================================
-- YUNA Videos & Reviews Setup (FINAL VERSION)
-- ================================================

-- 1. Tạo bảng videos (lưu video reviews sản phẩm)
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    description TEXT,
    product_id INTEGER REFERENCES public.products(id) ON DELETE SET NULL,
    view_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tạo bảng reviews_videos
CREATE TABLE IF NOT EXISTS public.reviews_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    description TEXT,
    product_id INTEGER REFERENCES public.products(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    reviewer_name TEXT,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_videos_product_id ON public.videos(product_id);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON public.videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_videos_product_id ON public.reviews_videos(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_videos_created_at ON public.reviews_videos(created_at DESC);

-- 4. Enable RLS
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews_videos ENABLE ROW LEVEL SECURITY;

-- 5. Drop old policies
DROP POLICY IF EXISTS "videos_anon_read" ON public.videos;
DROP POLICY IF EXISTS "videos_auth_insert" ON public.videos;
DROP POLICY IF EXISTS "videos_auth_update" ON public.videos;
DROP POLICY IF EXISTS "videos_auth_delete" ON public.videos;
DROP POLICY IF EXISTS "reviews_videos_anon_read" ON public.reviews_videos;
DROP POLICY IF EXISTS "reviews_videos_auth_insert" ON public.reviews_videos;
DROP POLICY IF EXISTS "reviews_videos_auth_update" ON public.reviews_videos;
DROP POLICY IF EXISTS "reviews_videos_auth_delete" ON public.reviews_videos;

-- 6. RLS Policies for videos
CREATE POLICY "videos_anon_read"
    ON public.videos FOR SELECT USING (true);

CREATE POLICY "videos_auth_insert"
    ON public.videos FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "videos_auth_update"
    ON public.videos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "videos_auth_delete"
    ON public.videos FOR DELETE TO authenticated USING (true);

-- 7. RLS Policies for reviews_videos
CREATE POLICY "reviews_videos_anon_read"
    ON public.reviews_videos FOR SELECT USING (true);

CREATE POLICY "reviews_videos_auth_insert"
    ON public.reviews_videos FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "reviews_videos_auth_update"
    ON public.reviews_videos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "reviews_videos_auth_delete"
    ON public.reviews_videos FOR DELETE TO authenticated USING (true);

-- 8. Insert sample videos
INSERT INTO public.videos (title, url, thumbnail_url, description, is_featured)
SELECT 'Review Chảo Inox YUNA - Siêu bền, không dính', 
       'https://www.youtube.com/embed/dQw4w9WgXcQ', 
       'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
       'Đánh giá chi tiết chảo inox cao cấp YUNA',
       true
WHERE NOT EXISTS (SELECT 1 FROM public.videos WHERE title = 'Review Chảo Inox YUNA - Siêu bền, không dính');

INSERT INTO public.videos (title, url, thumbnail_url, description, is_featured)
SELECT 'Hướng dẫn sử dụng nồi áp suất YUNA', 
       'https://www.youtube.com/embed/dQw4w9WgXcQ', 
       'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
       'Video hướng dẫn sử dụng nồi áp suất an toàn',
       true
WHERE NOT EXISTS (SELECT 1 FROM public.videos WHERE title = 'Hướng dẫn sử dụng nồi áp suất YUNA');

INSERT INTO public.videos (title, url, thumbnail_url, description, is_featured)
SELECT 'Review bình đựng nước giữ nhiệt YUNA', 
       'https://www.youtube.com/embed/dQw4w9WgXcQ', 
       'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
       'Test giữ nhiệt 24h với bình YUNA',
       false
WHERE NOT EXISTS (SELECT 1 FROM public.videos WHERE title = 'Review bình đựng nước giữ nhiệt YUNA');

-- 9. Auto-update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Triggers
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
-- ✅ SUCCESS! Schema ready
-- ================================================