import { useLanguage } from '../../contexts/LanguageContext';
import { t, getLocalizedField } from '../../i18n/translations';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

export default function NewsletterSection() {
  const { lang } = useLanguage();
  const [settings, setSettings] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    supabase.from('site_settings').select('*').single().then(({ data }) => setSettings(data));
  }, []);

  const text = settings ? getLocalizedField(settings.newsletter_text, lang) : t('section.newsletter', lang);

  return (
    <section className="py-16 sm:py-20 bg-neutral-900/50 border-t border-b border-gold/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-xl mx-auto px-4 text-center"
      >
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-cream mb-4">
          {t('section.newsletter', lang)}
        </h2>
        <p className="text-cream/50 text-sm mb-6">{text}</p>
        <form onSubmit={e => e.preventDefault()} className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder={t('section.email', lang)}
            className="flex-1 bg-black border border-gold/20 px-4 py-3 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40 rounded"
          />
          <button className="bg-gold text-black px-6 py-3 text-sm font-bold hover:bg-gold/90 transition-colors rounded">
            {t('section.subscribe', lang)}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
