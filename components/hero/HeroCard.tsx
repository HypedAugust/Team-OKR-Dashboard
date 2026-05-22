import type { ReactNode } from 'react';
import type { StatusColor } from '@/lib/types';

const accentBg: Record<StatusColor, string> = {
  success: 'bg-accent-bg-success',
  warning: 'bg-accent-bg-warning',
  danger: 'bg-accent-bg-danger',
  idle: 'bg-accent-bg-idle',
};

const accentStripe: Record<StatusColor, string> = {
  success: 'bg-status-success',
  warning: 'bg-status-warning',
  danger: 'bg-status-danger',
  idle: 'bg-status-idle',
};

interface HeroCardProps {
  label: string;
  value: string;
  hint?: string;
  variant?: 'signature' | 'plain';
  color?: StatusColor;
  extra?: ReactNode;
}

export function HeroCard({
  label,
  value,
  hint,
  variant = 'plain',
  color = 'idle',
  extra,
}: HeroCardProps) {
  if (variant === 'signature') {
    return (
      <div
        className={`relative ${accentBg[color]} rounded-xl p-7 min-h-[200px] flex flex-col justify-between overflow-hidden`}
      >
        <div className={`absolute top-0 left-0 h-full w-1.5 ${accentStripe[color]}`} />
        <div>
          <div className="text-label-md text-text-tertiary uppercase tracking-wide mb-2">
            {label}
          </div>
          <div className="text-display-hero text-text-primary num leading-none">
            {value}
          </div>
        </div>
        {(hint || extra) && (
          <div className="flex items-center justify-between mt-4">
            {hint && <span className="text-body-sm text-text-secondary num">{hint}</span>}
            {extra}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-bg-surface1 rounded-xl p-7 min-h-[200px] flex flex-col justify-between border border-border-subtle">
      <div>
        <div className="text-label-md text-text-tertiary uppercase tracking-wide mb-2">
          {label}
        </div>
        <div className="flex items-baseline gap-3">
          <div className="text-display-hero text-text-primary num leading-none">
            {value}
          </div>
          {extra}
        </div>
      </div>
      {hint && (
        <div className="text-body-sm text-text-tertiary num mt-4">{hint}</div>
      )}
    </div>
  );
}
