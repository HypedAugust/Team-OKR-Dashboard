import type { ReactNode } from 'react';
import type { StatusColor } from '@/lib/types';

const accentBg: Record<StatusColor, string> = {
  success: 'bg-accent-bg-success',
  warning: 'bg-accent-bg-warning',
  danger: 'bg-accent-bg-danger',
  idle: 'bg-accent-bg-idle',
};

const accentDot: Record<StatusColor, string> = {
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
  const isSignature = variant === 'signature';

  return (
    <div
      className={`relative rounded-2xl p-7 h-[220px] flex flex-col justify-between overflow-hidden ${
        isSignature ? accentBg[color] : 'bg-bg-surface1 border border-border-subtle'
      }`}
    >
      {/* 상단 라벨 + 상태 도트 */}
      <div className="flex items-center justify-between">
        <span className="text-label-md text-text-tertiary uppercase">{label}</span>
        <span className={`w-2 h-2 rounded-full ${accentDot[color]}`} />
      </div>

      {/* 가운데 큰 값 */}
      <div className="flex flex-col gap-1.5">
        <div className="text-display-lg text-text-primary num leading-none">{value}</div>
        {hint && <span className="text-body-sm text-text-tertiary num">{hint}</span>}
        {extra}
      </div>
    </div>
  );
}
