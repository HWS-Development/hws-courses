import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthProvider';

export default function AuthPage() {
  const { t } = useTranslation();
  const { session } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/';

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  // If already signed in, skip this page
  useEffect(() => {
    if (session) nav(redirectTo, { replace: true });
  }, [session, nav, redirectTo]);

  async function handleEmailAuth(e) {
    e.preventDefault();
    setBusy(true); setMsg('');
    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg(t('auth.checkEmail'));
      } else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav(redirectTo, { replace: true });
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin, // optional: add a dedicated reset page later
        });
        if (error) throw error;
        setMsg(t('auth.checkEmail'));
      }
    } catch (err) {
      setMsg(err.message || t('auth.somethingWrong'));
    } finally {
      setBusy(false);
    }
  }

  async function loginGoogle() {
    setBusy(true); setMsg('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
      // redirect handled by Supabase → back to app → provider updates session
    } catch (err) {
      setMsg(err.message || t('auth.somethingWrong'));
      setBusy(false);
    }
  }

  return (
    <div className="container-std py-10">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          {mode === 'register' ? t('auth.createAccount') : mode === 'reset' ? t('auth.resetPassword') : t('auth.signIn')}
        </h1>

        <div className="card p-6 space-y-4">
          <form onSubmit={handleEmailAuth} className="space-y-3">
            <div>
              <label className="block text-sm mb-1">{t('auth.email')}</label>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full" placeholder="you@example.com"
              />
            </div>

            {mode !== 'reset' && (
              <div>
                <label className="block text-sm mb-1">{t('auth.password')}</label>
                <input
                  type="password" required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full" placeholder="••••••••"
                />
              </div>
            )}

            <button disabled={busy} className="btn btn-primary w-full">
              {mode === 'register' ? t('auth.register') : mode === 'reset' ? t('auth.sendResetLink') : t('auth.signIn')}
            </button>
          </form>

          {mode !== 'reset' && (
            <>
              <div className="text-center text-sm text-slate-500">{t('auth.or')}</div>
              <button onClick={loginGoogle} disabled={busy} className="btn w-full border">
                {t('auth.continueWithGoogle')}
              </button>
            </>
          )}

          {msg && <div className="text-sm text-slate-700">{msg}</div>}

          <div className="text-sm flex items-center justify-between">
            {mode === 'register' ? (
              <>
                <span>{t('auth.haveAccount')}</span>
                <button className="link" onClick={() => setMode('login')}>
                  {t('auth.signIn')}
                </button>
              </>
            ) : mode === 'login' ? (
              <>
                <button className="link" onClick={() => setMode('register')}>
                  {t('auth.createAccount')}
                </button>
                <button className="link" onClick={() => setMode('reset')}>
                  {t('auth.forgot')}
                </button>
              </>
            ) : (
              <>
                <button className="link" onClick={() => setMode('login')}>
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
