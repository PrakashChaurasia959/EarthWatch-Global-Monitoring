import type { ReactNode } from 'react';

interface SelectProps<T extends string | number> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  id?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export function Select<T extends string | number>({
  value,
  onChange,
  options,
  id,
  label,
  className = '',
  disabled,
  ariaLabel,
}: SelectProps<T>) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          aria-label={ariaLabel ?? label}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange((typeof value === 'number' ? Number(e.target.value) : e.target.value) as T)}
          className="input appearance-none pr-9 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {options.map((o) => (
            <option key={String(o.value)} value={o.value} className="bg-space-800 text-slate-100">
              {o.label}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

interface FieldProps {
  label?: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function Field({ label, htmlFor, hint, children, className = '' }: FieldProps) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className="label">
          {label}
        </label>
      )}
      {children}
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}
