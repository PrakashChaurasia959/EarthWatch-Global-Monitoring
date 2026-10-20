import type { DataResult } from '@/types/common';

type Status = 'ok' | 'error' | 'idle' | 'loading';

const COLORS: Record<Status, string> = {
  ok: 'bg-accent-green',
  error: 'bg-accent-rose',
  idle: 'bg-slate-500',
  loading: 'bg-accent-amber animate-pulse-soft',
};

const LABELS: Record<Status, string> = {
  ok: 'Live',
  error: 'Error',
  idle: 'Idle',
  loading: 'Connecting',
};

export function StatusDot({
  status,
  label,
  pulse = true,
}: {
  status: Status;
  label?: string;
  pulse?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-400" title={label ?? LABELS[status]}>
      <span className="relative flex">
        <span className={`inline-block w-2 h-2 rounded-full ${COLORS[status]} ${pulse ? '' : ''}`} />
        {status === 'ok' && (
          <span className="absolute inline-flex w-2 h-2 rounded-full bg-accent-green/40 animate-ping" aria-hidden="true" />
        )}
      </span>
      {label ?? LABELS[status]}
    </span>
  );
}

/** Convenience wrapper for DataResult status. */
export function ConnectionDot<T>({ result }: { result: DataResult<T> }) {
  return <StatusDot status={result.status} label={result.stale ? 'Cached' : undefined} />;
}
