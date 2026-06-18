import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { t, getLocalizedField } from '../../i18n/translations';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

interface FAQ {
  id: string;
  question: Record<string, string>;
  answer: Record<string, string>;
}

export default function FAQPreview() {
  const { lang } = useLanguage();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('faqs')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .limit(4)
      .then(({ data }) => setFaqs((data || []) as FAQ[]));
  }, []);

  if (faqs.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-cream text-center mb-12">
          {t('faq.title', lang)}
        </h2>
        <div className="space-y-3">
          {faqs.map(faq => (
            <div key={faq.id} className="border border-gold/10 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-4 text-cream hover:text-gold transition-colors"
              >
                <span className="text-sm font-medium text-left">{getLocalizedField(faq.question, lang)}</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform flex-shrink-0 ml-2 ${openId === faq.id ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-cream/60 text-sm leading-relaxed">
                      {getLocalizedField(faq.answer, lang)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/faq" className="text-gold text-sm font-medium hover:underline">
            {t('common.viewAll', lang)}
          </Link>
        </div>
      </div>
    </section>
  );
}
