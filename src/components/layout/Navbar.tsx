import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Heart, Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { t, Lang } from '../../i18n/translations';
import { motion, AnimatePresence } from 'framer-motion';

const langLabels: Record<Lang, string> = { fr: 'FR', ar: 'AR', darija: 'DAR' };
const langFullLabels: Record<Lang, string> = { fr: 'Français', ar: 'العربية', darija: 'الدارجة' };

export default function Navbar() {
  const { lang, setLang } = useLanguage();
  const { items, setIsOpen } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const rtl = lang === 'ar' || lang === 'darija';

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const links = [
    { to: '/', label: t('nav.home', lang) },
    { to: '/shop', label: t('nav.shop', lang) },
    { to: '/about', label: t('nav.about', lang) },
    { to: '/contact', label: t('nav.contact', lang) },
    { to: '/faq', label: t('nav.faq', lang) },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-gold font-display text-xl sm:text-2xl font-bold tracking-wider">
              VINTAGE SNEAKERS
            </span>
            <span className="text-cream font-display text-sm sm:text-base font-light">
              ASSOULI
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-gold'
                    : 'text-cream/70 hover:text-gold'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-cream/70 hover:text-gold transition-colors text-sm"
              >
                <Globe size={16} />
                <span className="hidden sm:inline">{langLabels[lang]}</span>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className={`absolute top-full ${rtl ? 'left-0' : 'right-0'} mt-2 bg-neutral-900 border border-gold/20 rounded-lg overflow-hidden shadow-xl`}
                  >
                    {(['fr', 'ar', 'darija'] as Lang[]).map(l => (
                      <button
                        key={l}
                        onClick={() => { setLang(l); setLangOpen(false); }}
                        className={`block w-full px-4 py-2 text-sm text-left transition-colors ${
                          lang === l ? 'text-gold bg-gold/10' : 'text-cream/70 hover:text-gold hover:bg-gold/5'
                        }`}
                      >
                        {langFullLabels[l]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/wishlist" className="relative text-cream/70 hover:text-gold transition-colors">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <button onClick={() => setIsOpen(true)} className="relative text-cream/70 hover:text-gold transition-colors">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <Link
              to="/admin/login"
              className="hidden sm:block text-cream/40 hover:text-gold/60 transition-colors text-xs"
            >
              {t('nav.admin', lang)}
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-cream/70 hover:text-gold transition-colors"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/98 border-b border-gold/20 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block text-sm font-medium py-2 transition-colors ${
                    location.pathname === link.to ? 'text-gold' : 'text-cream/70 hover:text-gold'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium py-2 text-cream/40 hover:text-gold/60 transition-colors"
              >
                {t('nav.admin', lang)}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
