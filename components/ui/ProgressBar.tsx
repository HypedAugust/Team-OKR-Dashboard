import type { StatusColor } from '@/lib/types';

const fillColor: Record<StatusColor, string> = {
  success: 'bg-status-success',
  warning: 'bg-status-warning',
  danger: 'bg-status-danger',
  idle: 'bg-status-idle',
};

export function ProgressBar({
  value,
  color,
  height = 8,
}: {
  value: number;
  color: StatusColor;
  height?: number;
}) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div
      className="w-full rounded-full bg-bg-surface3 overflow-hidden"
      style={{ height: `${height}px` }}
    >
      <div
        className={`${fillColor[color]} h-full rounded-full transition-[width] duration-[600ms] ease-smooth`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
