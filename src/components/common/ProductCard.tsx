import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '../../contexts/WishlistContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { t, getLocalizedField } from '../../i18n/translations';

interface Product {
  id: string;
  name: Record<string, string>;
  slug: string;
  price: number;
  compare_price?: number;
  images: string[];
  sizes: string[];
  stock: number;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_limited_edition: boolean;
  condition_score: number;
}

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { lang } = useLanguage();
  const { isInWishlist, addItem: addWish, removeItem: removeWish } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const name = getLocalizedField(product.name, lang);
  const image = product.images[0] || 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-900">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {product.is_new_arrival && (
            <span className="absolute top-2 left-2 bg-gold text-black text-[10px] font-bold px-2 py-1 rounded">
              {t('common.new', lang)}
            </span>
          )}
          {product.is_limited_edition && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
              {t('common.limited', lang)}
            </span>
          )}
          {product.is_best_seller && !product.is_new_arrival && !product.is_limited_edition && (
            <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded">
              {t('common.bestSeller', lang)}
            </span>
          )}
          {product.compare_price && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
              -{Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
            </span>
          )}
          <button
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              inWishlist ? removeWish(product.id) : addWish(product.id);
            }}
            className={`absolute bottom-2 right-2 p-2 rounded-full transition-all ${
              inWishlist ? 'bg-gold text-black' : 'bg-black/50 text-cream/60 hover:text-gold'
            }`}
          >
            <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
        </div>
      </Link>
      <div className="mt-3 space-y-1">
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-cream text-sm font-medium truncate hover:text-gold transition-colors">{name}</h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-gold font-bold text-sm">{product.price} {t('product.mad', lang)}</span>
          {product.compare_price && (
            <span className="text-cream/30 text-xs line-through">{product.compare_price} {t('product.mad', lang)}</span>
          )}
        </div>
        {product.stock <= 0 && (
          <span className="text-red-400 text-xs">{t('product.outOfStock', lang)}</span>
        )}
      </div>
    </motion.div>
  );
}
