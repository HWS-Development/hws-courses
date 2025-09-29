import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { youtubeThumbFromUrl } from '../utils/parsing';
import { useTranslation } from 'react-i18next';

export default function RelatedVideos({ current }) {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryFirstLine = useMemo(() => {
    if (!current?.category) return '';
    return String(current.category).split('\n')[0].trim();
  }, [current]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);

      // Strategy: find videos that share category OR language, exclude current title
      let q = supabase
        .from('HWS_YTVideos')
        .select('*')
        .neq('videotitle', current?.videotitle)
        .limit(6);

      if (categoryFirstLine) {
        q = q.ilike('category', `%${categoryFirstLine}%`);
      } else if (current?.language) {
        q = q.ilike('language', `%${current.language}%`);
      }

      const { data, error } = await q;
      if (!ignore) {
        if (error) console.error(error);
        setRows(data || []);
        setLoading(false);
      }
    }
    if (current?.videotitle) load();
    return () => { ignore = true; };
  }, [current, categoryFirstLine]);

  if (loading) return <div className="text-sm text-slate-500">{t('home.loading')}</div>;
  if (rows.length === 0) return null;

  return (
    <div className="space-y-3">
      {rows.map(v => {
        const thumb = v.thumbnail || youtubeThumbFromUrl(v.yt_url);
        return (
          <Link
            key={v.videotitle}
            to={`/watch/${encodeURIComponent(v.videotitle)}`}
            className="flex gap-3 items-center group"
            title={v.videotitle}
          >
            <div className="w-28 aspect-video rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800">
              {thumb ? <img src={thumb} alt={v.videotitle} className="w-full h-full object-cover group-hover:scale-[1.03] transition" /> : null}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium line-clamp-2">{v.videotitle}</div>
              <div className="text-xs text-slate-500 mt-1">
                {String(v.category || '').split('\n')[0] || '—'}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
