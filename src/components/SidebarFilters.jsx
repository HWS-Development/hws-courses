import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function SidebarFilters({
  value,                 // { q, categories:[], language, page }
  onChange,
  categoryOptions = [],   // array of strings
  languageOptions = [],   // array of strings
}) {
  const { t } = useTranslation();
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  const toggleCat = (c) => {
    const set = new Set(local.categories || []);
    set.has(c) ? set.delete(c) : set.add(c);
    setLocal({ ...local, categories: Array.from(set), page: 1 });
  };

  const apply = () => onChange(local);
  const reset = () =>
    onChange({ q: '', categories: [], language: '', page: 1 });

  const anyCat = useMemo(() => (local.categories || []).length > 0, [local]);

  return (
    <aside className="sticky top-16 h-[calc(100vh-4rem)] overflow-auto pe-1">
      {/* Search (optional—can hide if you only use navbar search) */}
      <div className="flex flex-col gap-2">
        <button onClick={reset} className="btn btn-secondary">
          {t('filters.reset')}
        </button>
      </div>
      

      {/* Categories (checkbox multi-select) */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">
          {t('filters.allCategories')}
          {anyCat ? (
            <span className="ms-2 text-xs text-slate-500">
              ({local.categories.length})
            </span>
          ) : null}
        </h4>
        <div className="space-y-2">
          {categoryOptions.map((c) => {
            const checked = (local.categories || []).includes(c);
            return (
              <label key={c} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={checked}
                  onChange={() => toggleCat(c)}
                />
                <span className="truncate">{c}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Language (single select) */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">{t('filters.allLanguages')}</h4>
        <select
          className="w-full h-10 rounded-lg border border-slate-300 px-3"
          value={local.language}
          onChange={(e) =>
            setLocal({ ...local, language: e.target.value, page: 1 })
          }
        >
          <option value="">{t('filters.allLanguages')}</option>
          {languageOptions.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
        <div className="flex flex-col gap-2">
        <button onClick={apply} className="btn btn-primary">
          {t('filters.apply')}
        </button>
       
      </div>
    </aside>
  );
}
