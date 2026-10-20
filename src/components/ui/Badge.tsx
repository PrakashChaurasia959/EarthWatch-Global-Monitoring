import type { ReactNode } from 'react';
import type { EventCategory } from '@/types/common';
import { CATEGORY_META } from '@/utils/categories';

interface BadgeProps {
  children: ReactNode;
  color?: string;
  variant?: 'solid' | 'soft' | 'outline';
  className?: string;
  title?: string;
}

export function Badge({ children, color, variant = 'soft', className = '', title }: BadgeProps) {
  const styles =
    variant === 'solid'
      ? { backgroundColor: color ?? '#22d3ee', color: '#05070f' }
      : variant === 'outline'
        ? { borderColor: color ?? '#22d3ee', color: color ?? '#22d3ee' }
        : { backgroundColor: `${color ?? '#22d3ee'}1f`, color: color ?? '#a5f3fc' };
  return (
    <span
      title={title}
      className={`pill border ${variant === 'outline' ? '' : 'border-transparent'} ${className}`}
      style={styles}
    >
      {children}
    </span>
  );
}

/** A category pill with a color dot derived from the category metadata. */
export function CategoryBadge({ category, label }: { category: EventCategory; label?: string }) {
  const meta = CATEGORY_META[category];
  return (
    <Badge color={meta.color} title={meta.label}>
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: meta.color, boxShadow: `0 0 6px ${meta.glow}` }}
      />
      {label ?? meta.label}
    </Badge>
  );
}
