import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { t } from '../i18n/translations';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import {
  sanitizeInput,
  isValidName,
  isValidPhone,
  isValidCity,
  isValidAddress,
  escapeWhatsApp,
  generateOrderRef,
} from '../lib/utils';

interface FormErrors {
  name?: string;
  phone?: string;
  city?: string;
  address?: string;
}

export default function CheckoutPage() {
  const { lang } = useLanguage();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};

    const sanitizedName = sanitizeInput(form.name);
    const sanitizedPhone = sanitizeInput(form.phone);
    const sanitizedCity = sanitizeInput(form.city);
    const sanitizedAddress = sanitizeInput(form.address);

    if (!isValidName(sanitizedName)) {
      errors.name = lang === 'ar' ? 'الاسم يجب أن يكون بين 2 و 100 حرف' : lang === 'darija' ? 'الاسم خاصو يكون بين 2 و 100 حرف' : 'Le nom doit contenir entre 2 et 100 caractères';
    }

    if (!isValidPhone(sanitizedPhone)) {
      errors.phone = lang === 'ar' ? 'رقم الهاتف غير صالح' : lang === 'darija' ? 'نوميرو ديال التيليفون ماشي صحيح' : 'Numéro de téléphone invalide';
    }

    if (!isValidCity(sanitizedCity)) {
      errors.city = lang === 'ar' ? 'المدينة مطلوبة' : lang === 'darija' ? 'المدينة لازم' : 'La ville est requise';
    }

    if (!isValidAddress(sanitizedAddress)) {
      errors.address = lang === 'ar' ? 'العنوان يجب أن يكون بين 5 و 500 حرف' : lang === 'darija' ? 'لادريس خاصو يكون بين 5 و 500 حرف' : "L'adresse doit contenir entre 5 et 500 caractères";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form, lang]);

  if (items.length === 0 && !submitted) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <SEO title="Panier vide | Vintage Sneakers Assouli" />
        <div className="text-center">
          <p className="text-cream/40 text-sm mb-4">{t('cart.empty', lang)}</p>
          <button onClick={() => navigate('/shop')} className="text-gold text-sm hover:underline">
            {t('nav.shop', lang)}
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <SEO title="Commande Confirmee | Vintage Sneakers Assouli" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="text-[#25D366] mb-4"><MessageCircle size={48} className="mx-auto" /></div>
          <h2 className="text-cream text-xl font-semibold mb-2">{t('order.success', lang)}</h2>
          <p className="text-cream/50 text-sm mb-4">Nous avons bien recu votre commande et vous contacterons sous peu.</p>
          <button onClick={() => navigate('/shop')} className="text-gold text-sm hover:underline mt-4">
            {t('nav.shop', lang)}
          </button>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { data: settings } = await supabase.from('site_settings').select('whatsapp_number').single();
      const waNumber = (settings?.whatsapp_number || '+212600000000').replace(/[^0-9]/g, '');
      const date = new Date().toLocaleDateString('fr-FR');
      const orderRef = generateOrderRef();

      const sanitizedName = sanitizeInput(form.name);
      const sanitizedPhone = sanitizeInput(form.phone);
      const sanitizedCity = sanitizeInput(form.city);
      const sanitizedAddress = sanitizeInput(form.address);

      for (const item of items) {
        await supabase.from('orders').insert({
          product_id: item.productId,
          customer_name: sanitizedName,
          customer_phone: sanitizedPhone,
          city: sanitizedCity,
          address: sanitizedAddress,
          size: item.size,
          quantity: item.quantity,
          total_price: item.price * item.quantity,
          status: 'new',
        });
      }

      const productList = items.map(i =>
        `  - ${escapeWhatsApp(i.name)} (Taille: ${i.size}, Qte: ${i.quantity}, Prix: ${i.price * i.quantity} MAD)`
      ).join('\n');

      const msg = `*NOUVELLE COMMANDE - Vintage Sneakers Assouli*\n\n` +
        `*Reference:* ${orderRef}\n` +
        `*───────────────*\n` +
        `*Produits:*\n${productList}\n\n` +
        `*Total:* ${total} MAD\n\n` +
        `*───────────────*\n` +
        `*INFOS CLIENT*\n` +
        `*Nom:* ${escapeWhatsApp(sanitizedName)}\n` +
        `*Telephone:* ${escapeWhatsApp(sanitizedPhone)}\n` +
        `*Ville:* ${escapeWhatsApp(sanitizedCity)}\n` +
        `*Adresse:* ${escapeWhatsApp(sanitizedAddress)}\n` +
        `*Date:* ${date}`;

      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
      clearCart();
      setSubmitted(true);
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <SEO
        title="Finaliser la Commande | Vintage Sneakers Assouli"
        description="Confirmez votre commande de sneakers vintage. Livraison partout au Maroc."
        url="https://vintage-sneakers-assouli.ma/checkout"
      />
      <div className="max-w-lg mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold text-cream mb-8">{t('order.title', lang)}</h1>

          <div className="bg-neutral-900 border border-gold/10 rounded-lg p-4 mb-6">
            {items.map(item => (
              <div key={`${item.productId}-${item.size}`} className="flex items-center gap-3 py-2 border-b border-gold/5 last:border-0">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <p className="text-cream text-sm truncate">{item.name}</p>
                  <p className="text-cream/40 text-xs">{t('product.sizes', lang)}: {item.size} | x{item.quantity}</p>
                </div>
                <p className="text-gold text-sm font-semibold">{item.price * item.quantity} {t('product.mad', lang)}</p>
              </div>
            ))}
            <div className="flex justify-between pt-3 mt-2 border-t border-gold/10">
              <span className="text-cream font-semibold text-sm">{t('cart.total', lang)}</span>
              <span className="text-gold font-bold">{total} {t('product.mad', lang)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <input
                placeholder={t('order.name', lang) + ' *'}
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className={`w-full bg-neutral-900 border px-4 py-3 text-sm text-cream placeholder-cream/30 focus:outline-none rounded-lg ${formErrors.name ? 'border-red-500' : 'border-gold/20 focus:border-gold/40'}`}
              />
              {formErrors.name && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{formErrors.name}</p>}
            </div>

            <div>
              <input
                type="tel"
                placeholder={t('order.phone', lang) + ' *'}
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className={`w-full bg-neutral-900 border px-4 py-3 text-sm text-cream placeholder-cream/30 focus:outline-none rounded-lg ${formErrors.phone ? 'border-red-500' : 'border-gold/20 focus:border-gold/40'}`}
              />
              {formErrors.phone && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{formErrors.phone}</p>}
            </div>

            <div>
              <input
                placeholder={t('order.city', lang) + ' *'}
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                className={`w-full bg-neutral-900 border px-4 py-3 text-sm text-cream placeholder-cream/30 focus:outline-none rounded-lg ${formErrors.city ? 'border-red-500' : 'border-gold/20 focus:border-gold/40'}`}
              />
              {formErrors.city && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{formErrors.city}</p>}
            </div>

            <div>
              <textarea
                placeholder={t('order.address', lang) + ' *'}
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                rows={3}
                className={`w-full bg-neutral-900 border px-4 py-3 text-sm text-cream placeholder-cream/30 focus:outline-none rounded-lg resize-none ${formErrors.address ? 'border-red-500' : 'border-gold/20 focus:border-gold/40'}`}
              />
              {formErrors.address && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{formErrors.address}</p>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-[#25D366] text-white py-3.5 text-sm font-bold hover:bg-[#20bd5a] transition-colors rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  {lang === 'ar' ? 'جاري الإرسال...' : lang === 'darija' ? 'كيسيفط...' : 'Envoi...'}
                </span>
              ) : (
                <>
                  <MessageCircle size={18} /> {t('order.submit', lang)}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
