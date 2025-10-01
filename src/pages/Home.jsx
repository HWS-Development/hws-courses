import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import { youtubeThumbFromUrl, splitToList } from '../utils/parsing';
import SidebarFilters from '../components/SidebarFilters';

const PAGE_SIZE = 21;

export default function Home() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  // ✅ NEW: mobile drawer state
  const [showFilters, setShowFilters] = useState(false);

  const [query, setQuery] = useState({
    q: searchParams.get('q') || '',
    categories: [],
    language: '',
    page: 1,
  });

  const [options, setOptions] = useState({ categories: [], languages: [] });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const urlQ = searchParams.get('q') || '';
    setQuery((prev) => ({ ...prev, q: urlQ, page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('HWS_YTVideos')
        .select('category,language')
        .limit(1000);
      const cats = new Set();
      const langs = new Set();
      (data || []).forEach((r) => {
        splitToList(r?.category).forEach((c) => cats.add(c));
        if (r?.language) langs.add(String(r.language).trim());
      });
      setOptions({
        categories: [...cats].filter(Boolean).sort(),
        languages: [...langs].filter(Boolean).sort(),
      });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const from = (query.page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let base = supabase.from('HWS_YTVideos').select('*', { count: 'exact' });

      if (query.q) {
        base = base.or(
          `videotitle.ilike.%${query.q}%,description.ilike.%${query.q}%,yt_tags.ilike.%${query.q}%`
        );
      }

      if (Array.isArray(query.categories) && query.categories.length > 0) {
        const catOr = query.categories
          .map((c) => `category.ilike.%${c}%`)
          .join(',');
        base = base.or(catOr);
      }

      if (query.language) {
        base = base.ilike('language', `%${query.language}%`);
      }

      base = base.order('videotitle', { ascending: true }).range(from, to);

      const { data, error, count } = await base;
      if (error) console.error(error);

      setRows(data || []);
      setTotal(count || 0);
      setLoading(false);
    })();
  }, [query]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((total || 0) / PAGE_SIZE)),
    [total]
  );

  // ✅ Helper: on apply filters from mobile drawer, أغلق اللوحة
  const applyFilters = (next) => {
    setQuery(next);
    setShowFilters(false);
  };

  const selectedCount =
    (query.categories?.length || 0) + (query.language ? 1 : 0);

  return (
    <div className="container-wide py-6">
      {/* زر الفلاتر للموبايل فقط */}
      <div className="lg:hidden mb-4 flex items-center justify-between">
        <button
          className="btn btn-secondary"
          onClick={() => setShowFilters(true)}
        >
          {t('filters.apply')} / {t('filters.allCategories')}
          {selectedCount > 0 ? (
            <span className="ms-2 inline-block rounded-full px-2 py-0.5 text-xs bg-brand-blue/10 text-brand-blue">
              {selectedCount}
            </span>
          ) : null}
        </button>
      </div>

      {/* تخطيط الديسكتوب */}
      <div className="grid gap-6 lg:grid-cols-[220px,1fr]">
        {/* Sidebar ثابت على الديسكتوب فقط */}
        <div className="sticky top-16 self-start hidden lg:block">
          <SidebarFilters
            value={query}
            onChange={setQuery}
            categoryOptions={options.categories}
            languageOptions={options.languages}
          />
        </div>

        {/* المحتوى */}
        <div>
          {loading ? (
            <div className="py-12 text-center">{t('home.loading')}</div>
          ) : rows.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-3xl">😶</div>
              <h4 className="mt-2 font-semibold">{t('empty.title')}</h4>
              <p className="text-slate-500 mt-1">{t('empty.hint')}</p>
            </div>
          ) : (
            <div
              className="
                grid gap-5
                sm:grid-cols-2
                md:grid-cols-3
                xl:grid-cols-4
                2xl:grid-cols-3
              "
            >
              {rows.map((v) => {
                const thumb = v.thumbnail || youtubeThumbFromUrl(v.yt_url);
                return (
                  <Link
                    key={v.videotitle}
                    to={`/watch/${encodeURIComponent(v.videotitle)}`}
                    className="block"
                    title={v.videotitle}
                  >
                    <div className="card overflow-hidden group hover:shadow-lg transition">
                      <div className="aspect-video bg-slate-200 overflow-hidden">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={v.videotitle}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition"
                          />
                        ) : null}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold line-clamp-2">
                          {v.videotitle}
                        </h3>
                        {v.description && (
                          <p className="text-sm text-slate-600 line-clamp-2 mt-1">
                            {v.description}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                          {v.category && (
                            <span className="badge">
                              {String(v.category).split('\n')[0]}
                            </span>
                          )}
                          {v.language && (
                            <span className="badge">{v.language}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() =>
                  setQuery((q) => ({ ...q, page: Math.max(1, q.page - 1) }))
                }
                className="btn btn-secondary"
                disabled={query.page === 1}
              >
                {t('home.prev')}
              </button>
              <span className="text-sm text-slate-600">
                {t('home.pageXofY', { x: query.page, y: totalPages })}
              </span>
              <button
                onClick={() =>
                  setQuery((q) => ({
                    ...q,
                    page: Math.min(totalPages, q.page + 1),
                  }))
                }
                className="btn btn-secondary"
                disabled={query.page === totalPages}
              >
                {t('home.next')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Mobile Drawer (filters) */}
      {showFilters && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-50 lg:hidden"
            onClick={() => setShowFilters(false)}
          />
          {/* Panel */}
          <div
            className="
              fixed inset-y-0 left-0 w-80 max-w-[85vw]
              bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700
              z-50 lg:hidden
              shadow-xl
              animate-[slideIn_.2s_ease-out]
            "
          >
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold">Filters</h3>
              <button className="btn btn-secondary" onClick={() => setShowFilters(false)}>
                ✕
              </button>
            </div>
            <div className="p-4 overflow-auto h-[calc(100vh-4rem)]">
              <SidebarFilters
                value={query}
                onChange={applyFilters}  
                categoryOptions={options.categories}
                languageOptions={options.languages}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
