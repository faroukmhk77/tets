import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../i18n/translations';
import { ChevronRight } from 'lucide-react';
import ProductCard from '../common/ProductCard';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

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

interface Props {
  titleKey: string;
  filterKey: string;
  linkFilter: string;
}

export default function ProductSection({ titleKey, filterKey, linkFilter }: Props) {
  const { lang } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq(filterKey, true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => setProducts((data || []) as Product[]));
  }, [filterKey]);

  if (products.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-cream">
            {t(titleKey, lang)}
          </h2>
          <Link
            to={`/shop?filter=${linkFilter}`}
            className="text-gold text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            {t('common.viewAll', lang)} <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
