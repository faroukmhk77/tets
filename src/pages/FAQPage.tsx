import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { t, getLocalizedField } from '../i18n/translations';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import SEO from '../components/common/SEO';

interface FAQ {
  id: string;
  question: Record<string, string>;
  answer: Record<string, string>;
}

export default function FAQPage() {
  const { lang } = useLanguage();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('faqs').select('*').eq('is_active', true).order('sort_order').then(({ data }) => setFaqs((data || []) as FAQ[]));
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <SEO
        title="FAQ | Vintage Sneakers Assouli"
        description="Questions fréquentes sur nos sneakers vintage, la livraison, le paiement et les retours."
        url="https://vintage-sneakers-assouli.ma/faq"
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-cream mb-8">
            {t('faq.title', lang)}
          </h1>
        </motion.div>

        {faqs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-cream/40 text-sm">Aucune question pour le moment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border border-gold/10 rounded-lg overflow-hidden hover:border-gold/30 transition-colors"
              >
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-cream hover:text-gold transition-colors"
                >
                  <span className="text-sm sm:text-base font-medium text-left pr-4">{getLocalizedField(faq.question, lang)}</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform flex-shrink-0 ${openId === faq.id ? 'rotate-180 text-gold' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden bg-gold/5"
                    >
                      <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-cream/70 text-sm leading-relaxed">
                        {getLocalizedField(faq.answer, lang)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
