import { Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../i18n/translations';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface InstagramItem {
  id: string;
  image_url: string;
  instagram_link: string;
}

export default function InstagramSection() {
  const { lang } = useLanguage();
  const [items, setItems] = useState<InstagramItem[]>([]);

  useEffect(() => {
    supabase
      .from('instagram_gallery')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .limit(6)
      .then(({ data }) => setItems((data || []) as InstagramItem[]));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-neutral-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <Instagram size={32} className="text-gold mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-cream mb-2">
            {t('section.instagram', lang)}
          </h2>
          <a
            href="https://www.instagram.com/vintage.sneakers.assouli/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold/70 text-sm hover:text-gold transition-colors"
          >
            @vintage.sneakers.assouli
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {items.map((item, i) => (
            <motion.a
              key={item.id}
              href={item.instagram_link || 'https://www.instagram.com/vintage.sneakers.assouli/'}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="aspect-square overflow-hidden rounded-lg group relative"
            >
              <img
                src={item.image_url}
                alt="Instagram"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram size={24} className="text-white" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
