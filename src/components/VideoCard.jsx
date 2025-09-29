import { Link } from 'react-router-dom';
import { youtubeThumbFromUrl } from '../utils/parsing';

export default function VideoCard({ v }) {
  const thumb = v.thumbnail || youtubeThumbFromUrl(v.yt_url);

  return (
    <Link to={`/watch/${encodeURIComponent(v.videotitle)}`} className="block" title={v.videotitle}>
      <div className="card overflow-hidden group hover:shadow-lg transition">
        <div className="aspect-video bg-slate-200 overflow-hidden">
          {thumb ? (
            <img src={thumb} alt={v.videotitle} className="w-full h-full object-cover group-hover:scale-[1.02] transition" />
          ) : (
            <div className="w-full h-full grid place-items-center text-slate-400">—</div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold line-clamp-2">{v.videotitle}</h3>
          {v.description && <p className="text-sm text-slate-600 line-clamp-2 mt-1">{v.description}</p>}
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
            {v.category && <span className="badge">{String(v.category).split('\n')[0]}</span>}
            {v.language && <span className="badge">{v.language}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
