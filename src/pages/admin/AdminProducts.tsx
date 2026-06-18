import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { t, getLocalizedField, Lang } from '../../i18n/translations';
import { supabase } from '../../lib/supabase';

interface Category {
  id: string;
  name: Record<string, string>;
  slug: string;
}

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
  category_id: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_limited_edition: boolean;
  is_active: boolean;
  meta_title: string;
  meta_description: string;
}

const emptyProduct = (): Product => ({
  id: '',
  name: { fr: '', ar: '', darija: '' },
  slug: '',
  description: { fr: '', ar: '', darija: '' },
  price: 0,
  compare_price: 0,
  images: [] as string[],
  sizes: [] as string[],
  stock: 0,
  condition_score: 10,
  category_id: '',
  is_featured: false,
  is_new_arrival: false,
  is_best_seller: false,
  is_limited_edition: false,
  is_active: true,
  meta_title: '',
  meta_description: '',
});

export default function AdminProducts() {
  const { lang } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [newImage, setNewImage] = useState('');
  const [newSize, setNewSize] = useState('');

  useEffect(() => {
    loadProducts();
    supabase.from('categories').select('*').then(({ data }) => setCategories((data || []) as Category[]));
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts((data || []) as Product[]);
  };

  const handleSave = async () => {
    if (!editing) return;
    const p = { ...editing };
    if (!p.slug && p.name.fr) {
      p.slug = p.name.fr.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    // Validate required fields
    if (!p.name.fr?.trim()) {
      alert('Name (French) is required');
      return;
    }
    if (!p.slug?.trim()) {
      alert('Slug is required');
      return;
    }
    if (p.price <= 0) {
      alert('Price must be greater than 0');
      return;
    }
    if (p.sizes.length === 0) {
      alert('At least one size is required');
      return;
    }

    if (isNew) {
      await supabase.from('products').insert(p);
    } else {
      await supabase.from('products').update(p).eq('id', p.id);
    }
    setEditing(null);
    setIsNew(false);
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    const confirmMsg = lang === 'ar' ? 'هل تريد حذف هذا المنتج؟' : lang === 'darija' ? 'واش بغيتي تحيد هاد البرودوي؟' : 'Delete this product?';
    if (!confirm(confirmMsg)) return;
    await supabase.from('products').delete().eq('id', id);
    loadProducts();
  };

  const updateField = (field: string, value: any) => {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  };

  const updateName = (l: Lang, value: string) => {
    if (!editing) return;
    setEditing({ ...editing, name: { ...editing.name, [l]: value } });
  };

  const updateDesc = (l: Lang, value: string) => {
    if (!editing) return;
    setEditing({ ...editing, description: { ...editing.description, [l]: value } });
  };

  const addImage = () => {
    if (!editing || !newImage) return;
    setEditing({ ...editing, images: [...editing.images, newImage] });
    setNewImage('');
  };

  const removeImage = (i: number) => {
    if (!editing) return;
    setEditing({ ...editing, images: editing.images.filter((_, j) => j !== i) });
  };

  const addSize = () => {
    if (!editing || !newSize) return;
    setEditing({ ...editing, sizes: [...editing.sizes, newSize] });
    setNewSize('');
  };

  const removeSize = (i: number) => {
    if (!editing) return;
    setEditing({ ...editing, sizes: editing.sizes.filter((_, j) => j !== i) });
  };

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-cream">{isNew ? t('admin.addProduct', lang) : t('admin.editProduct', lang)}</h2>
          <button onClick={() => { setEditing(null); setIsNew(false); }} className="text-cream/40 hover:text-cream"><X size={20} /></button>
        </div>

        <div className="bg-neutral-900 border border-gold/10 rounded-lg p-4 space-y-4">
          {(['fr', 'ar', 'darija'] as Lang[]).map(l => (
            <div key={l}>
              <label className="text-cream/50 text-xs block mb-1">Name ({l.toUpperCase()})</label>
              <input value={editing.name[l] || ''} onChange={e => updateName(l, e.target.value)} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
            </div>
          ))}

          <div>
            <label className="text-cream/50 text-xs block mb-1">Slug</label>
            <input value={editing.slug} onChange={e => updateField('slug', e.target.value)} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
          </div>

          {(['fr', 'ar', 'darija'] as Lang[]).map(l => (
            <div key={l}>
              <label className="text-cream/50 text-xs block mb-1">Description ({l.toUpperCase()})</label>
              <textarea value={editing.description[l] || ''} onChange={e => updateDesc(l, e.target.value)} rows={3} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded resize-none" />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-cream/50 text-xs block mb-1">Price (MAD)</label>
              <input type="number" value={editing.price} onChange={e => updateField('price', Number(e.target.value))} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
            </div>
            <div>
              <label className="text-cream/50 text-xs block mb-1">Compare Price (MAD)</label>
              <input type="number" value={editing.compare_price} onChange={e => updateField('compare_price', Number(e.target.value))} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-cream/50 text-xs block mb-1">Stock</label>
              <input type="number" value={editing.stock} onChange={e => updateField('stock', Number(e.target.value))} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
            </div>
            <div>
              <label className="text-cream/50 text-xs block mb-1">Condition Score (1-10)</label>
              <input type="number" min="1" max="10" value={editing.condition_score} onChange={e => updateField('condition_score', Number(e.target.value))} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
            </div>
          </div>

          <div>
            <label className="text-cream/50 text-xs block mb-1">Category</label>
            <select value={editing.category_id} onChange={e => updateField('category_id', e.target.value)} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded">
              <option value="">None</option>
              {categories.map(c => <option key={c.id} value={c.id}>{getLocalizedField(c.name, lang)}</option>)}
            </select>
          </div>

          <div>
            <label className="text-cream/50 text-xs block mb-1">Images</label>
            <div className="flex gap-2 mb-2">
              <input value={newImage} onChange={e => setNewImage(e.target.value)} placeholder="Image URL" className="flex-1 bg-black border border-gold/20 px-3 py-2 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40 rounded" />
              <button onClick={addImage} className="bg-gold/20 text-gold px-3 py-2 text-xs font-medium hover:bg-gold/30 rounded"><Plus size={14} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {editing.images.map((img, i) => (
                <div key={i} className="relative group">
                  <img src={img} alt="" className="w-16 h-16 object-cover rounded border border-gold/20" />
                  <button onClick={() => removeImage(i)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} /></button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-cream/50 text-xs block mb-1">Sizes</label>
            <div className="flex gap-2 mb-2">
              <input value={newSize} onChange={e => setNewSize(e.target.value)} placeholder="Size (e.g. 42)" onKeyDown={e => e.key === 'Enter' && addSize()} className="flex-1 bg-black border border-gold/20 px-3 py-2 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40 rounded" />
              <button onClick={addSize} className="bg-gold/20 text-gold px-3 py-2 text-xs font-medium hover:bg-gold/30 rounded"><Plus size={14} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {editing.sizes.map((size, i) => (
                <span key={i} className="flex items-center gap-1 bg-gold/10 text-gold text-xs px-2 py-1 rounded">
                  {size}
                  <button onClick={() => removeSize(i)}><X size={10} /></button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {(['is_featured', 'is_new_arrival', 'is_best_seller', 'is_limited_edition', 'is_active'] as const).map(f => (
              <label key={f} className="flex items-center gap-2 text-cream/60 text-xs cursor-pointer">
                <input type="checkbox" checked={editing[f] as boolean} onChange={e => updateField(f, e.target.checked)} className="accent-gold" />
                {f.replace('is_', '').replace(/_/g, ' ')}
              </label>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-cream/50 text-xs block mb-1">SEO Title</label>
              <input value={editing.meta_title} onChange={e => updateField('meta_title', e.target.value)} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
            </div>
            <div>
              <label className="text-cream/50 text-xs block mb-1">SEO Description</label>
              <input value={editing.meta_description} onChange={e => updateField('meta_description', e.target.value)} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="bg-gold text-black px-6 py-2 text-sm font-bold hover:bg-gold/90 rounded">{t('admin.save', lang)}</button>
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="border border-cream/20 text-cream/60 px-6 py-2 text-sm hover:border-gold hover:text-gold rounded">{t('admin.cancel', lang)}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-cream">{t('admin.products', lang)}</h2>
        <button
          onClick={() => { setEditing(emptyProduct()); setIsNew(true); }}
          className="flex items-center gap-1 bg-gold text-black px-4 py-2 text-xs font-bold hover:bg-gold/90 rounded"
        >
          <Plus size={14} /> {t('admin.addProduct', lang)}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/10">
              <th className="text-left text-cream/40 text-xs font-medium py-3 px-2">{lang === 'ar' ? 'الصورة' : lang === 'darija' ? 'الصورة' : 'Image'}</th>
              <th className="text-left text-cream/40 text-xs font-medium py-3 px-2">{lang === 'ar' ? 'الاسم' : lang === 'darija' ? 'الاسم' : 'Name'}</th>
              <th className="text-left text-cream/40 text-xs font-medium py-3 px-2">{t('product.price', lang)}</th>
              <th className="text-left text-cream/40 text-xs font-medium py-3 px-2">{lang === 'ar' ? 'المخزون' : lang === 'darija' ? 'الستوك' : 'Stock'}</th>
              <th className="text-left text-cream/40 text-xs font-medium py-3 px-2">{lang === 'ar' ? 'الحالة' : lang === 'darija' ? 'الحالة' : 'Status'}</th>
              <th className="text-right text-cream/40 text-xs font-medium py-3 px-2">{lang === 'ar' ? 'إجراءات' : lang === 'darija' ? 'الأكسيو' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-gold/5 hover:bg-gold/5">
                <td className="py-2 px-2">
                  <img src={p.images[0] || ''} alt="" className="w-10 h-10 object-cover rounded" />
                </td>
                <td className="py-2 px-2 text-cream text-xs">{getLocalizedField(p.name, lang)}</td>
                <td className="py-2 px-2 text-gold text-xs">{p.price} MAD</td>
                <td className="py-2 px-2 text-cream/50 text-xs">{p.stock}</td>
                <td className="py-2 px-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${p.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {p.is_active ? (lang === 'ar' ? 'نشط' : lang === 'darija' ? 'أكتيف' : 'Active') : (lang === 'ar' ? 'غير نشط' : lang === 'darija' ? 'ماشي أكتيف' : 'Inactive')}
                  </span>
                </td>
                <td className="py-2 px-2 text-right">
                  <button onClick={() => setEditing(p)} className="text-cream/40 hover:text-gold p-1"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-cream/40 hover:text-red-400 p-1 ml-1"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="text-cream/30 text-xs text-center py-8">{lang === 'ar' ? 'لا توجد منتجات' : lang === 'darija' ? 'ما كاين حتى برودوي' : 'No products yet'}</p>}
      </div>
    </div>
  );
}
