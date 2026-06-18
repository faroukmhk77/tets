import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedField } from '../i18n/translations';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Shield, Award, Truck, MessageCircle } from 'lucide-react';
import SEO from '../components/common/SEO';

export default function AboutPage() {
  const { lang } = useLanguage();
  const [settings, setSettings] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    supabase.from('site_settings').select('*').single().then(({ data }) => setSettings(data));
  }, []);

  const title = settings ? getLocalizedField(settings.about_title, lang) : '';
  const content = settings ? getLocalizedField(settings.about_content, lang) : ''
  const image = settings?.about_image || 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <SEO
        title={`${title || 'À Propos'} | Vintage Sneakers Assouli`}
        description="Découvrez l'histoire de Vintage Sneakers Assouli, la première boutique marocaine de sneakers vintage authentiques."
        url="https://vintage-sneakers-assouli.ma/about"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-cream mb-2">
            {title || 'À Propos'}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="aspect-[4/3] overflow-hidden rounded-lg"
          >
            <img src={image} alt="About" className="w-full h-full object-cover" loading="lazy" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-display font-bold text-gold">{title}</h2>
            <p className="text-cream/60 text-sm leading-relaxed">{content}</p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { icon: Shield, title: '100% Authentique', desc: 'Chaque paire vérifiée' },
                { icon: Award, title: 'Qualité Premium', desc: 'Sélection rigoureuse' },
                { icon: Truck, title: 'Livraison Rapide', desc: 'Partout au Maroc' },
                { icon: MessageCircle, title: 'Support WhatsApp', desc: 'Réponse rapide' },
              ].map((item, i) => (
                <div key={i} className="border border-gold/10 rounded-lg p-4 hover:border-gold/30 transition-colors">
                  <item.icon size={24} className="text-gold mb-2" />
                  <p className="text-cream text-sm font-medium">{item.title}</p>
                  <p className="text-cream/40 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-4 bg-gold/5 rounded-lg">
                <p className="text-gold text-3xl font-bold">500+</p>
                <p className="text-cream/40 text-xs mt-1">Sneakers</p>
              </div>
              <div className="text-center p-4 bg-gold/5 rounded-lg">
                <p className="text-gold text-3xl font-bold">1000+</p>
                <p className="text-cream/40 text-xs mt-1">Clients</p>
              </div>
              <div className="text-center p-4 bg-gold/5 rounded-lg">
                <p className="text-gold text-3xl font-bold">100%</p>
                <p className="text-cream/40 text-xs mt-1">Authentique</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
