import { useEffect, useState } from 'react';
import Hero from '../components/home/Hero';
import ProductSection from '../components/home/ProductSection';
import BrandStory from '../components/home/BrandStory';
import TrustSection from '../components/home/TrustSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import InstagramSection from '../components/home/InstagramSection';
import FAQPreview from '../components/home/FAQPreview';
import NewsletterSection from '../components/home/NewsletterSection';
import SEO from '../components/common/SEO';
import { supabase } from '../lib/supabase';

export default function HomePage() {
  const [seoSettings, setSeoSettings] = useState<{ title: string; description: string } | null>(null);

  useEffect(() => {
    supabase.from('site_settings').select('home_meta_title, home_meta_description').single().then(({ data }) => {
      if (data) {
        setSeoSettings({
          title: data.home_meta_title || undefined,
          description: data.home_meta_description || undefined,
        });
      }
    });
  }, []);

  return (
    <div>
      <SEO
        title={seoSettings?.title}
        description={seoSettings?.description}
      />
      <Hero />
      <ProductSection titleKey="section.featured" filterKey="is_featured" linkFilter="featured" />
      <ProductSection titleKey="section.newArrivals" filterKey="is_new_arrival" linkFilter="new" />
      <BrandStory />
      <TrustSection />
      <ProductSection titleKey="section.bestSellers" filterKey="is_best_seller" linkFilter="bestseller" />
      <ProductSection titleKey="section.limited" filterKey="is_limited_edition" linkFilter="limited" />
      <TestimonialsSection />
      <InstagramSection />
      <FAQPreview />
      <NewsletterSection />
    </div>
  );
}
