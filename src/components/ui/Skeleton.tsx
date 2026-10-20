interface SkeletonProps {
  className?: string;
  /** Rounded full instead of default md. */
  circle?: boolean;
}

/** Shimmer skeleton loader for pending content. */
export function Skeleton({ className = '', circle = false }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${circle ? 'rounded-full' : 'rounded-md'} ${className}`}
      aria-hidden="true"
    />
  );
}

export function Spinner({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      className={`animate-spin text-accent-cyan ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
