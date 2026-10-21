import { useEffect, useState } from 'react';
import { ImageOff, ExternalLink, Calendar, Sparkles, RefreshCw } from 'lucide-react';
import { useApodGallery } from '@/hooks/useApod';
import { Card, CardHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { truncate } from '@/utils/format';
import { useLang } from '@/i18n/LanguageContext';
import type { ApodItem } from '@/types/nasa';

function ApodCard({ item, onOpen, videoLabel, imgFailLabel }: { item: ApodItem; onOpen: () => void; videoLabel: string; imgFailLabel: string }) {
  const [errored, setErrored] = useState(false);
  return (
    <button type="button" onClick={onOpen} className="card overflow-hidden text-left group p-0">
      <div className="relative aspect-[4/3] bg-space-900 overflow-hidden">
        {item.mediaType === 'video' ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs p-3 text-center">
            {videoLabel}
          </div>
        ) : errored ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-2">
            <ImageOff size={26} />
            <span className="text-[11px]">{imgFailLabel}</span>
          </div>
        ) : (
          <img
            src={item.url}
            alt={item.title}
            loading="lazy"
            onError={() => setErrored(true)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        )}
        <div className="absolute top-2 left-2 pill bg-space-950/70 text-accent-violet border border-white/10">
          <Sparkles size={12} />
        </div>
        <div className="absolute bottom-2 left-2 pill bg-space-950/70 text-slate-300 border border-white/10 max-w-fit">
          <Calendar size={12} /> {item.date}
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-slate-100 line-clamp-1">{item.title}</p>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{truncate(item.explanation, 120)}</p>
      </div>
    </button>
  );
}

export function ApodGallery() {
  const { t } = useLang();
  const { data, loading, error, refresh } = useApodGallery(9);
  const [active, setActive] = useState<ApodItem | null>(null);

  useEffect(() => {
    if (loading) setActive(null);
  }, [loading]);

  return (
    <Card>
      <CardHeader
        title={t('sat.apodTitle')}
        subtitle={t('sat.apodSubtitle')}
        icon={<Sparkles size={16} className="text-accent-violet" />}
        action={
          <Button onClick={refresh} loading={loading} variant="outline" size="sm" icon={<RefreshCw size={14} />}>
            {t('sat.apodShuffle')}
          </Button>
        }
      />

      <p className="text-xs text-slate-400 mb-4">{t('sat.apodNote')}</p>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-0 overflow-hidden">
              <Skeleton className="aspect-[4/3] rounded-none" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <ErrorState
          title={t('sat.apodLoadFail')}
          description={`${error}${error.includes('429') || error.includes('Rate') ? ' — ' + t('sat.apodDemoNote') : ''}`}
          onRetry={refresh}
        />
      )}

      {!loading && !error && data && data.length === 0 && (
        <EmptyState title={t('sat.apodNoItems')} description={t('sat.apodNoItemsDesc')} />
      )}

      {!loading && !error && data && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.map((item) => (
            <ApodCard
              key={item.date + item.url}
              item={item}
              onOpen={() => setActive(item)}
              videoLabel={t('sat.apodVideo')}
              imgFailLabel={t('sat.apodImgFail')}
            />
          ))}
        </div>
      )}

      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        size="xl"
        title={active?.title}
        footer={
          active?.url ? (
            <a href={active.url} target="_blank" rel="noreferrer noopener" className="btn btn-outline">
              <ExternalLink size={15} /> {t('common.viewSource')}
            </a>
          ) : undefined
        }
      >
        {active && (
          <div className="space-y-3">
            {active.mediaType === 'video' ? (
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10">
                <iframe
                  src={active.url}
                  title={active.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden border border-white/10 bg-space-900 max-h-[60vh] flex items-center justify-center">
                <img src={active.hdurl || active.url} alt={active.title} className="max-h-[60vh] w-auto mx-auto" loading="lazy" />
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="pill bg-white/5 border border-white/10">{active.date}</span>
              {active.copyright && <span>© {active.copyright}</span>}
              <span className="ml-auto">NASA APOD</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{active.explanation}</p>
          </div>
        )}
      </Modal>
    </Card>
  );
}
