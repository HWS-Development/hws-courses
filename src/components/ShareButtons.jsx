import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, MessageCircle } from 'lucide-react';
import { FaWhatsapp ,FaEnvelope  } from "react-icons/fa";




export default function ShareButtons({ title }) {
  const { t } = useTranslation();

  const { pageUrl, text } = useMemo(() => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    return {
      pageUrl: encodeURIComponent(url),
      text: encodeURIComponent(title || ''),
    };
  }, [title]);

  const waHref = `https://wa.me/?text=${text}%20${pageUrl}`;
  const mailHref = `mailto:?subject=${text}&body=${pageUrl}`;

  return (
    <div className="flex items-center gap-3">
      {/* WhatsApp */}
      <a
  href={waHref}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={t('watch.shareWhatsApp')}
  className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
  title={t('watch.shareWhatsApp')}
>
  <FaWhatsapp className="h-5 w-5 text-green-600" />
  {/* Tooltip */}
  <span className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow transition-all duration-150 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1">
    {t('watch.shareWhatsApp')}
  </span>
</a>

      {/* Email */}
      <a
  href={mailHref}
  aria-label={t('watch.shareEmail')}
  className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
  title={t('watch.shareEmail')}
>
  <FaEnvelope className="h-5 w-5 text-blue-600" />
  {/* Tooltip */}
  <span className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow transition-all duration-150 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1">
    {t('watch.shareEmail')}
  </span>
</a>
    </div>
  );
}
