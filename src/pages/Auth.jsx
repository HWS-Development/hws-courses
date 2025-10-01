import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthProvider';
import logo from '../assets/HWS-removebg-preview.png';
import { Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
  const { t } = useTranslation();
  const { session } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/';

  // ui / form state
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'reset'
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [formError, setFormError] = useState(false); // to trigger shake

  // already signed in? skip
  useEffect(() => {
    if (session) nav(redirectTo, { replace: true });
  }, [session, nav, redirectTo]);

  // --- helpers
  const validateEmail = (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).toLowerCase());

  const onEmailBlur = () => {
    if (!email) return setEmailErr(t('auth.errEmailRequired'));
    setEmailErr(validateEmail(email) ? '' : t('auth.errEmailInvalid'));
  };

  // password strength (only in register mode)
  const strength = useMemo(() => {
    if (mode !== 'register') return { score: 0, label: '' };
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[a-z]/.test(password)) s++;
    if (/\d/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    const labels = [
      t('auth.strength.veryWeak'),
      t('auth.strength.weak'),
      t('auth.strength.ok'),
      t('auth.strength.good'),
      t('auth.strength.strong'),
    ];
    return { score: Math.min(s, 5), label: labels[Math.max(0, s - 1)] };
  }, [password, mode, t]);

  // --- submit
  async function handleEmailAuth(e) {
    e.preventDefault();
    if (busy) return; // prevent double clicks
    setBusy(true); setMsg(''); setFormError(false);

    // minimal client-side checks
    if (!email || !validateEmail(email)) {
      setEmailErr(t('auth.errEmailInvalid'));
      setBusy(false);
      setFormError(true);
      return;
    }
    if (mode !== 'reset' && password.length < 6) {
      setMsg(t('auth.errPwShort'));
      setBusy(false);
      setFormError(true);
      return;
    }

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg(t('auth.checkEmail'));
      } else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // “remember me”: supabase already persists session; you can clear on logout.
        nav(redirectTo, { replace: true });
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setMsg(t('auth.checkEmail'));
      }
    } catch (err) {
      setMsg(err.message || t('auth.somethingWrong'));
      setFormError(true);
    } finally {
      setBusy(false);
    }
  }

  async function loginGoogle() {
    if (busy) return;
    setBusy(true); setMsg(''); setFormError(false);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (err) {
      setMsg(err.message || t('auth.somethingWrong'));
      setFormError(true);
      setBusy(false);
    }
  }

  return (
    <div className="container-std py-10">
      <div className="mx-auto w-full max-w-md">
        {/* Header: logo + title with breathing space */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="rounded-2xl bg-slate-50 border border-slate-200/70 shadow-sm px-5 py-3">
            <img src={logo} alt="HWS — Hospitality Web Services" className="h-10 w-auto" />
          </div>
          <h1 className="text-2xl font-bold leading-tight">
            {mode === 'register'
              ? t('auth.createAccount')
              : mode === 'reset'
              ? t('auth.resetPassword')
              : t('auth.signIn')}
          </h1>
        </div>

        <div className={`card p-6 md:p-7 space-y-6 ${formError ? 'animate-shake' : ''}`}>
          <form onSubmit={handleEmailAuth} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('auth.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (emailErr) setEmailErr(''); }}
                onBlur={onEmailBlur}
                className="input w-full h-11 focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/60"
                placeholder="you@example.com"
                autoComplete="email"
                disabled={busy}
              />
              {!!emailErr && <p className="text-xs text-red-600">{emailErr}</p>}
            </div>

            {/* Password (hidden on reset) */}
            {mode !== 'reset' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">{t('auth.password')}</label>
                  {capsOn && (
                    <span className="text-xs text-amber-600">{t('auth.capsOn')}</span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyUp={(e) => setCapsOn(e.getModifierState && e.getModifierState('CapsLock'))}
                    className="input w-full h-11 pr-24 focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/60"
                    placeholder="••••••••"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    disabled={busy}
                  />
                 <div className="absolute inset-y-0 right-2 flex items-center gap-2 pr-2">
  <button
    type="button"
    onClick={() => setShowPw((s) => !s)}
    className="p-2 rounded-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
    disabled={busy}
  >
    {showPw ? <EyeOff className="w-5 h-5 text-slate-600" /> : <Eye className="w-5 h-5 text-slate-600" />}
  </button>
</div>
                </div>

                {/* Strength + rules only in register */}
                {mode === 'register' && (
                  <div className="space-y-1">
                    <div className="h-2 rounded bg-slate-100 overflow-hidden">
                      <div
                        className={`h-2 transition-all`}
                        style={{
                          width: `${(strength.score / 5) * 100}%`,
                          background:
                            strength.score >= 4
                              ? 'var(--brand-green, #16a34a)'
                              : strength.score >= 3
                              ? 'var(--brand-orange, #f97316)'
                              : '#ef4444'
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>{strength.label}</span>
                      <span>{t('auth.rules')}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Remember me (optional UI) */}
            {mode !== 'reset' && (
              <label className="flex items-center gap-2 text-sm select-none">
                <input
                  type="checkbox"
                  className="size-4 rounded border-slate-300"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={busy}
                />
                {t('auth.remember')}
              </label>
            )}

            {/* Submit button with loading state */}
            <button
              disabled={busy}
              className="btn btn-primary w-full h-11 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {busy ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin size-4" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                    <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  </svg>
                  {t('auth.loading')}
                </span>
              ) : mode === 'register' ? t('auth.register') : mode === 'reset' ? t('auth.sendResetLink') : t('auth.signIn')}
            </button>
          </form>

          {/* OR + Google */}
          {mode !== 'reset' && (
            <>
              <div className="text-center text-sm text-slate-500">{t('auth.or')}</div>
              <button
                onClick={loginGoogle}
                disabled={busy}
                className="btn w-full h-11 border hover:bg-slate-50 btn-secondary disabled:opacity-60"
              >
                {t('auth.continueWithGoogle')}
              </button>
            </>
          )}

          {/* Inline global message */}
          {msg && <div className="text-sm text-slate-700">{msg}</div>}

          {/* Footer links: concise and aligned */}
          <div className="text-sm flex items-center justify-between">
            {mode === 'register' ? (
              <>
                <span>{t('auth.haveAccount')}</span>
                <button className="link" onClick={() => { setMode('login'); setMsg(''); }}>
                  {t('auth.signIn')}
                </button>
              </>
            ) : mode === 'login' ? (
              <>
                <button className="link" onClick={() => { setMode('register'); setMsg(''); }}>
                  {t('auth.createAccount')}
                </button>
                <button className="link" onClick={() => { setMode('reset'); setMsg(''); }}>
                  {t('auth.forgot')}
                </button>
              </>
            ) : (
              <>
                <button className="link" onClick={() => { setMode('login'); setMsg(''); }}>
                  {t('auth.backToLogin')}
                </button>
                <span />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
