import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { t, getLocalizedField } from '../../i18n/translations';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Hero() {
  const { lang } = useLanguage();
  const [settings, setSettings] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    supabase.from('site_settings').select('*').single().then(({ data }) => setSettings(data));
  }, []);

  const heroTitle = settings ? getLocalizedField(settings.hero_title, lang) : t('hero.subtitle', lang);
  const heroSubtitle = settings ? getLocalizedField(settings.hero_subtitle, lang) : '';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${settings?.hero_image || 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1920'})`,
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gold/80 text-sm font-medium tracking-[0.3em] uppercase mb-4">
            {t('hero.subtitle', lang)}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-cream leading-tight mb-6">
            {heroTitle}
          </h1>
          <p className="text-cream/60 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            {heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="bg-gold text-black px-8 py-3.5 text-sm font-bold hover:bg-gold/90 transition-colors rounded-sm flex items-center gap-2"
            >
              {t('hero.cta', lang)} <ChevronRight size={16} />
            </Link>
            <Link
              to="/shop?filter=new"
              className="border border-cream/30 text-cream px-8 py-3.5 text-sm font-medium hover:border-gold hover:text-gold transition-colors rounded-sm"
            >
              {t('hero.cta2', lang)}
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
