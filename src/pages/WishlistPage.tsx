import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { t, getLocalizedField } from '../i18n/translations';
import { supabase } from '../lib/supabase';
import SEO from '../components/common/SEO';

interface Product {
  id: string;
  name: Record<string, string>;
  slug: string;
  price: number;
  compare_price: number;
  images: string[];
  sizes: string[];
  stock: number;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_limited_edition: boolean;
  condition_score: number;
}

export default function WishlistPage() {
  const { lang } = useLanguage();
  const { items, removeItem } = useWishlist();
  const { addItem: addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (items.length > 0) {
      supabase.from('products').select('*').in('id', items).eq('is_active', true).then(({ data }) => setProducts((data || []) as Product[]));
    } else {
      setProducts([]);
    }
  }, [items]);

  const handleAddToCart = (product: Product) => {
    if (product.sizes.length > 0) {
      addToCart({
        productId: product.id,
        name: getLocalizedField(product.name, lang),
        price: product.price,
        image: product.images[0] || '',
        size: product.sizes[0],
        quantity: 1,
      });
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <SEO
        title="Mes Favoris | Vintage Sneakers Assouli"
        description="Retrouvez vos sneakers vintage préférés dans votre liste de favoris."
        url="https://vintage-sneakers-assouli.ma/wishlist"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold text-cream mb-8">{t('wishlist.title', lang)}</h1>
        </motion.div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} className="text-cream/20 mx-auto mb-4" />
            <p className="text-cream/40 text-sm mb-4">{t('wishlist.empty', lang)}</p>
            <Link to="/shop" className="text-gold text-sm hover:underline">
              {t('nav.shop', lang)}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="relative group">
                  <Link to={`/product/${product.slug}`} className="block overflow-hidden rounded-lg bg-neutral-900">
                    <img
                      src={product.images[0] || 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600'}
                      alt={getLocalizedField(product.name, lang)}
                      className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </Link>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0 || product.sizes.length === 0}
                      className="p-2 rounded-full bg-gold text-black hover:bg-gold/80 disabled:opacity-50"
                      title={t('product.addToCart', lang)}
                    >
                      <ShoppingBag size={14} />
                    </button>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="p-2 rounded-full bg-red-500 text-white hover:bg-red-400"
                      title={t('cart.remove', lang)}
                    >
                      <Heart size={14} fill="currentColor" />
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <Link to={`/product/${product.slug}`}>
                    <h3 className="text-cream text-sm font-medium truncate hover:text-gold transition-colors">
                      {getLocalizedField(product.name, lang)}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gold font-bold text-sm">{product.price} {t('product.mad', lang)}</span>
                    {product.compare_price > 0 && (
                      <span className="text-cream/30 text-xs line-through">{product.compare_price}</span>
                    )}
                  </div>
                  {product.stock <= 0 && (
                    <span className="text-red-400 text-xs">{t('product.outOfStock', lang)}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
