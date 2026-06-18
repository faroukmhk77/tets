import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ChevronLeft, Star, Minus, Plus, MessageCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { t, getLocalizedField } from '../i18n/translations';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/common/ProductCard';
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

interface Product {
  id: string;
  name: Record<string, string>;
  slug: string;
  description: Record<string, string>;
  price: number;
  compare_price: number;
  images: string[];
  sizes: string[];
  stock: number;
  condition_score: number;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_limited_edition: boolean;
  category_id: string;
  meta_title: string;
  meta_description: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  city?: string;
  address?: string;
}

export default function ProductPage() {
  const { slug } = useParams();
  const { lang } = useLanguage();
  const { addItem: addCart } = useCart();
  const { isInWishlist, addItem: addWish, removeItem: removeWish } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: '', phone: '', city: '', address: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};

    const sanitizedName = sanitizeInput(orderForm.name);
    const sanitizedPhone = sanitizeInput(orderForm.phone);
    const sanitizedCity = sanitizeInput(orderForm.city);
    const sanitizedAddress = sanitizeInput(orderForm.address);

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
  }, [orderForm, lang]);

  useEffect(() => {
    if (slug) {
      supabase.from('products').select('*').eq('slug', slug).eq('is_active', true).single().then(({ data }) => {
        if (data) {
          const p = data as Product;
          setProduct(p);
          if (p.sizes.length > 0) setSelectedSize(p.sizes[0]);
          if (p.category_id) {
            supabase.from('products').select('*').eq('category_id', p.category_id).eq('is_active', true).neq('id', p.id).limit(4).then(({ data: rel }) => setRelated((rel || []) as Product[]));
          }
        }
      });
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (!selectedSize || !product) return;
    addCart({
      productId: product.id,
      name: getLocalizedField(product.name, lang),
      price: product.price,
      image: product.images[0] || '',
      size: selectedSize,
      quantity,
    });
  };

  const handleWhatsAppOrder = async () => {
    if (!validateForm() || !product || !selectedSize) return;

    setIsSubmitting(true);

    try {
      const orderRef = generateOrderRef();
      const sanitizedName = sanitizeInput(orderForm.name);
      const sanitizedPhone = sanitizeInput(orderForm.phone);
      const sanitizedCity = sanitizeInput(orderForm.city);
      const sanitizedAddress = sanitizeInput(orderForm.address);

      await supabase.from('orders').insert({
        product_id: product.id,
        customer_name: sanitizedName,
        customer_phone: sanitizedPhone,
        city: sanitizedCity,
        address: sanitizedAddress,
        size: selectedSize,
        quantity,
        total_price: product.price * quantity,
        status: 'new',
      });

      const { data: settings } = await supabase.from('site_settings').select('whatsapp_number').single();
      const waNumber = (settings?.whatsapp_number || '+212600000000').replace(/[^0-9]/g, '');
      const date = new Date().toLocaleDateString('fr-FR');

      const productName = escapeWhatsApp(getLocalizedField(product.name, lang));
      const msg = `*NOUVELLE COMMANDE - Vintage Sneakers Assouli*\n\n` +
        `*Référence:* ${orderRef}\n` +
        `*───────────────*\n` +
        `*Produit:* ${productName}\n` +
        `*Taille:* ${selectedSize}\n` +
        `*Quantité:* ${quantity}\n` +
        `*Prix Total:* ${product.price * quantity} MAD\n\n` +
        `*───────────────*\n` +
        `*INFOS CLIENT*\n` +
        `*Nom:* ${escapeWhatsApp(sanitizedName)}\n` +
        `*Téléphone:* ${escapeWhatsApp(sanitizedPhone)}\n` +
        `*Ville:* ${escapeWhatsApp(sanitizedCity)}\n` +
        `*Adresse:* ${escapeWhatsApp(sanitizedAddress)}\n` +
        `*Date:* ${date}`;

      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
      setShowOrderForm(false);
      setOrderForm({ name: '', phone: '', city: '', address: '' });
    } catch (error) {
      console.error('Order submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  const name = getLocalizedField(product.name, lang);
  const description = getLocalizedField(product.description, lang);
  const inWishlist = isInWishlist(product.id);
  const image = product.images[mainImage] || 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600';

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <SEO
        title={product.meta_title || `${name} | Vintage Sneakers Assouli`}
        description={product.meta_description || description.substring(0, 160)}
        image={image}
        url={`https://vintage-sneakers-assouli.ma/product/${product.slug}`}
        type="product"
        price={product.price}
        availability={product.stock > 0 ? 'InStock' : 'OutOfStock'}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Link to="/shop" className="inline-flex items-center gap-1 text-cream/50 text-sm hover:text-gold transition-colors mb-6">
          <ChevronLeft size={16} /> {t('common.back', lang)}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="aspect-square overflow-hidden rounded-lg bg-neutral-900 mb-4">
              <img src={image} alt={name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(i)}
                    className={`aspect-square overflow-hidden rounded border-2 transition-colors ${
                      mainImage === i ? 'border-gold' : 'border-transparent hover:border-gold/50'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {product.is_new_arrival && (
                  <span className="bg-gold text-black text-[10px] font-bold px-2 py-0.5 rounded">{t('common.new', lang)}</span>
                )}
                {product.is_limited_edition && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">{t('common.limited', lang)}</span>
                )}
                {product.is_best_seller && (
                  <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">{t('common.bestSeller', lang)}</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-cream">{name}</h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-gold text-2xl font-bold">{product.price} {t('product.mad', lang)}</span>
              {product.compare_price > 0 && (
                <>
                  <span className="text-cream/30 text-lg line-through">{product.compare_price} {t('product.mad', lang)}</span>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                    -{Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
                  </span>
                </>
              )}
            </div>

            {product.condition_score > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-cream/50 text-sm">{t('product.condition', lang)}:</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Star key={i} size={12} className={i < product.condition_score ? 'text-gold' : 'text-neutral-700'} fill="currentColor" />
                  ))}
                </div>
                <span className="text-gold text-xs font-medium">{product.condition_score}/10</span>
              </div>
            )}

            <p className="text-cream/60 text-sm leading-relaxed">{description}</p>

            <div>
              <p className="text-cream/50 text-sm mb-2">{t('product.sizes', lang)}</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm font-medium rounded border transition-colors min-w-[50px] ${
                      selectedSize === size
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-gold/20 text-cream/60 hover:border-gold hover:text-gold'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-cream/50 text-sm">{t('product.quantity', lang)}</span>
              <div className="flex items-center gap-3 border border-gold/20 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-2 text-cream/60 hover:text-gold disabled:opacity-40"
                >
                  <Minus size={16} />
                </button>
                <span className="text-cream font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="p-2 text-cream/60 hover:text-gold disabled:opacity-40"
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className={`text-xs ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {product.stock > 0 ? `${t('product.stock', lang)}: ${product.stock}` : t('product.outOfStock', lang)}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || product.stock <= 0}
                className="flex-1 flex items-center justify-center gap-2 border border-gold text-gold py-3 text-sm font-bold hover:bg-gold hover:text-black transition-colors rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <MessageCircle size={18} /> {t('product.addToCart', lang)}
              </button>
              <button
                onClick={() => inWishlist ? removeWish(product.id) : addWish(product.id)}
                className={`p-3 border rounded-lg transition-colors ${
                  inWishlist ? 'border-gold bg-gold/10 text-gold' : 'border-gold/20 text-cream/60 hover:text-gold'
                }`}
              >
                <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            <button
              onClick={() => setShowOrderForm(true)}
              disabled={!selectedSize || product.stock <= 0}
              className="w-full bg-[#25D366] text-white py-3.5 text-sm font-bold hover:bg-[#20bd5a] transition-colors rounded-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <MessageCircle size={18} /> {t('product.orderWhatsApp', lang)}
            </button>

            {showOrderForm && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neutral-900 border border-gold/20 rounded-lg p-6 space-y-4"
              >
                <h3 className="text-gold font-semibold text-sm">{t('order.title', lang)}</h3>

                <div>
                  <input
                    placeholder={t('order.name', lang) + ' *'}
                    value={orderForm.name}
                    onChange={e => setOrderForm({ ...orderForm, name: e.target.value })}
                    className={`w-full bg-black border px-4 py-2.5 text-sm text-cream placeholder-cream/30 focus:outline-none rounded ${formErrors.name ? 'border-red-500' : 'border-gold/20 focus:border-gold/40'}`}
                  />
                  {formErrors.name && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{formErrors.name}</p>}
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder={t('order.phone', lang) + ' *'}
                    value={orderForm.phone}
                    onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })}
                    className={`w-full bg-black border px-4 py-2.5 text-sm text-cream placeholder-cream/30 focus:outline-none rounded ${formErrors.phone ? 'border-red-500' : 'border-gold/20 focus:border-gold/40'}`}
                  />
                  {formErrors.phone && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{formErrors.phone}</p>}
                </div>

                <div>
                  <input
                    placeholder={t('order.city', lang) + ' *'}
                    value={orderForm.city}
                    onChange={e => setOrderForm({ ...orderForm, city: e.target.value })}
                    className={`w-full bg-black border px-4 py-2.5 text-sm text-cream placeholder-cream/30 focus:outline-none rounded ${formErrors.city ? 'border-red-500' : 'border-gold/20 focus:border-gold/40'}`}
                  />
                  {formErrors.city && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{formErrors.city}</p>}
                </div>

                <div>
                  <textarea
                    placeholder={t('order.address', lang) + ' *'}
                    value={orderForm.address}
                    onChange={e => setOrderForm({ ...orderForm, address: e.target.value })}
                    rows={3}
                    className={`w-full bg-black border px-4 py-2.5 text-sm text-cream placeholder-cream/30 focus:outline-none rounded resize-none ${formErrors.address ? 'border-red-500' : 'border-gold/20 focus:border-gold/40'}`}
                  />
                  {formErrors.address && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{formErrors.address}</p>}
                </div>

                <div className="flex justify-between text-sm pt-2 border-t border-gold/10">
                  <span className="text-cream/50">{t('cart.total', lang)}</span>
                  <span className="text-gold font-bold">{product.price * quantity} {t('product.mad', lang)}</span>
                </div>

                <button
                  onClick={handleWhatsAppOrder}
                  disabled={isSubmitting}
                  className="w-full bg-[#25D366] text-white py-3 text-sm font-bold hover:bg-[#20bd5a] transition-colors rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
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
                <button onClick={() => { setShowOrderForm(false); setFormErrors({}); }} className="w-full text-cream/40 text-xs py-2 hover:text-cream/60">
                  {t('admin.cancel', lang)}
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-display font-bold text-cream mb-8">{t('product.related', lang)}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
