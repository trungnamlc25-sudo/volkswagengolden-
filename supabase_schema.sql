-- =================================================================
-- VOLKSWAGEN GOLDEN / BIÊN HÒA - SUPABASE DATABASE SCHEMA
-- Hướng dẫn: Copy toàn bộ nội dung file này dán vào Supabase SQL Editor
-- rồi bấm nút "RUN" để tạo toàn bộ bảng cơ sở dữ liệu trên Cloud!
-- =================================================================

-- 1. BẢNG KHÁCH HÀNG ĐĂNG KÝ (LEADS CRM)
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    model TEXT NOT NULL,
    need TEXT NOT NULL,
    note TEXT,
    sales_notes TEXT,
    status TEXT DEFAULT 'new', -- 'new' | 'contacted' | 'negotiating' | 'won' | 'lost'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. BẢNG CÀI ĐẶT SHOWROOM & HOTLINE
CREATE TABLE IF NOT EXISTS public.showroom_settings (
    id TEXT PRIMARY KEY DEFAULT 'current',
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    address TEXT NOT NULL,
    hotline TEXT NOT NULL,
    hotline_formatted TEXT NOT NULL,
    email TEXT NOT NULL,
    zalo_phone TEXT NOT NULL,
    zalo TEXT NOT NULL,
    messenger TEXT NOT NULL,
    open_hours TEXT NOT NULL,
    facebook TEXT,
    youtube TEXT,
    tiktok TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. BẢNG NỘI DUNG GIAO DIỆN TRANG CHỦ (CMS SITE CONTENT)
CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY DEFAULT 'current',
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. BẢNG DÒNG XE VOLKSWAGEN (CAR CATALOG & PRICING)
CREATE TABLE IF NOT EXISTS public.cars (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    tagline TEXT,
    category TEXT NOT NULL, -- 'suv' | 'mpv' | 'hatchback'
    category_label TEXT NOT NULL,
    price_text TEXT NOT NULL,
    price_number BIGINT NOT NULL,
    image TEXT NOT NULL,
    gallery JSONB DEFAULT '[]'::jsonb,
    badge TEXT,
    highlights JSONB DEFAULT '[]'::jsonb,
    specs JSONB NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    colors JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =================================================================
-- PHÂN QUYỀN TRUY CẬP (ROW LEVEL SECURITY - RLS)
-- Cho phép khách hàng gửi thông tin và đọc dữ liệu công khai an toàn
-- =================================================================

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showroom_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Leads: Bất kỳ khách hàng nào vào web đều được phép gửi đăng ký (INSERT)
CREATE POLICY "Public leads insert" ON public.leads
    FOR INSERT WITH CHECK (true);

-- Leads: Xem, sửa, xóa danh sách khách (cho phép qua Anon Key)
CREATE POLICY "Public leads select" ON public.leads
    FOR SELECT USING (true);

CREATE POLICY "Public leads update" ON public.leads
    FOR UPDATE USING (true);

CREATE POLICY "Public leads delete" ON public.leads
    FOR DELETE USING (true);

-- Showroom Settings: Mọi người đều đọc được, admin cập nhật được
CREATE POLICY "Public settings select" ON public.showroom_settings
    FOR SELECT USING (true);

CREATE POLICY "Public settings insert/update" ON public.showroom_settings
    FOR ALL USING (true);

-- Site Content: Đọc và cập nhật giao diện
CREATE POLICY "Public content select" ON public.site_content
    FOR SELECT USING (true);

CREATE POLICY "Public content insert/update" ON public.site_content
    FOR ALL USING (true);

-- Cars: Đọc danh sách xe và cập nhật
CREATE POLICY "Public cars select" ON public.cars
    FOR SELECT USING (true);

CREATE POLICY "Public cars insert/update" ON public.cars
    FOR ALL USING (true);

-- =================================================================
-- KÍCH HOẠT REALTIME CHO BẢNG LEADS
-- Khi khách gửi thông tin, màn hình Admin của mọi nhân viên tự động nhảy số ngay!
-- =================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
