import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { getLocalizedField } from '../../i18n/translations';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function BrandStory() {
  const { lang } = useLanguage();
  const [settings, setSettings] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    supabase.from('site_settings').select('*').single().then(({ data }) => setSettings(data));
  }, []);

  const title = settings ? getLocalizedField(settings.about_title, lang) : '';
  const content = settings ? getLocalizedField(settings.about_content, lang) : '';
  const image = settings?.about_image || 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=600';

  if (!content) return null;

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="aspect-[4/3] overflow-hidden rounded-lg"
          >
            <img src={image} alt="Brand Story" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-cream mb-6">{title}</h2>
            <p className="text-cream/60 text-sm leading-relaxed">{content}</p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-gold text-2xl font-bold">500+</p>
                <p className="text-cream/40 text-xs mt-1">Sneakers</p>
              </div>
              <div className="text-center">
                <p className="text-gold text-2xl font-bold">1000+</p>
                <p className="text-cream/40 text-xs mt-1">Clients</p>
              </div>
              <div className="text-center">
                <p className="text-gold text-2xl font-bold">100%</p>
                <p className="text-cream/40 text-xs mt-1">Authentique</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
