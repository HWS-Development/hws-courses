import { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Filters({ value, onChange, categoryOptions = [], languageOptions = [] }) {
  const [local, setLocal] = useState(value);
  const { t } = useTranslation();

  useEffect(() => setLocal(value), [value]);

  const apply = () => onChange(local);
  const reset = () => {
    const def = { q: '', category: '', language: '', page: 1 };
    setLocal(def);
    onChange(def);
  };

  return (
    <div className="card p-4 mb-4">
      <div className="grid md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            className="w-full pl-10 pr-3 h-10 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            placeholder={t('filters.searchPlaceholder')}
            value={local.q}
            onChange={(e) => setLocal({ ...local, q: e.target.value })}
          />
        </div>
        <select className="h-10 rounded-xl border border-slate-300 px-3" value={local.category} onChange={(e) => setLocal({ ...local, category: e.target.value })}>
          <option value="">{t('filters.allCategories')}</option>
          {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="h-10 rounded-xl border border-slate-300 px-3" value={local.language} onChange={(e) => setLocal({ ...local, language: e.target.value })}>
          <option value="">{t('filters.allLanguages')}</option>
          {languageOptions.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <button onClick={apply} className="btn btn-primary"><Filter className="w-4 h-4" /> {t('filters.apply')}</button>
      </div>
      <div className="mt-3">
        <button onClick={reset} className="btn btn-secondary">{t('filters.reset')}</button>
      </div>
    </div>
  );
}
