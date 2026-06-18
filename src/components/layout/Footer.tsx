import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../i18n/translations';

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="bg-neutral-950 border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <div className="mb-4">
              <span className="text-gold font-display text-xl font-bold tracking-wider">VINTAGE SNEAKERS</span>
              <span className="text-cream font-display text-sm font-light ml-1">ASSOULI</span>
            </div>
            <p className="text-cream/50 text-sm leading-relaxed">
              La première boutique marocaine de sneakers vintage authentiques.
            </p>
          </div>

          <div>
            <h3 className="text-gold font-semibold text-sm mb-4 uppercase tracking-wider">
              {t('footer.quickLinks', lang)}
            </h3>
            <div className="space-y-2">
              {[
                { to: '/', label: t('nav.home', lang) },
                { to: '/shop', label: t('nav.shop', lang) },
                { to: '/about', label: t('nav.about', lang) },
                { to: '/contact', label: t('nav.contact', lang) },
                { to: '/faq', label: t('nav.faq', lang) },
              ].map(link => (
                <Link key={link.to} to={link.to} className="block text-cream/50 hover:text-gold text-sm transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-gold font-semibold text-sm mb-4 uppercase tracking-wider">
              {t('footer.contactUs', lang)}
            </h3>
            <div className="space-y-3">
              <a href="https://www.instagram.com/vintage.sneakers.assouli/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cream/50 hover:text-gold text-sm transition-colors">
                <Instagram size={16} /> @vintage.sneakers.assouli
              </a>
              <div className="flex items-center gap-2 text-cream/50 text-sm">
                <Phone size={16} /> +212 6 00 00 00 00
              </div>
              <div className="flex items-center gap-2 text-cream/50 text-sm">
                <Mail size={16} /> contact@assouli.ma
              </div>
              <div className="flex items-center gap-2 text-cream/50 text-sm">
                <MapPin size={16} /> Maroc
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-gold font-semibold text-sm mb-4 uppercase tracking-wider">
              {t('section.newsletter', lang)}
            </h3>
            <p className="text-cream/50 text-sm mb-3">{t('section.subscribe', lang)}</p>
            <form onSubmit={e => e.preventDefault()} className="flex">
              <input
                type="email"
                placeholder={t('section.email', lang)}
                className="flex-1 bg-neutral-900 border border-gold/20 px-3 py-2 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40 rounded-l"
              />
              <button className="bg-gold text-black px-4 py-2 text-sm font-semibold hover:bg-gold/90 transition-colors rounded-r">
                OK
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gold/10 text-center">
          <p className="text-cream/30 text-xs">
            &copy; {new Date().getFullYear()} Vintage Sneakers Assouli. {t('footer.rights', lang)}.
          </p>
        </div>
      </div>
    </footer>
  );
}
