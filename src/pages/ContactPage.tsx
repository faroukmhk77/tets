import { motion } from 'framer-motion';
import { Instagram, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../i18n/translations';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import SEO from '../components/common/SEO';

export default function ContactPage() {
  const { lang } = useLanguage();
  const [settings, setSettings] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    supabase.from('site_settings').select('*').single().then(({ data }) => setSettings(data));
  }, []);

  const waNumber = (settings?.whatsapp_number || '+212600000000').replace(/[^0-9]/g, '');

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <SEO
        title="Contact | Vintage Sneakers Assouli"
        description="Contactez-nous via WhatsApp, Instagram ou email. Nous sommes là pour vous aider."
        url="https://vintage-sneakers-assouli.ma/contact"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-cream mb-2">
            {t('contact.title', lang)}
          </h1>
          <p className="text-cream/50 text-sm mb-8">{t('contact.subtitle', lang)}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {[
              { icon: MessageCircle, label: 'WhatsApp', value: settings?.whatsapp_number || '+212 6 00 00 00 00', link: `https://wa.me/${waNumber}`, highlight: true },
              { icon: Phone, label: t('order.phoneLabel', lang), value: settings?.phone_number || '+212 6 00 00 00 00' },
              { icon: Mail, label: 'Email', value: settings?.contact_email || 'contact@assouli.ma' },
              { icon: Instagram, label: 'Instagram', value: '@vintage.sneakers.assouli', link: 'https://www.instagram.com/vintage.sneakers.assouli/' },
              { icon: MapPin, label: 'Location', value: 'Maroc' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                  item.highlight
                    ? 'bg-[#25D366]/10 border border-[#25D366]/30'
                    : 'border border-gold/10 hover:border-gold/30'
                }`}
              >
                <item.icon size={20} className={`${item.highlight ? 'text-[#25D366]' : 'text-gold'} flex-shrink-0 mt-0.5`} />
                <div>
                  <p className="text-cream text-sm font-medium">{item.label}</p>
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-cream/60 text-sm hover:text-gold transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-cream/60 text-sm">{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-neutral-900 border border-gold/10 rounded-lg p-6"
          >
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#25D366]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={32} className="text-[#25D366]" />
              </div>
              <h2 className="text-cream font-semibold text-lg mb-2">{t('contact.sendWhatsApp', lang)}</h2>
              <p className="text-cream/40 text-sm mb-6">Réponse rapide garantie</p>
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white py-3 px-8 text-sm font-bold hover:bg-[#20bd5a] transition-colors rounded-lg"
              >
                <MessageCircle size={18} /> {t('contact.sendWhatsApp', lang)}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
