import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../i18n/translations';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, total } = useCart();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-neutral-950 border-l border-gold/20 z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gold/10">
              <h2 className="text-gold font-display text-lg font-semibold">{t('cart.title', lang)}</h2>
              <button onClick={() => setIsOpen(false)} className="text-cream/50 hover:text-gold transition-colors">
                <X size={24} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-cream/40 text-sm">{t('cart.empty', lang)}</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {items.map(item => (
                    <div key={`${item.productId}-${item.size}`} className="flex gap-3 bg-neutral-900 rounded-lg p-3">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-cream text-sm font-medium truncate">{item.name}</h3>
                        <p className="text-gold text-sm font-semibold">{item.price} {t('product.mad', lang)}</p>
                        <p className="text-cream/50 text-xs">Size: {item.size}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                            className="text-cream/50 hover:text-gold transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-cream text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                            className="text-cream/50 hover:text-gold transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => removeItem(item.productId, item.size)}
                            className="ml-auto text-cream/30 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gold/10 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-cream/50 text-sm">{t('cart.subtotal', lang)}</span>
                    <span className="text-gold font-semibold">{total} {t('product.mad', lang)}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/checkout');
                    }}
                    className="w-full bg-gold text-black py-3 text-sm font-bold hover:bg-gold/90 transition-colors rounded-lg"
                  >
                    {t('cart.checkout', lang)}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
