import type { ReactNode } from 'react';

interface Props {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ icon, title, subtitle, action }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex items-start gap-3">
        {icon && (
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan shrink-0">
            {icon}
          </span>
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-slate-400 mt-0.5 max-w-2xl">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="sm:ml-auto flex items-center gap-2">{action}</div>}
    </div>
  );
}
