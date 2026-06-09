-- ================================================
-- Add product_name column to videos tables
-- ================================================

-- 1. Add product_name to videos table
ALTER TABLE public.videos 
ADD COLUMN IF NOT EXISTS product_name TEXT;

-- 2. Add product_name to reviews_videos table
ALTER TABLE public.reviews_videos 
ADD COLUMN IF NOT EXISTS product_name TEXT;

-- 3. Update existing rows to populate product_name from products table
UPDATE public.videos v
SET product_name = p.name
FROM public.products p
WHERE v.product_id = p.id
AND v.product_name IS NULL;

UPDATE public.reviews_videos rv
SET product_name = p.name
FROM public.products p
WHERE rv.product_id = p.id
AND rv.product_name IS NULL;

-- ================================================
-- Done! Run this in Supabase SQL Editor
-- ================================================