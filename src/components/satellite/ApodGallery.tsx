import { useEffect, useState } from 'react';
import { ImageOff, ExternalLink, Calendar, Sparkles, RefreshCw } from 'lucide-react';
import { useApodGallery } from '@/hooks/useApod';
import { Card, CardHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { truncate } from '@/utils/format';
import type { ApodItem } from '@/types/nasa';

function ApodCard({ item, onOpen }: { item: ApodItem; onOpen: () => void }) {
  const [errored, setErrored] = useState(false);
  return (
    <button type="button" onClick={onOpen} className="card overflow-hidden text-left group p-0">
      <div className="relative aspect-[4/3] bg-space-900 overflow-hidden">
        {item.mediaType === 'video' ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs p-3 text-center">
            Video APOD — open for player
          </div>
        ) : errored ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-2">
            <ImageOff size={26} />
            <span className="text-[11px]">Image unavailable</span>
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
          <Sparkles size={12} /> Astronomy
        </div>
        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 pill bg-space-950/70 text-slate-300 border border-white/10 max-w-fit">
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
  const { data, loading, error, refresh } = useApodGallery(9);
  const [active, setActive] = useState<ApodItem | null>(null);

  // Reset lightbox when gallery reloads.
  useEffect(() => {
    if (loading) setActive(null);
  }, [loading]);

  return (
    <Card>
      <CardHeader
        title="Astronomy Picture of the Day (APOD)"
        subtitle="NASA — astronomy imagery, clearly distinct from Earth observation"
        icon={<Sparkles size={16} className="text-accent-violet" />}
        action={
          <Button onClick={refresh} loading={loading} variant="outline" size="sm" icon={<RefreshCw size={14} />}>
            Shuffle
          </Button>
        }
      />

      <p className="text-xs text-slate-400 mb-4">
        These are astronomy images (stars, galaxies, phenomena), not satellite photos of Earth. For Earth
        imagery, see the GIBS explorer below.
      </p>

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
          title="Could not load APOD"
          description={`${error}${error.includes('Rate limit') || error.includes('429') ? ' — the shared DEMO_KEY may be exhausted for now.' : ''}`}
          onRetry={refresh}
        />
      )}

      {!loading && !error && data && data.length === 0 && (
        <EmptyState title="No APOD items returned" description="Try shuffling again." />
      )}

      {!loading && !error && data && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.map((item) => (
            <ApodCard key={item.date + item.url} item={item} onOpen={() => setActive(item)} />
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
              <ExternalLink size={15} /> Open full size
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
                <img
                  src={active.hdurl || active.url}
                  alt={active.title}
                  className="max-h-[60vh] w-auto mx-auto"
                  loading="lazy"
                />
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
