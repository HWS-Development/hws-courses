import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';

const LANGS = [
  { code: 'ar', name: 'العربية', flag: '🇲🇦' }, // Morocco flag for Arabic
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const current = useMemo(
    () => LANGS.find(l => l.code === i18n.language) || LANGS[0],
    [i18n.language]
  );

  // Auto-close dropdown on outside click
  useEffect(() => {
    const onDoc = () => setOpen(false);
    if (open) document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [open]);

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    setOpen(false);
    try { localStorage.setItem('ui_lang', lng); } catch {
      console.warn('Cannot access localStorage');
    }
  };

  // Restore saved preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ui_lang');
      if (saved && saved !== i18n.language) i18n.changeLanguage(saved);
    } catch {
      console.warn('Cannot access localStorage');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      {/* Current language button */}
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        className="h-10 px-3 rounded-xl border border-slate-300  bg-white/80  hover:bg-slate-50  flex items-center gap-2"
      >
        <span className="text-lg leading-none">{current.flag}</span>
        <span className="text-sm">{current.name}</span>
        <svg className="w-4 h-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.206l3.71-3.976a.75.75 0 111.08 1.04l-4.24 4.54a.75.75 0 01-1.08 0l-4.24-4.54a.75.75 0 01.02-1.06z"/>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200  bg-white shadow-soft p-1">
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => changeLang(l.code)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-slate-50  ${
                l.code === current.code ? 'font-semibold' : ''
              }`}
            >
              <span className="text-lg">{l.flag}</span>
              <span>{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


