import { useTranslation } from 'react-i18next';

export default function EmptyState() {
  const { t } = useTranslation();
  return (
    <div className="text-center py-16">
      <div className="text-3xl">😶</div>
      <h4 className="mt-2 font-semibold">{t('empty.title')}</h4>
      <p className="text-slate-500 mt-1">{t('empty.hint')}</p>
    </div>
  );
}
