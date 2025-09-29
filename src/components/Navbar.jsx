import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../lib/supabaseClient';
import logo from '../assets/HWS-removebg-preview.png';

export default function Navbar() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const [q, setQ] = useState(params.get('q') || '');
  const [busyLogout, setBusyLogout] = useState(false);

  useEffect(() => setQ(params.get('q') || ''), [search]);

  const submit = (e) => {
    e.preventDefault();
    navigate(q ? `/?q=${encodeURIComponent(q)}` : '/');
  };

  const doLogout = async () => {
    try {
      setBusyLogout(true);
      await supabase.auth.signOut(); // no scope/global; let SDK attach token
      navigate('/auth');             // hard gate after logout
    } finally {
      setBusyLogout(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-slate-200">
      <div className="container-std">
        <div className="h-16 grid grid-cols-[1fr,minmax(320px,640px),1fr] items-center gap-4">
          {/* Left: Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="HWS Logo" className="h-8 w-auto select-none" draggable="false" />
              <span className="font-bold text-slate-800">{t('brand.title')}</span>
            </Link>
          </div>

          {/* Center: Search */}
          <form onSubmit={submit} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('filters.searchPlaceholder')}
                className="w-full h-11 pl-10 pr-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
              />
            </div>
          </form>

          {/* Right: Language + Auth */}
          <div className="flex items-center gap-3 justify-end">
            <LanguageSwitcher />
            {user ? (
              <>
                <span className="hidden sm:block text-sm text-slate-600 max-w-[160px] truncate">
                  {user.email}
                </span>
                <button
                  className="btn btn-secondary disabled:opacity-60"
                  onClick={doLogout}
                  disabled={busyLogout}
                >
                  {busyLogout ? t('home.loading') : t('auth.logout')}
                </button>
              </>
            ) : (
              <Link to="/auth" className="btn btn-secondary">
                {t('auth.signIn')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
