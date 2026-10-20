import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
  title?: string;
}

interface ToastContextValue {
  toast: (message: string, opts?: { variant?: ToastVariant; title?: string }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const ICONS: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle2 size={18} className="text-accent-green" />,
  error: <AlertTriangle size={18} className="text-accent-rose" />,
  info: <Info size={18} className="text-accent-cyan" />,
};

const ACCENT: Record<ToastVariant, string> = {
  success: 'border-accent-green/30',
  error: 'border-accent-rose/30',
  info: 'border-accent-cyan/30',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback<ToastContextValue['toast']>(
    (message, opts) => {
      const id = ++idRef.current;
      const variant = opts?.variant ?? 'info';
      setToasts((prev) => [...prev, { id, message, variant, title: opts?.title }]);
      window.setTimeout(() => dismiss(id), 4500);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed z-[1000] bottom-4 right-4 flex flex-col gap-2 w-[min(92vw,360px)]"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`glass animate-slide-in rounded-xl border ${ACCENT[t.variant]} px-3.5 py-3 shadow-card flex items-start gap-3`}
          >
            <span className="mt-0.5 shrink-0">{ICONS[t.variant]}</span>
            <div className="min-w-0 flex-1">
              {t.title && <p className="text-sm font-semibold text-slate-100">{t.title}</p>}
              <p className="text-sm text-slate-300 break-words">{t.message}</p>
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Convenience hook that fires a toast exactly once for a given error string. */
export function useErrorToast(error: string | null, title?: string) {
  const { toast } = useToast();
  const last = useRef<string | null>(null);
  useEffect(() => {
    if (error && error !== last.current) {
      last.current = error;
      toast(error, { variant: 'error', title: title ?? 'Data source error' });
    }
    if (!error) last.current = null;
  }, [error, title, toast]);
}
