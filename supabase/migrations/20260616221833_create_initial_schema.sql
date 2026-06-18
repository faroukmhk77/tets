-- Categories
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name JSONB NOT NULL DEFAULT '{}',
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Products
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name JSONB NOT NULL DEFAULT '{}',
  slug TEXT UNIQUE NOT NULL,
  description JSONB NOT NULL DEFAULT '{}',
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  category_id UUID REFERENCES categories(id),
  sizes TEXT[] NOT NULL DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0,
  condition_score INTEGER CHECK (condition_score BETWEEN 1 AND 10),
  images TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  is_limited_edition BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Orders
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','confirmed','shipped','delivered','cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Instagram Gallery
CREATE TABLE instagram_gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  instagram_link TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Site Settings
CREATE TABLE site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_name TEXT NOT NULL DEFAULT 'Vintage Sneakers Assouli',
  logo_url TEXT,
  favicon_url TEXT,
  contact_email TEXT,
  phone_number TEXT,
  whatsapp_number TEXT NOT NULL DEFAULT '+212600000000',
  instagram_link TEXT DEFAULT 'https://www.instagram.com/vintage.sneakers.assouli/',
  facebook_link TEXT,
  tiktok_link TEXT,
  hero_title JSONB NOT NULL DEFAULT '{}',
  hero_subtitle JSONB NOT NULL DEFAULT '{}',
  hero_image TEXT,
  about_title JSONB NOT NULL DEFAULT '{}',
  about_content JSONB NOT NULL DEFAULT '{}',
  about_image TEXT,
  newsletter_text JSONB NOT NULL DEFAULT '{}',
  home_meta_title TEXT,
  home_meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Testimonials
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  text JSONB NOT NULL DEFAULT '{}',
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- FAQ
CREATE TABLE faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question JSONB NOT NULL DEFAULT '{}',
  answer JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin users (simple auth)
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default settings
INSERT INTO site_settings (hero_title, hero_subtitle, about_title, about_content, newsletter_text) VALUES (
  '{"fr":"Sneakers Vintage de Luxe","ar":"سنيكرز فينتاج فاخرة","darija":"سنيكرز فينتاج دي لوكس"}',
  '{"fr":"Découvrez notre collection exclusive de sneakers vintage authentiques","ar":"اكتشف مجموعتنا الحصرية من السنيكرز فينتاج الأصيلة","darija":"اكتشف الكولكسيون الحصري ديالنا ديال السنيكرز فينتاج"}',
  '{"fr":"Notre Histoire","ar":"قصتنا","darija":"قصتنا"}',
  '{"fr":"Vintage Sneakers Assouli est la première boutique marocaine spécialisée dans les sneakers vintage authentiques. Chaque paire est soigneusement sélectionnée pour sa qualité, son histoire et son style unique.","ar":"فينتاج سنيكرز أسولي هي أول متجر مغربي متخصص في السنيكرز فيتابج الأصيلة. كل زوج يتم اختياره بعناية لجودته وتاريخه وأسلوبه الفريد.","darija":"فينتاج سنيكرز أسولي هي أول بوتيك مغربي متخصص فالسنيكرز فيتابج الأصيلة. كل پاي يتم اختياره بعناية على جودتو وتاريخو وستيلو الفريد"}',
  '{"fr":"Inscrivez-vous pour recevoir nos offres exclusives","ar":"اشترك لتلقي عروضنا الحصرية","darija":"سجل باش توصل بالعروض الحصرية ديالنا"}'
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "read_categories" ON categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "read_products" ON products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "read_instagram" ON instagram_gallery FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "read_settings" ON site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "read_testimonials" ON testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "read_faqs" ON faqs FOR SELECT TO anon, authenticated USING (true);

-- Orders: anyone can insert, only admin can read/update/delete
CREATE POLICY "insert_orders" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "read_orders" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "update_orders" ON orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_orders" ON orders FOR DELETE TO authenticated USING (true);

-- Admin write policies for all tables
CREATE POLICY "write_categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "write_products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "write_instagram" ON instagram_gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "write_settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "write_testimonials" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "write_faqs" ON faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "read_admin_users" ON admin_users FOR SELECT TO authenticated USING (true);
CREATE POLICY "write_admin_users" ON admin_users FOR ALL TO authenticated USING (true) WITH CHECK (true);
