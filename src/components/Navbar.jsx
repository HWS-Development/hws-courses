import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { Search, LogOut } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
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

  // avatar dropdown
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => setQ(params.get('q') || ''), [search]);

  const submit = (e) => {
    e.preventDefault();
    navigate(q ? `/?q=${encodeURIComponent(q)}` : '/');
  };

  // initial (first letter of email)
  const initial = useMemo(() => (user?.email?.[0] || 'U').toUpperCase(), [user?.email]);

  // close dropdown on outside click / escape
  useEffect(() => {
    function onDoc(e) {
      if (!open) return;
      if (e.key === 'Escape') setOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onDoc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onDoc);
    };
  }, [open]);

  const doLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-slate-200 font-space">
      <div className="container-std">
        <div className="h-16 grid grid-cols-[1fr,minmax(320px,640px),1fr] items-center gap-4">
          {/* Left: Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="HWS Logo" className="h-8 w-auto select-none" draggable="false" />
              <span className="sr-only">HWS</span>
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

          {/* Right: Language + Account */}
          <div className="flex items-center gap-3 justify-end relative">
            <LanguageSwitcher />

            {!user ? (
              <Link to="/auth" className="btn btn-secondary">
                {t('auth.signIn')}
              </Link>
            ) : (
              <div className="relative" ref={menuRef}>
                {/* Avatar button (circle with first char) */}
                <button
                  onClick={() => setOpen((s) => !s)}
                  className="h-9 w-9 rounded-full grid place-items-center
                             bg-gradient-to-br from-brand-orange to-brand-blue text-white
                             shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
                  aria-haspopup="menu"
                  aria-expanded={open}
                  title={user.email}
                >
                  <span className="text-sm font-semibold select-none">{initial}</span>
                </button>

                {/* Dropdown menu */}
                {open && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden"
                  >
                    {/* header */}
                    <div className="p-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full grid place-items-center bg-slate-100 text-slate-700 font-semibold">
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{user.email}</div>
                        <div className="text-xs text-slate-500 truncate">HWS Account</div>
                      </div>
                    </div>
                    <div className="h-px bg-slate-200" />

                    {/* actions */}
                    <button
                      onClick={doLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50"
                    >
                      <LogOut className="w-4 h-4 text-slate-600" />
                      <span>{t('auth.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
