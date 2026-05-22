import { Check } from 'lucide-react';
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

const accentFill: Record<StatusColor, string> = {
  success: 'bg-status-success',
  warning: 'bg-status-warning',
  danger: 'bg-status-danger',
  idle: 'bg-text-tertiary',
};

interface HeroCardProps {
  label: string;
  value: string;
  hint?: string;
  variant?: 'signature' | 'plain';
  color?: StatusColor;
  /** 0..1 — signature 카드일 때만 굵은 진척도 바로 표시 */
  progress?: number;
  /** 0..1 — 임계값 위치 마커 (예: 0.6) */
  threshold?: number;
  /** true면 우상단에 "임계값 돌파" 배지 노출 */
  thresholdPassed?: boolean;
  extra?: ReactNode;
}

export function HeroCard({
  label,
  value,
  hint,
  variant = 'plain',
  color = 'idle',
  progress,
  threshold,
  thresholdPassed,
  extra,
}: HeroCardProps) {
  const isSignature = variant === 'signature';
  const pct = progress !== undefined ? Math.max(0, Math.min(1, progress)) * 100 : null;
  const thresholdPct = threshold !== undefined ? Math.max(0, Math.min(1, threshold)) * 100 : null;

  return (
    <div
      className={`relative rounded-2xl p-7 h-[220px] flex flex-col justify-between overflow-hidden ${
        isSignature
          ? `${accentBg[color]} ${thresholdPassed ? 'ring-2 ring-status-success/60' : ''}`
          : 'bg-bg-surface1 border border-border-subtle'
      }`}
    >
      {/* 상단: 라벨 + (임계값 돌파 배지) + 상태 도트 */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-label-md text-text-tertiary uppercase">{label}</span>
        <div className="flex items-center gap-2">
          {thresholdPassed && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-status-success text-bg-base text-label-sm">
              <Check size={12} strokeWidth={3.5} />
              임계값 돌파
            </span>
          )}
          <span className={`w-2.5 h-2.5 rounded-full ${accentDot[color]}`} />
        </div>
      </div>

      {/* 가운데: 큰 값 */}
      <div className="flex flex-col gap-1.5">
        <div className="text-display-lg text-text-primary num leading-none">{value}</div>
        {hint && <span className="text-body-sm text-text-tertiary num">{hint}</span>}
        {extra}
      </div>

      {/* 하단: signature 카드만 굵은 진척도 바 + 임계값 마커 */}
      {isSignature && pct !== null ? (
        <div className="mt-4">
          <div className="relative w-full h-2.5 rounded-full bg-black/15 overflow-visible">
            <div
              className={`h-full rounded-full ${accentFill[color]} transition-[width] duration-700 ease-smooth`}
              style={{ width: `${pct}%` }}
            />
            {/* 임계값 마커 */}
            {thresholdPct !== null && (
              <div
                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-text-primary/40"
                style={{ left: `${thresholdPct}%` }}
                aria-hidden
              />
            )}
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-caption text-text-tertiary num">0%</span>
            {thresholdPct !== null && (
              <span className="text-caption text-text-secondary num">
                임계값 {Math.round(thresholdPct)}%
              </span>
            )}
            <span className="text-caption text-text-tertiary num">100%</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
