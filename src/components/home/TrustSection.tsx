import { Shield, Award, Truck, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../i18n/translations';

const trustItems = [
  { icon: Shield, titleKey: 'trust.authentic', descKey: 'trust.authenticDesc' },
  { icon: Award, titleKey: 'trust.quality', descKey: 'trust.qualityDesc' },
  { icon: Truck, titleKey: 'trust.delivery', descKey: 'trust.deliveryDesc' },
  { icon: MessageCircle, titleKey: 'trust.support', descKey: 'trust.supportDesc' },
];

export default function TrustSection() {
  const { lang } = useLanguage();

  return (
    <section className="py-16 sm:py-20 bg-neutral-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-cream text-center mb-12">
          {t('section.trust', lang)}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-lg border border-gold/10 hover:border-gold/30 transition-colors"
            >
              <item.icon size={36} className="text-gold mx-auto mb-4" />
              <h3 className="text-cream font-semibold text-sm mb-2">{t(item.titleKey, lang)}</h3>
              <p className="text-cream/50 text-xs leading-relaxed">{t(item.descKey, lang)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
