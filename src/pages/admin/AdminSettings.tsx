import { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { t, Lang } from '../../i18n/translations';
import { supabase } from '../../lib/supabase';

interface Settings {
  id: number;
  site_name: string;
  logo_url: string;
  favicon_url: string;
  contact_email: string;
  phone_number: string;
  whatsapp_number: string;
  instagram_link: string;
  facebook_link: string;
  tiktok_link: string;
  hero_title: Record<string, string>;
  hero_subtitle: Record<string, string>;
  hero_image: string;
  about_title: Record<string, string>;
  about_content: Record<string, string>;
  about_image: string;
  newsletter_text: Record<string, string>;
  home_meta_title: string;
  home_meta_description: string;
}

export default function AdminSettings() {
  const { lang } = useLanguage();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<'general' | 'hero' | 'about' | 'seo'>('general');

  useEffect(() => {
    supabase.from('site_settings').select('*').single().then(({ data }) => {
      if (data) setSettings(data as Settings);
    });
  }, []);

  const updateField = (field: string, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const updateLocalized = (field: string, l: Lang, value: string) => {
    if (!settings) return;
    const current = (settings as any)[field] as Record<string, string>;
    setSettings({ ...settings, [field]: { ...current, [l]: value } });
  };

  const handleSave = async () => {
    if (!settings) return;
    await supabase.from('site_settings').update(settings).eq('id', 1);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!settings) return <p className="text-cream/40 text-sm">{t('common.loading', lang)}</p>;

  const tabs = [
    { key: 'general' as const, label: lang === 'ar' ? 'عام' : lang === 'darija' ? 'عام' : 'General' },
    { key: 'hero' as const, label: 'Hero' },
    { key: 'about' as const, label: lang === 'ar' ? 'من نحن' : lang === 'darija' ? 'علاش' : 'About' },
    { key: 'seo' as const, label: 'SEO' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-cream">{t('admin.settings', lang)}</h2>
        {saved && <span className="text-emerald-400 text-xs">{lang === 'ar' ? 'تم الحفظ!' : lang === 'darija' ? 'تسيف!' : 'Saved!'}</span>}
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(tb => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={`px-4 py-2 text-xs rounded whitespace-nowrap ${tab === tb.key ? 'bg-gold text-black' : 'border border-gold/20 text-cream/50 hover:text-gold'}`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      <div className="bg-neutral-900 border border-gold/10 rounded-lg p-4 space-y-4">
        {tab === 'general' && (
          <>
            <div>
              <label className="text-cream/50 text-xs block mb-1">Site Name</label>
              <input value={settings.site_name} onChange={e => updateField('site_name', e.target.value)} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
            </div>
            <div>
              <label className="text-cream/50 text-xs block mb-1">Logo URL</label>
              <input value={settings.logo_url || ''} onChange={e => updateField('logo_url', e.target.value)} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
            </div>
            <div>
              <label className="text-cream/50 text-xs block mb-1">Favicon URL</label>
              <input value={settings.favicon_url || ''} onChange={e => updateField('favicon_url', e.target.value)} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
            </div>
            <div>
              <label className="text-cream/50 text-xs block mb-1">Contact Email</label>
              <input value={settings.contact_email || ''} onChange={e => updateField('contact_email', e.target.value)} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
            </div>
            <div>
              <label className="text-cream/50 text-xs block mb-1">Phone Number</label>
              <input value={settings.phone_number || ''} onChange={e => updateField('phone_number', e.target.value)} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
            </div>
            <div>
              <label className="text-cream/50 text-xs block mb-1">WhatsApp Number</label>
              <input value={settings.whatsapp_number || ''} onChange={e => updateField('whatsapp_number', e.target.value)} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
            </div>
            <div>
              <label className="text-cream/50 text-xs block mb-1">Instagram Link</label>
              <input value={settings.instagram_link || ''} onChange={e => updateField('instagram_link', e.target.value)} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
            </div>
            <div>
              <label className="text-cream/50 text-xs block mb-1">Facebook Link</label>
              <input value={settings.facebook_link || ''} onChange={e => updateField('facebook_link', e.target.value)} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
            </div>
            <div>
              <label className="text-cream/50 text-xs block mb-1">TikTok Link</label>
              <input value={settings.tiktok_link || ''} onChange={e => updateField('tiktok_link', e.target.value)} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
            </div>
          </>
        )}

        {tab === 'hero' && (
          <>
            {(['fr', 'ar', 'darija'] as Lang[]).map(l => (
              <div key={`hero_title_${l}`}>
                <label className="text-cream/50 text-xs block mb-1">Hero Title ({l.toUpperCase()})</label>
                <input value={settings.hero_title?.[l] || ''} onChange={e => updateLocalized('hero_title', l, e.target.value)} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
              </div>
            ))}
            {(['fr', 'ar', 'darija'] as Lang[]).map(l => (
              <div key={`hero_sub_${l}`}>
                <label className="text-cream/50 text-xs block mb-1">Hero Subtitle ({l.toUpperCase()})</label>
                <input value={settings.hero_subtitle?.[l] || ''} onChange={e => updateLocalized('hero_subtitle', l, e.target.value)} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
              </div>
            ))}
            <div>
              <label className="text-cream/50 text-xs block mb-1">Hero Image URL</label>
              <input value={settings.hero_image || ''} onChange={e => updateField('hero_image', e.target.value)} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
            </div>
            {(['fr', 'ar', 'darija'] as Lang[]).map(l => (
              <div key={`nl_${l}`}>
                <label className="text-cream/50 text-xs block mb-1">Newsletter Text ({l.toUpperCase()})</label>
                <input value={settings.newsletter_text?.[l] || ''} onChange={e => updateLocalized('newsletter_text', l, e.target.value)} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
              </div>
            ))}
          </>
        )}

        {tab === 'about' && (
          <>
            {(['fr', 'ar', 'darija'] as Lang[]).map(l => (
              <div key={`about_t_${l}`}>
                <label className="text-cream/50 text-xs block mb-1">About Title ({l.toUpperCase()})</label>
                <input value={settings.about_title?.[l] || ''} onChange={e => updateLocalized('about_title', l, e.target.value)} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
              </div>
            ))}
            {(['fr', 'ar', 'darija'] as Lang[]).map(l => (
              <div key={`about_c_${l}`}>
                <label className="text-cream/50 text-xs block mb-1">About Content ({l.toUpperCase()})</label>
                <textarea value={settings.about_content?.[l] || ''} onChange={e => updateLocalized('about_content', l, e.target.value)} rows={4} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded resize-none" />
              </div>
            ))}
            <div>
              <label className="text-cream/50 text-xs block mb-1">About Image URL</label>
              <input value={settings.about_image || ''} onChange={e => updateField('about_image', e.target.value)} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
            </div>
          </>
        )}

        {tab === 'seo' && (
          <>
            <div>
              <label className="text-cream/50 text-xs block mb-1">Homepage Title</label>
              <input value={settings.home_meta_title || ''} onChange={e => updateField('home_meta_title', e.target.value)} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded" />
            </div>
            <div>
              <label className="text-cream/50 text-xs block mb-1">Homepage Meta Description</label>
              <textarea value={settings.home_meta_description || ''} onChange={e => updateField('home_meta_description', e.target.value)} rows={3} className="w-full bg-black border border-gold/20 px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/40 rounded resize-none" />
            </div>
          </>
        )}

        <button onClick={handleSave} className="bg-gold text-black px-6 py-2 text-sm font-bold hover:bg-gold/90 rounded">
          {t('admin.save', lang)}
        </button>
      </div>
    </div>
  );
}
