import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Instagram, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../i18n/translations';
import { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';

const navItems = [
  { to: '/admin/products', icon: Package, labelKey: 'admin.products' },
  { to: '/admin/orders', icon: ShoppingBag, labelKey: 'admin.orders' },
  { to: '/admin/instagram', icon: Instagram, labelKey: 'admin.instagram' },
  { to: '/admin/settings', icon: Settings, labelKey: 'admin.settings' },
];

export default function AdminLayout() {
  const { isAdmin, logout } = useAdmin();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAdmin) {
    navigate('/admin');
    return null;
  }

  const handleLogout = () => {
    const confirmMsg = lang === 'ar' ? 'هل تريد تسجيل الخروج؟' : lang === 'darija' ? 'واش بغيتي تديكونيكتي؟' : 'Voulez-vous vous déconnecter?';
    if (confirm(confirmMsg)) {
      logout();
      navigate('/admin');
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <SEO title="Admin Dashboard | Vintage Sneakers Assouli" noIndex />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="sm:hidden fixed bottom-4 right-4 z-50 bg-gold text-black p-3 rounded-full shadow-lg"
        >
          <ChevronRight size={20} className={sidebarOpen ? 'rotate-180' : ''} />
        </button>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Sidebar */}
          <motion.nav
            initial={false}
            animate={sidebarOpen ? { x: 0 } : undefined}
            className={`
              fixed sm:static inset-y-0 left-0 z-40 w-64
              bg-neutral-950 sm:bg-transparent
              transform transition-transform duration-200
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              sm:transform-none sm:w-56 flex-shrink-0
              pt-20 sm:pt-0
            `}
          >
            <div className="flex sm:flex-col gap-1 p-4 sm:p-0">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg whitespace-nowrap transition-colors ${
                      isActive ? 'bg-gold/10 text-gold font-medium border-l-2 border-gold' : 'text-cream/50 hover:text-gold hover:bg-gold/5'
                    }`
                  }
                >
                  <item.icon size={16} />
                  {t(item.labelKey, lang)}
                </NavLink>
              ))}
              <div className="hidden sm:block border-t border-gold/10 my-2" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-cream/30 hover:text-red-400 transition-colors rounded-lg whitespace-nowrap"
              >
                <LogOut size={16} />
                {t('admin.logout', lang)}
              </button>
            </div>
          </motion.nav>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 sm:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Content */}
          <div className="flex-1 min-w-0 overflow-x-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
