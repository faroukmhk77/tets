import { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme, ThemeColors } from '../../contexts/ThemeContext';
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

const colorPresets = [
  { name: 'Gold/Black', bg: '#000000', primary: '#C9A962', accent: '#C9A962', text: '#FFFFFF' },
  { name: 'Royal Blue', bg: '#0a1628', primary: '#3b82f6', accent: '#60a5fa', text: '#f8fafc' },
  { name: 'Emerald', bg: '#052e16', primary: '#22c55e', accent: '#4ade80', text: '#f0fdf4' },
  { name: 'Rose', bg: '#1c0a0a', primary: '#f43f5e', accent: '#fb7185', text: '#fff1f2' },
  { name: 'Purple', bg: '#1e1b4b', primary: '#8b5cf6', accent: '#a78bfa', text: '#f5f3ff' },
  { name: 'Warm Gray', bg: '#18181b', primary: '#a1a1aa', accent: '#d4d4d8', text: '#fafafa' },
];

export default function AdminSettings() {
  const { lang } = useLanguage();
  const { theme, updateTheme } = useTheme();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);
  const [themeSaved, setThemeSaved] = useState(false);
  const [tab, setTab] = useState<'general' | 'hero' | 'about' | 'seo' | 'theme'>('general');
  const [localTheme, setLocalTheme] = useState<ThemeColors>(theme);

  useEffect(() => {
    supabase.from('site_settings').select('*').single().then(({ data }) => {
      if (data) setSettings(data as Settings);
    });
  }, []);

  useEffect(() => {
    setLocalTheme(theme);
  }, [theme]);

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

  const handleThemeSave = async () => {
    const success = await updateTheme(localTheme);
    if (success) {
      setThemeSaved(true);
      setTimeout(() => setThemeSaved(false), 2000);
    }
  };

  const applyPreset = (preset: typeof colorPresets[0]) => {
    setLocalTheme({
      bgColor: preset.bg,
      primaryColor: preset.primary,
      secondaryColor: preset.bg,
      accentColor: preset.accent,
      textColor: preset.text,
      buttonColor: preset.primary,
    });
  };

  if (!settings) return <p className="text-cream/40 text-sm">{t('common.loading', lang)}</p>;

  const tabs = [
    { key: 'general' as const, label: lang === 'ar' ? 'عام' : lang === 'darija' ? 'عام' : 'General' },
    { key: 'hero' as const, label: 'Hero' },
    { key: 'about' as const, label: lang === 'ar' ? 'من نحن' : lang === 'darija' ? 'علاش' : 'About' },
    { key: 'seo' as const, label: 'SEO' },
    { key: 'theme' as const, label: lang === 'ar' ? 'الألوان' : lang === 'darija' ? 'لكولور' : 'Theme' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-cream">{t('admin.settings', lang)}</h2>
        {(saved || themeSaved) && <span className="text-emerald-400 text-xs">{lang === 'ar' ? 'تم الحفظ!' : lang === 'darija' ? 'تسيف!' : 'Saved!'}</span>}
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

        {tab === 'theme' && (
          <>
            <div className="mb-4">
              <label className="text-cream/50 text-xs block mb-2">{lang === 'ar' ? 'أنظمة ألوان جاهزة' : lang === 'darija' ? 'لوكولور لجاهزين' : 'Color Presets'}</label>
              <div className="flex flex-wrap gap-2">
                {colorPresets.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="flex items-center gap-2 px-3 py-2 rounded border border-gold/20 hover:border-gold/40 transition-colors"
                    style={{ backgroundColor: preset.bg, color: preset.text }}
                  >
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <span className="text-xs">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-cream/50 text-xs block mb-1">{lang === 'ar' ? 'لون الخلفية' : lang === 'darija' ? 'لو ديال الفوند' : 'Background Color'}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localTheme.bgColor}
                    onChange={e => setLocalTheme({ ...localTheme, bgColor: e.target.value })}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localTheme.bgColor}
                    onChange={e => setLocalTheme({ ...localTheme, bgColor: e.target.value })}
                    className="flex-1 bg-black border border-gold/20 px-3 py-2 text-sm text-cream rounded"
                  />
                </div>
              </div>

              <div>
                <label className="text-cream/50 text-xs block mb-1">{lang === 'ar' ? 'اللون الأساسي' : lang === 'darija' ? 'لو بريمير' : 'Primary Color'}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localTheme.primaryColor}
                    onChange={e => setLocalTheme({ ...localTheme, primaryColor: e.target.value })}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localTheme.primaryColor}
                    onChange={e => setLocalTheme({ ...localTheme, primaryColor: e.target.value })}
                    className="flex-1 bg-black border border-gold/20 px-3 py-2 text-sm text-cream rounded"
                  />
                </div>
              </div>

              <div>
                <label className="text-cream/50 text-xs block mb-1">{lang === 'ar' ? 'اللون الثانوي' : lang === 'darija' ? 'لو الثاني' : 'Secondary Color'}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localTheme.secondaryColor}
                    onChange={e => setLocalTheme({ ...localTheme, secondaryColor: e.target.value })}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localTheme.secondaryColor}
                    onChange={e => setLocalTheme({ ...localTheme, secondaryColor: e.target.value })}
                    className="flex-1 bg-black border border-gold/20 px-3 py-2 text-sm text-cream rounded"
                  />
                </div>
              </div>

              <div>
                <label className="text-cream/50 text-xs block mb-1">{lang === 'ar' ? 'لون التمييز' : lang === 'darija' ? 'لو ديال الأكسان' : 'Accent Color'}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localTheme.accentColor}
                    onChange={e => setLocalTheme({ ...localTheme, accentColor: e.target.value })}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localTheme.accentColor}
                    onChange={e => setLocalTheme({ ...localTheme, accentColor: e.target.value })}
                    className="flex-1 bg-black border border-gold/20 px-3 py-2 text-sm text-cream rounded"
                  />
                </div>
              </div>

              <div>
                <label className="text-cream/50 text-xs block mb-1">{lang === 'ar' ? 'لون النص' : lang === 'darija' ? 'لو ديال ليتر' : 'Text Color'}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localTheme.textColor}
                    onChange={e => setLocalTheme({ ...localTheme, textColor: e.target.value })}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localTheme.textColor}
                    onChange={e => setLocalTheme({ ...localTheme, textColor: e.target.value })}
                    className="flex-1 bg-black border border-gold/20 px-3 py-2 text-sm text-cream rounded"
                  />
                </div>
              </div>

              <div>
                <label className="text-cream/50 text-xs block mb-1">{lang === 'ar' ? 'لون الأزرار' : lang === 'darija' ? 'لو ديال لبيوتونات' : 'Button Color'}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localTheme.buttonColor}
                    onChange={e => setLocalTheme({ ...localTheme, buttonColor: e.target.value })}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localTheme.buttonColor}
                    onChange={e => setLocalTheme({ ...localTheme, buttonColor: e.target.value })}
                    className="flex-1 bg-black border border-gold/20 px-3 py-2 text-sm text-cream rounded"
                  />
                </div>
              </div>
            </div>

            <div
              className="mt-6 p-6 rounded-lg border"
              style={{
                backgroundColor: localTheme.bgColor,
                borderColor: localTheme.primaryColor + '40',
                color: localTheme.textColor
              }}
            >
              <h3 className="text-sm font-semibold mb-3" style={{ color: localTheme.primaryColor }}>
                {lang === 'ar' ? 'معاينة الألوان' : lang === 'darija' ? 'بريفيو ديال لكولور' : 'Theme Preview'}
              </h3>
              <p className="text-xs mb-3 opacity-70">{lang === 'ar' ? 'هذا مثال على كيف ستبدو الألوان' : lang === 'darija' ? 'هادا مثال على شحال لكولور غادي يبانو' : 'This is how the colors will look'}</p>
              <button
                className="px-4 py-2 text-sm font-bold rounded"
                style={{
                  backgroundColor: localTheme.buttonColor,
                  color: localTheme.bgColor
                }}
              >
                {lang === 'ar' ? 'زر تجريبي' : lang === 'darija' ? 'بيوتون ديال تست' : 'Sample Button'}
              </button>
            </div>
          </>
        )}

        <div className="pt-4">
          <button
            onClick={tab === 'theme' ? handleThemeSave : handleSave}
            className="bg-gold text-black px-6 py-2 text-sm font-bold hover:bg-gold/90 rounded"
          >
            {t('admin.save', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
