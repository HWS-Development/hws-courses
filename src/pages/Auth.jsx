import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthProvider';
import logo from '../assets/HWS-removebg-preview.png';
import { Eye, EyeOff } from 'lucide-react';

/* ===== Helpers: تخزين الوجهة + تنظيف التخزين ===== */
const NEXT_KEY = 'hws_next';

// خزّن الوجهة في localStorage كـ fallback
const setNext = (v) => { try { if (v) localStorage.setItem(NEXT_KEY, v); } catch {} };
const getNext = () => { try { return localStorage.getItem(NEXT_KEY) || ''; } catch { return ''; } };
const clearNext = () => { try { localStorage.removeItem(NEXT_KEY); } catch {} };

// امسح فقط مفاتيح تطبيقك (واترك مفاتيح Supabase sb-*)
function clearAppStorage() {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.startsWith('sb-')) continue;       // اترك جلسة Supabase
      if (k.startsWith('hws_')) keys.push(k);  // امسح مفاتيح تطبيقك
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {
    console.error('Error clearing app storage');
  }
}

function safeDecode(v) {
  if (!v) return '';
  try { return decodeURIComponent(v); } catch {
    console.error('Error decoding next route', v);
  }
  try { return decodeURIComponent(decodeURIComponent(v)); } catch {
    console.error('Error decoding next route', v);
  }
  return v;
}

// طبع قيمة next لمسار داخلي آمن
function normalizeNext(raw) {
  let v = String(raw || '').trim();
  v = safeDecode(v);

  // لو كان رابط مطلق، خذ الجزء النسبي فقط
  try {
    const u = new URL(v, window.location.origin);
    if (u.origin === window.location.origin) {
      v = u.pathname + (u.search || '') + (u.hash || '');
    }
  } catch {
    console.error('Error normalizing next route', v);
  }

  if (!v || v === '#' || v === '/#') return '/';
  if (!v.startsWith('/')) v = '/' + v;
  if (v.startsWith('/auth')) return '/';

  return v;
}

// لا تستخدم encodeURIComponent لكل المسار؛ استخدم encodeURI حتى لا يكسر '/'
function encodePathForNav(path) {
  return encodeURI(path || '/');
}

