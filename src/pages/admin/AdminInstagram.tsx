import { useEffect, useState } from 'react';
import { Plus, Trash2, X, Image } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../i18n/translations';
import { supabase } from '../../lib/supabase';

interface InstagramItem {
  id: string;
  image_url: string;
  instagram_link: string;
  sort_order: number;
  is_active: boolean;
}

export default function AdminInstagram() {
  const { lang } = useLanguage();
  const [items, setItems] = useState<InstagramItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newLink, setNewLink] = useState('');

  useEffect(() => {
    supabase.from('instagram_gallery').select('*').order('sort_order').then(({ data }) => setItems((data || []) as InstagramItem[]));
  }, []);

  const handleAdd = async () => {
    if (!newImageUrl) return;
    await supabase.from('instagram_gallery').insert({
      image_url: newImageUrl,
      instagram_link: newLink || null,
      sort_order: items.length,
      is_active: true,
    });
    setShowAdd(false);
    setNewImageUrl('');
    setNewLink('');
    const { data } = await supabase.from('instagram_gallery').select('*').order('sort_order');
    setItems((data || []) as InstagramItem[]);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('instagram_gallery').delete().eq('id', id);
    setItems(items.filter(i => i.id !== id));
  };

  const toggleActive = async (item: InstagramItem) => {
    await supabase.from('instagram_gallery').update({ is_active: !item.is_active }).eq('id', item.id);
    setItems(items.map(i => i.id === item.id ? { ...i, is_active: !i.is_active } : i));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-cream">{t('admin.instagram', lang)}</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1 bg-gold text-black px-4 py-2 text-xs font-bold hover:bg-gold/90 rounded"
        >
          <Plus size={14} /> {lang === 'ar' ? 'إضافة صورة' : lang === 'darija' ? 'زيد صورة' : 'Add Image'}
        </button>
      </div>

      {showAdd && (
        <div className="bg-neutral-900 border border-gold/10 rounded-lg p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-cream text-sm font-medium">{lang === 'ar' ? 'إضافة صورة إنستغرام' : lang === 'darija' ? 'زيد صورة إنستا' : 'Add Instagram Image'}</h3>
            <button onClick={() => setShowAdd(false)} className="text-cream/40 hover:text-cream"><X size={18} /></button>
          </div>
          <input
            value={newImageUrl}
            onChange={e => setNewImageUrl(e.target.value)}
            placeholder={lang === 'ar' ? 'رابط الصورة' : lang === 'darija' ? 'لينك ديال الصورة' : 'Image URL'}
            className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40 rounded"
          />
          <input
            value={newLink}
            onChange={e => setNewLink(e.target.value)}
            placeholder={lang === 'ar' ? 'رابط المنشور (اختياري)' : lang === 'darija' ? 'لينك ديال البوست (اختياري)' : 'Instagram post link (optional)'}
            className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40 rounded"
          />
          <button onClick={handleAdd} className="bg-gold text-black px-4 py-2 text-xs font-bold rounded">{t('admin.save', lang)}</button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className="relative group">
            <div className={`aspect-square overflow-hidden rounded-lg border ${item.is_active ? 'border-gold/20' : 'border-cream/10 opacity-50'}`}>
              <img src={item.image_url} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => toggleActive(item)}
                className={`p-1.5 rounded text-xs ${item.is_active ? 'bg-emerald-500 text-white' : 'bg-neutral-800 text-cream/50'}`}
              >
                <Image size={12} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded bg-red-500 text-white"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !showAdd && (
        <div className="text-center py-12">
          <Image size={36} className="text-cream/20 mx-auto mb-3" />
          <p className="text-cream/30 text-xs">{lang === 'ar' ? 'لا توجد صور. أضف صورتك الأولى.' : lang === 'darija' ? 'ما كاين حتى صورة. زيد أول صورة ديالك.' : 'No images yet. Add your first Instagram image.'}</p>
        </div>
      )}
    </div>
  );
}
