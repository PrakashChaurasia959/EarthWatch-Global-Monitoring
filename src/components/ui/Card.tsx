import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Optional accent glow ring color class, e.g. 'shadow-glow' */
  accent?: string;
  as?: 'div' | 'section' | 'article';
  'aria-label'?: string;
}

export function Card({ children, className = '', accent = '', as = 'div', ...rest }: CardProps) {
  const Tag = as;
  return (
    <Tag className={`card p-4 sm:p-5 ${accent} ${className}`} {...(rest as Record<string, unknown>)}>
      {children}
    </Tag>
  );
}

export function CardHeader({
  title,
  subtitle,
  icon,
  action,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="flex items-start gap-2.5 min-w-0">
        {icon && <span className="mt-0.5 text-accent-cyan shrink-0">{icon}</span>}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-100 truncate">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