export default function AuthPage() {
  const { t } = useTranslation();
  const { session } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  // 1) التقط الوجهة من state أو query و خزّنها كـ fallback
  useEffect(() => {
    const stateFrom = location.state?.from;
    const queryNext = new URLSearchParams(location.search).get('next');
    const chosen = stateFrom || queryNext;
    if (chosen) setNext(chosen);
  }, [location.state, location.search]);

  // 2) حدّد الوجهة الموثوقة بالترتيب: query → state → localStorage → '/'
  const computedNext = useMemo(() => {
    const queryNext = new URLSearchParams(location.search).get('next');
    const stateFrom = location.state?.from;
    const stored = getNext();
    const chosen = queryNext || stateFrom || stored || '/';
    return normalizeNext(chosen);
  }, [location.state, location.search]);

  // 3) عند وجود session: نظّف مفاتيحك وارجع للوجهة بأمان
  useEffect(() => {
    if (session) {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      const target = encodePathForNav(computedNext);
      clearNext();
      clearAppStorage();
      nav(target, { replace: true });
    }
  }, [session, computedNext, nav]);

  /* =================== UI (نفس شاشتك الحالية) =================== */
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'reset'
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [formError, setFormError] = useState(false);

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).toLowerCase());
  const onEmailBlur = () => {
    if (!email) return setEmailErr(t('auth.errEmailRequired') || 'Email is required');
    setEmailErr(validateEmail(email) ? '' : (t('auth.errEmailInvalid') || 'Invalid email'));
  };

  const strength = useMemo(() => {
    if (mode !== 'register') return { score: 0, label: '' };
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[a-z]/.test(password)) s++;
    if (/\d/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    const labels = [
      t('auth.strength.veryWeak') || 'Very weak',
      t('auth.strength.weak') || 'Weak',
      t('auth.strength.ok') || 'OK',
      t('auth.strength.good') || 'Good',
      t('auth.strength.strong') || 'Strong',
    ];
    return { score: Math.min(s, 5), label: labels[Math.max(0, s - 1)] };
  }, [password, mode, t]);

  async function handleEmailAuth(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setMsg(''); setFormError(false);

    if (!email || !validateEmail(email)) {
      setEmailErr(t('auth.errEmailInvalid') || 'Invalid email');
      setBusy(false); setFormError(true);
      return;
    }
    if (mode !== 'reset' && password.length < 6) {
      setMsg(t('auth.errPwShort') || 'Password too short');
      setBusy(false); setFormError(true);
      return;
    }

    // خزّن الوجهة الآن أيضًا (لو صار refresh أثناء العملية)
    const queryNext = new URLSearchParams(location.search).get('next');
    const stateFrom = location.state?.from;
    setNext(queryNext || stateFrom || getNext() || '/');

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg(t('auth.checkEmail') || 'Check your email to confirm.');
      } else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/auth' + (location.search || ''),
        });
        if (error) throw error;
        setMsg(t('auth.checkEmail') || 'Check your email for a reset link.');
      }
    } catch (err) {
      setMsg(err.message || t('auth.somethingWrong') || 'Something went wrong');
      setFormError(true);
    } finally {
      setBusy(false);
    }
  }

  async function loginGoogle() {
    if (busy) return;
    setBusy(true); setMsg(''); setFormError(false);
    try {
      // ارجع إلى نفس /auth مع نفس الـ ?next بعد OAuth
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth${location.search}` }
      });
      if (error) throw error;
    } catch (err) {
      setMsg(err.message || t('auth.somethingWrong') || 'Something went wrong');
      setFormError(true);
      setBusy(false);
    }
  }

  return (
    <div className="container-std py-10">
      <div className="mx-auto w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="rounded-2xl bg-slate-50 border border-slate-200/70 shadow-sm px-5 py-3">
            <img src={logo} alt="HWS — Hospitality Web Services" className="h-10 w-auto" />
          </div>
          <h1 className="text-2xl font-bold leading-tight">
            {mode === 'register' ? (t('auth.createAccount') || 'Create account')
             : mode === 'reset' ? (t('auth.resetPassword') || 'Reset password')
             : (t('auth.signIn') || 'Sign in')}
          </h1>

          {computedNext && computedNext !== '/' && (
            <p className="text-xs text-slate-500">
              {t('auth.youWillReturn') || 'You will be redirected back after signing in.'}
            </p>
          )}
        </div>

        <div className={`card p-6 md:p-7 space-y-6 ${formError ? 'animate-shake' : ''}`}>
          <form onSubmit={handleEmailAuth} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('auth.email') || 'Email'}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (emailErr) setEmailErr(''); }}
                onBlur={onEmailBlur}
                className="input w-full h-11"
                placeholder="you@example.com"
                autoComplete="email"
                disabled={busy}
              />
              {!!emailErr && <p className="text-xs text-red-600">{emailErr}</p>}
            </div>

            {mode !== 'reset' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">{t('auth.password') || 'Password'}</label>
                  {capsOn && (<span className="text-xs text-amber-600">{t('auth.capsOn') || 'Caps Lock is ON'}</span>)}
                </div>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyUp={(e) => setCapsOn(e.getModifierState && e.getModifierState('CapsLock'))}
                    className="input w-full h-11 pr-24"
                    placeholder="••••••••"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    disabled={busy}
                  />
                  <div className="absolute inset-y-0 right-2 flex items-center gap-2 pr-2">
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      className="p-2 rounded-md hover:bg-slate-100"
                      disabled={busy}
                      aria-label={showPw ? (t('auth.hide') || 'Hide') : (t('auth.show') || 'Show')}
                      title={showPw ? (t('auth.hide') || 'Hide') : (t('auth.show') || 'Show')}
                    >
                      {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button disabled={busy} className="btn btn-primary w-full h-11 disabled:opacity-60">
              {busy
                ? (t('auth.loading') || 'Loading…')
                : mode === 'register'
                ? (t('auth.register') || 'Create account')
                : mode === 'reset'
                ? (t('auth.sendResetLink') || 'Send reset link')
                : (t('auth.signIn') || 'Sign in')}
            </button>
          </form>

          {mode !== 'reset' && (
            <>
              <div className="text-center text-sm text-slate-500">{t('auth.or') || 'OR'}</div>
              <button onClick={loginGoogle} disabled={busy} className="btn w-full h-11 border hover:bg-slate-50 btn-secondary disabled:opacity-60">
                {t('auth.continueWithGoogle') || 'Continue with Google'}
              </button>
            </>
          )}

          {msg && <div className="text-sm">{msg}</div>}

          <div className="text-sm flex items-center justify-between">
            {mode === 'register' ? (
              <>
                <span>{t('auth.haveAccount') || 'Already have an account?'}</span>
                <button className="link" onClick={() => { setMode('login'); setMsg(''); }}>
                  {t('auth.signIn') || 'Sign in'}
                </button>
              </>
            ) : mode === 'login' ? (
              <>
                <button className="link" onClick={() => { setMode('register'); setMsg(''); }}>
                  {t('auth.createAccount') || 'Create account'}
                </button>
                <button className="link" onClick={() => { setMode('reset'); setMsg(''); }}>
                  {t('auth.forgot') || 'Forgot password?'}
                </button>
              </>
            ) : (
              <>
                <button className="link" onClick={() => { setMode('login'); setMsg(''); }}>
                  {t('auth.backToLogin') || 'Back to login'}
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
