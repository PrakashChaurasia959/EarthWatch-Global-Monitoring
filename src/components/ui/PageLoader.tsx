import { Spinner } from './Skeleton';

export function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <Spinner size={28} />
        <p className="text-sm">Loading…</p>
      </div>
    </div>
  );
}
