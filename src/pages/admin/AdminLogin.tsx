import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../i18n/translations';
import SEO from '../../components/common/SEO';
import { isValidEmail } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const { login, isAdmin } = useAdmin();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/products');
      return;
    }
    const checkAdminExists = async () => {
      const { data } = await supabase.from('admin_users').select('id').limit(1);
      setNeedsSetup(!data || data.length === 0);
      setCheckingSetup(false);
    };
    checkAdminExists();
  }, [isAdmin, navigate]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError(lang === 'ar' ? 'البريد الإلكتروني غير صالح' : lang === 'darija' ? 'لإيميل ماشي صحيح' : 'Email invalide');
      return;
    }

    if (password.length < 8) {
      setError(lang === 'ar' ? 'كلمة المرور قصيرة جداً' : lang === 'darija' ? 'لو مود باس قصير بزاف' : 'Mot de passe trop court');
      return;
    }

    setLoading(true);
    const ok = await login(email.trim().toLowerCase(), password);
    if (ok) {
      navigate('/admin/products');
    } else {
      setError(lang === 'ar' ? 'بيانات الدخول غير صحيحة' : lang === 'darija' ? 'الداتا ديال الكونيكسيون ماشي صحيحة' : 'Identifiants incorrects');
    }
    setLoading(false);
  }, [email, password, login, navigate, lang]);

  if (checkingSetup) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <SEO title="Admin | Vintage Sneakers Assouli" noIndex />
        <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (needsSetup) {
    navigate('/admin/setup');
    return null;
  }

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
      <SEO title="Admin Login | Vintage Sneakers Assouli" noIndex />
      <div className="w-full max-w-sm mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-gold" />
          </div>
          <h1 className="text-2xl font-display font-bold text-cream">{t('admin.login', lang)}</h1>
          <p className="text-cream/40 text-xs mt-2">{lang === 'ar' ? 'الوصول حصراً للمديرين' : lang === 'darija' ? 'الأكسيس حصري للأدمين' : 'Accès réservé aux administrateurs'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30" />
            <input
              type="email"
              placeholder={t('admin.email', lang)}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-neutral-900 border border-gold/20 pl-10 pr-4 py-3 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40 rounded-lg"
              required
              autoComplete="email"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={t('admin.password', lang)}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-neutral-900 border border-gold/20 pl-10 pr-10 py-3 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40 rounded-lg"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/60"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-xs text-center bg-red-500/10 py-2 rounded">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-black py-3 text-sm font-bold hover:bg-gold/90 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                {lang === 'ar' ? 'جاري...' : lang === 'darija' ? 'كيداير...' : 'Connexion...'}
              </>
            ) : (
              t('admin.loginBtn', lang)
            )}
          </button>
        </form>

        <p className="text-cream/20 text-xs text-center mt-8">
          Vintage Sneakers Assouli
        </p>
      </div>
    </div>
  );
}
