import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { t, getLocalizedField } from '../../i18n/translations';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Testimonial {
  id: string;
  name: string;
  text: Record<string, string>;
  rating: number;
}

export default function TestimonialsSection() {
  const { lang } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => setTestimonials((data || []) as Testimonial[]));
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-cream text-center mb-12">
          {t('section.testimonials', lang)}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-neutral-900 border border-gold/10 rounded-lg p-6"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-gold" fill="currentColor" />
                ))}
              </div>
              <p className="text-cream/70 text-sm leading-relaxed mb-4">
                "{getLocalizedField(item.text, lang)}"
              </p>
              <p className="text-gold text-sm font-medium">{item.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
