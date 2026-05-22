import type { StatusColor } from '@/lib/types';

const colorClass: Record<StatusColor, string> = {
  success: 'text-status-success',
  warning: 'text-status-warning',
  danger: 'text-status-danger',
  idle: 'text-status-idle',
};

export function ProgressCircle({
  value,
  color,
  size = 80,
  strokeWidth = 8,
  showLabel = true,
  centerContent,
}: {
  value: number;
  color: StatusColor;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  centerContent?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, value));
  const dashOffset = circumference * (1 - pct);
  const percentLabel = Math.round(value * 100);

  return (
    <div className={`relative inline-flex items-center justify-center ${colorClass[color]}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-bg-surface3"
        />
        {/* progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        {centerContent ?? (
          showLabel && (
            <span className="text-text-primary num font-semibold" style={{ fontSize: size * 0.26 }}>
              {percentLabel}%
            </span>
          )
        )}
      </div>
    </div>
  );
}
