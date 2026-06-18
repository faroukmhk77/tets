import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { t, getLocalizedField } from '../i18n/translations';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/common/ProductCard';
import SEO from '../components/common/SEO';
import { debounce } from '../lib/utils';

interface Category {
  id: string;
  name: Record<string, string>;
  slug: string;
}

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
  category_id: string;
}

export default function ShopPage() {
  const { lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>(searchParams.get('filter') || 'all');
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('categories').select('*').order('name').then(({ data }) => setCategories((data || []) as Category[]));
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('products').select('*').eq('is_active', true);

    if (selectedCategory) query = query.eq('category_id', selectedCategory);
    if (filterType === 'featured') query = query.eq('is_featured', true);
    if (filterType === 'new') query = query.eq('is_new_arrival', true);
    if (filterType === 'bestseller') query = query.eq('is_best_seller', true);
    if (filterType === 'limited') query = query.eq('is_limited_edition', true);

    if (sort === 'newest') query = query.order('created_at', { ascending: false });
    if (sort === 'price_asc') query = query.order('price', { ascending: true });
    if (sort === 'price_desc') query = query.order('price', { ascending: false });

    const { data } = await query;
    setProducts((data || []) as Product[]);
    setLoading(false);
  }, [selectedCategory, filterType, sort]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Filter products by search query client-side for instant feedback
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(p => {
      const name = getLocalizedField(p.name, lang).toLowerCase();
      return name.includes(query);
    });
  }, [products, searchQuery, lang]);

  const debouncedSearch = useMemo(
    () => debounce((q: string) => setSearchQuery(q), 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <SEO
        title="Boutique Sneakers Vintage | Vintage Sneakers Assouli"
        description="Parcourez notre collection exclusive de sneakers vintage authentiques - Nike, Jordan, Adidas, New Balance. Livraison partout au Maroc."
        url="https://vintage-sneakers-assouli.ma/shop"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-cream mb-2">
            {t('nav.shop', lang)}
          </h1>
          <p className="text-cream/50 text-sm mb-8">
            {filteredProducts.length} {filteredProducts.length === 1 ? t('common.product', lang) : t('common.products', lang)}
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder={t('common.search', lang) + '...'}
            onChange={handleSearchChange}
            className="w-full sm:w-64 bg-neutral-900 border border-gold/20 px-4 py-2.5 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40 rounded-lg"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center gap-2 text-cream/60 text-sm border border-gold/20 px-4 py-2 rounded"
          >
            <Filter size={16} /> {t('common.filter', lang)}
          </button>

          <div className={`${showFilters ? 'flex' : 'hidden'} sm:flex flex-wrap gap-2`}>
            {[
              { key: 'all', label: t('common.all', lang) },
              { key: 'featured', label: t('common.featured', lang) },
              { key: 'new', label: t('common.new', lang) },
              { key: 'bestseller', label: t('common.bestSeller', lang) },
              { key: 'limited', label: t('common.limited', lang) },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key)}
                className={`px-4 py-2 text-xs font-medium rounded transition-colors ${
                  filterType === f.key
                    ? 'bg-gold text-black'
                    : 'border border-gold/20 text-cream/60 hover:border-gold hover:text-gold'
                }`}
              >
                {f.label}
              </button>
            ))}

            {selectedCategory && (
              <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-1 text-red-400 text-xs px-2 hover:text-red-300">
                <X size={12} />
              </button>
            )}

            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="bg-neutral-900 border border-gold/20 text-cream/60 text-xs px-3 py-2 rounded focus:outline-none focus:border-gold/40"
            >
              <option value="newest">{t('common.sortNewest', lang)}</option>
              <option value="price_asc">{t('common.sortPriceAsc', lang)}</option>
              <option value="price_desc">{t('common.sortPriceDesc', lang)}</option>
            </select>

            <select
              value={selectedCategory || ''}
              onChange={e => setSelectedCategory(e.target.value || null)}
              className="bg-neutral-900 border border-gold/20 text-cream/60 text-xs px-3 py-2 rounded focus:outline-none focus:border-gold/40"
            >
              <option value="">{t('common.allCategories', lang)}</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{getLocalizedField(c.name, lang)}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-cream/40 text-sm">{t('common.noProducts', lang)}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
