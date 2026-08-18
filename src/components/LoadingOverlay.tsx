import { mdiLoading } from '@mdi/js';
import { Icon } from '@/components/Icon';
import { useTranslations } from 'next-intl';

export function LoadingOverlay() { const t = useTranslations(); return <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 text-white"><div className="grid place-items-center gap-3"><Icon path={mdiLoading} size={48} className="animate-spin" /><span>{t('description.loading')}</span></div></div>; }
