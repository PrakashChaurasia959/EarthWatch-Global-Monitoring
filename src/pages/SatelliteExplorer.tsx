import { Satellite } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ApodGallery } from '@/components/satellite/ApodGallery';
import { GibsExplorer } from '@/components/satellite/GibsExplorer';
import { Card } from '@/components/ui/Card';
import { USING_DEMO_KEY } from '@/config/env';
import { useLang } from '@/i18n/LanguageContext';

export default function SatelliteExplorer() {
  const { t } = useLang();
  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in">
      <PageHeader icon={<Satellite size={18} />} title={t('sat.title')} subtitle={t('sat.subtitle')} />

      <GibsExplorer />

      <ApodGallery />

      <Card>
        <h3 className="text-sm font-semibold text-slate-100 mb-2">{t('sat.aboutResources')}</h3>
        <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
          <li>{t('sat.res1')}</li>
          <li>{t('sat.res2')}</li>
          <li>{t('sat.res3')}</li>
          <li>{t('sat.res4')}{USING_DEMO_KEY ? t('sat.demonoteFull') : t('sat.realKeyNote')}</li>
        </ul>
      </Card>
    </div>
  );
}
