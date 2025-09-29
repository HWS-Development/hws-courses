import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';

export default function Hero({ value = '', onSearch }) {
  const { t } = useTranslation();

  return (
    <div className="card p-6 md:p-10 mb-6 bg-gradient-to-r from-brand-orange/10 via-white to-brand-blue/10 dark:from-brand-orange/10 dark:via-slate-900/60 dark:to-brand-blue/10">
      <div className="max-w-3xl">
        {/* 🔹 Title + Subtitle from translations */}
        <h2 className="text-2xl md:text-3xl font-extrabold mb-2">
          {t('home.heroTitle')}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          {t('home.heroSubtitle')}
        </p>

        {/* 🔹 Search box */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            className="w-full pl-10 pr-3 h-12 rounded-2xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            placeholder={t('filters.searchPlaceholder')}
            value={value}
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
