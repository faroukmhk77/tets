import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { supabase } from '../../lib/supabase';
import { isValidEmail } from '../../lib/utils';

interface Props {
  onComplete: () => void;
}

export default function AdminSetup({ onComplete }: Props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [checking, setChecking] = useState(true);

  // Check if admin already exists - if so, redirect to login
  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabase.from('admin_users').select('id').limit(1);
      if (data && data.length > 0) {
        navigate('/admin/login', { replace: true });
        return;
      }
      setChecking(false);
    };
    checkAdmin();
  }, [navigate]);

  const checkPasswordStrengthFn = (pwd: string): number => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const handlePasswordChange = useCallback((pwd: string) => {
    setPassword(pwd);
    setPasswordStrength(checkPasswordStrengthFn(pwd));
  }, []);

  const getStrengthColor = (): string => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 4) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  const getStrengthLabel = (): string => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 4) return 'Medium';
    return 'Strong';
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (passwordStrength < 3) {
      setError('Password is too weak. Include uppercase, lowercase, numbers, and symbols');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({
          email: email.trim().toLowerCase(),
          password_hash: password,
        });

      if (insertError) {
        if (insertError.code === '23505') {
          setError('An admin account already exists');
        } else {
          // Show actual error for debugging
          console.error('Admin creation error:', insertError);
          setError(`Failed to create admin: ${insertError.message || insertError.code || 'Unknown error'}`);
        }
        return;
      }

      onComplete();
    } catch (err) {
      console.error('Admin creation exception:', err);
      setError(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [email, password, confirmPassword, passwordStrength, onComplete]);

  // Render loading state
  if (checking) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center bg-black">
        <SEO title="Admin Setup | Vintage Sneakers Assouli" noIndex />
        <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center bg-black">
      <SEO title="Admin Setup | Vintage Sneakers Assouli" noIndex />
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={36} className="text-gold" />
          </div>
          <h1 className="text-2xl font-display font-bold text-cream">Initial Setup</h1>
          <p className="text-cream/40 text-sm mt-2">Create your admin account to continue</p>
        </div>

        <div className="bg-neutral-900 border border-gold/20 rounded-lg p-6 mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-cream text-sm font-medium">Security Notice</p>
              <p className="text-cream/50 text-xs mt-1">
                This setup page will only appear once. Create a strong password that you can remember.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-cream/60 text-xs block mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30" />
              <input
                type="email"
                placeholder="admin@yourdomain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-gold/20 pl-10 pr-4 py-3 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40 rounded-lg"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="text-cream/60 text-xs block mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                onChange={e => handlePasswordChange(e.target.value)}
                className="w-full bg-neutral-900 border border-gold/20 pl-10 pr-10 py-3 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40 rounded-lg"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/60"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {password && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${getStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 6) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs ${passwordStrength <= 2 ? 'text-red-400' : passwordStrength <= 4 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                    {getStrengthLabel()}
                  </span>
                </div>
                <p className="text-cream/30 text-xs mt-1">
                  Use 8+ chars with uppercase, lowercase, numbers, and symbols
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="text-cream/60 text-xs block mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-gold/20 pl-10 pr-4 py-3 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40 rounded-lg"
                required
                autoComplete="new-password"
              />
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> Passwords do not match
              </p>
            )}
            {confirmPassword && password === confirmPassword && password.length >= 8 && (
              <p className="text-emerald-400 text-xs mt-1 flex items-center gap-1">
                <CheckCircle size={12} /> Passwords match
              </p>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center bg-red-500/10 py-2 rounded flex items-center justify-center gap-1">
              <AlertCircle size={12} /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || passwordStrength < 3 || password !== confirmPassword}
            className="w-full bg-gold text-black py-3 text-sm font-bold hover:bg-gold/90 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <Shield size={18} /> Create Admin Account
              </>
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
