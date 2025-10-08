// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { Search, Moon, Sun, LogOut, Menu, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../lib/supabaseClient';
import logo from '../assets/HWS-removebg-preview.png';
import { useTheme } from '../context/ThemeProvider';

export default function Navbar() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { search } = location;
  const params = new URLSearchParams(search);
  

  const [q, setQ] = useState(params.get('q') || '');
  const [busyLogout, setBusyLogout] = useState(false);

  // theme
  const { dark, toggle } = useTheme();

  // avatar dropdown (desktop)
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const initial = useMemo(
    () => (user?.email?.[0] || 'U').toUpperCase(),
    [user?.email]
  );

  // mobile sheet
  const [mobileOpen, setMobileOpen] = useState(false);

  // detect auth page (we'll keep it only to optionally hide the hamburger)
  const onAuth = location.pathname.startsWith('/auth');

  // sync search box with URL
  useEffect(() => setQ(params.get('q') || ''), [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = (e) => {
    e.preventDefault();
    navigate(q ? `/?q=${encodeURIComponent(q)}` : '/');
  };

  const doLogout = async () => {
    try {
      setBusyLogout(true);
      await supabase.auth.signOut();
      setOpen(false);
      setMobileOpen(false);
      navigate('/auth');
    } finally {
      setBusyLogout(false);
    }
  };

  // close desktop dropdown on outside click or ESC
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

  // lock body scroll when mobile sheet is open; close on ESC
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const onKey = (e) => e.key === 'Escape' && setMobileOpen(false);
      document.addEventListener('keydown', onKey);
      return () => {
        document.body.style.overflow = prev;
        document.removeEventListener('keydown', onKey);
      };
    }
  }, [mobileOpen]);

  return (
    <>
      {/* Header */}
      <header className="header-glass sticky top-0 z-40">
        <div className="container-std">
          <div
            className={
              // Always 3 columns so search is centered even on /auth
              'h-16 grid grid-cols-[auto,1fr,auto] items-center gap-3'
            }
          >
            {/* Left: Brand + Mobile menu button (optionally hide hamburger on /auth) */}
            <div className="flex items-center gap-2">
              {!onAuth && (
                <button
                  className="sm:hidden h-10 w-10 grid place-items-center rounded-xl border border-slate-300 bg-white/80 hover:bg-slate-50"
                  aria-label="Open menu"
                  onClick={() => setMobileOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}

              <Link to="/" className="flex items-center gap-2">
                <img
                  src={logo}
                  alt="HWS Logo"
                  className="h-8 w-auto select-none"
                  draggable="false"
                />
              </Link>
            </div>

            {/* Center: Search (always visible) */}
            {location.pathname !== '/auth' && <form onSubmit={submit} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t('filters.searchPlaceholder')}
                  className="w-full h-11 pl-10 pr-3 rounded-xl input"
                />
              </div>
            </form>}

            {/* Right controls (desktop) */}
            <div className="hidden sm:flex items-center gap-3 justify-end">
              {/* Theme toggle */}
              <button
                onClick={toggle}
                className="btn btn-secondary"
                title={dark ? 'Light mode' : 'Dark mode'}
                aria-label="Theme"
              >
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <LanguageSwitcher />

              {/* Auth / Avatar */}
              {!user ? (
                <Link to="/auth" className="btn btn-secondary">
                  {t('auth.signIn')}
                </Link>
              ) : (
                <div className="relative" ref={menuRef}>
                  {/* Avatar */}
                  <button
                    onClick={() => setOpen((s) => !s)}
                    className="h-9 w-9 rounded-full grid place-items-center
                               bg-gradient-to-br from-brand-orange to-brand-blue text-white
                               shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
                    aria-haspopup="menu"
                    aria-expanded={open}
                    title={user.email}
                  >
                    <span className="text-sm font-semibold select-none">
                      {initial}
                    </span>
                  </button>

                  {/* Dropdown */}
                  {open && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-xl overflow-hidden"
                    >
                      <div className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full grid place-items-center bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold">
                          {initial}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate text-slate-900 dark:text-slate-100">
                            {user.email}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            HWS Account
                          </div>
                        </div>
                      </div>
                      <div className="h-px bg-slate-200 dark:bg-slate-700" />
                      <button
                        onClick={doLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700"
                        disabled={busyLogout}
                      >
                        <LogOut className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                        <span>{t('auth.logout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right (mobile quick actions) */}
            <div className="flex sm:hidden items-center gap-2 justify-end">
              <button
                onClick={toggle}
                className="h-10 w-10 grid place-items-center rounded-xl border border-slate-300 bg-white/80 hover:bg-slate-50"
                title={dark ? 'Light mode' : 'Dark mode'}
                aria-label="Theme"
              >
                {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay + sheet (kept as-is; still disabled from hamburger on /auth) */}
      {!onAuth && mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[9998] sm:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="
              fixed inset-y-0 right-0 w-80 max-w-[85vw]
              bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700
              z-[9999] sm:hidden shadow-xl
            "
          >
            <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
              <div className="font-medium">{t('home.heading') || 'Menu'}</div>
              <button
                className="h-9 w-9 grid place-items-center rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  {t('lang.label') || 'Language'}
                </div>
                <LanguageSwitcher />
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  {t('watch.info') || 'Account'}
                </div>
                {!user ? (
                  <Link
                    to="/auth"
                    onClick={() => setMobileOpen(false)}
                    className="btn btn-secondary w-full"
                  >
                    {t('auth.signIn')}
                  </Link>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full grid place-items-center bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold">
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate text-slate-900 dark:text-slate-100">
                          {user.email}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          HWS Account
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={doLogout}
                      className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-600 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800"
                      disabled={busyLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('auth.logout')}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
