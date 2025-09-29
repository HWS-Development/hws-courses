import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import { youtubeThumbFromUrl, splitToList } from '../utils/parsing';
import SidebarFilters from '../components/SidebarFilters';

const PAGE_SIZE = 20; // show more per page to fill width

export default function Home() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  // Query state (multi-select categories)
  const [query, setQuery] = useState({
    q: searchParams.get('q') || '',
    categories: [],
    language: '',
    page: 1,
  });

  // Options for filters
  const [options, setOptions] = useState({ categories: [], languages: [] });

  // Data
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Sync q with ?q= from navbar
  useEffect(() => {
    const urlQ = searchParams.get('q') || '';
    setQuery((prev) => ({ ...prev, q: urlQ, page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Load filter options
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

  // Fetch videos
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

  return (
    <div className="container-wide py-6">
      {/* Layout: compact sidebar + full-width grid */}
      <div className="grid gap-6 lg:grid-cols-[220px,1fr]">
        {/* Sidebar (compact, sticks under navbar) */}
        <div className="sticky top-16 self-start">
          <SidebarFilters
            value={query}
            onChange={setQuery}
            categoryOptions={options.categories}
            languageOptions={options.languages}
          />
        </div>

        {/* Content grid fills the rest */}
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
                2xl:grid-cols-5
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
    </div>
  );
}
