import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { youtubeIdFromUrl } from '../utils/parsing';
import { useTranslation } from 'react-i18next';

// ⭐ Import the two new components
import ShareButtons from '../components/ShareButtons';
import RelatedVideos from '../components/RelatedVideos';

export default function Watch() {
  const { t } = useTranslation();
  const { videotitle } = useParams();
  const [v, setV] = useState(null);

  useEffect(() => {
    load();
  }, [videotitle]);

  async function load() {
    const title = decodeURIComponent(videotitle);
    const { data, error } = await supabase
      .from('HWS_YTVideos')
      .select('*')
      .eq('videotitle', title)
      .single();

    if (!error) setV(data);
    else console.error(error);
  }

  if (!v) return <div className="container-std py-8">{t('home.loading')}</div>;

  const ytId = youtubeIdFromUrl(v.yt_url);
  const embed = ytId ? `https://www.youtube.com/embed/${ytId}` : '';

  return (
    <div className="container-std py-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: video player */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="aspect-video bg-black">
              {embed ? (
                <iframe
                  src={embed}
                  title={v.videotitle}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-white/70">
                  {t('watch.invalid')}
                </div>
              )}
            </div>
            <div className="p-4">
              <h1 className="text-xl font-bold">{v.videotitle}</h1>
              {v.description && (
                <p className="text-slate-600 mt-2">{v.description}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {v.category &&
                  String(v.category)
                    .split('\n')
                    .map((c) => (
                      <span key={c} className="badge">
                        {c}
                      </span>
                    ))}
                {v.language && <span className="badge">{v.language}</span>}
                {v.yt_tags &&
                  String(v.yt_tags)
                    .split(',')
                    .map((t) => (
                      <span key={t} className="badge">
                        #{t.trim()}
                      </span>
                    ))}
              </div>
            </div>
          </div>
          <Link to="/" className="link inline-block mt-4">
            {t('watch.back')}
          </Link>
        </div>

        {/* Right: sidebar */}
        <div>
          {/* Info */}
          <div className="card p-4 mb-4">
            <h3 className="font-semibold mb-2">{t('watch.info')}</h3>
            <ul className="list-disc ms-6 text-sm text-slate-700">
              <li>{t('watch.category')}: {String(v.category || '—').replaceAll('\n',' / ')}</li>
              <li>{t('watch.language')}: {v.language || '—'}</li>
              <li>{t('watch.tags')}: {v.yt_tags || '—'}</li>
            </ul>
          </div>

          {/* Share */}
          <div className="card p-4 mb-4">
            <h3 className="font-semibold mb-3">{t('watch.share')}</h3>   
            <ShareButtons title={v.videotitle} />
          </div>

          {/* Related */}
          <div className="card p-4">
            <h3 className="font-semibold mb-3">{t('watch.related')}</h3>
            <RelatedVideos current={v} />
          </div>
        </div>
      </div>
    </div>
  );
}
