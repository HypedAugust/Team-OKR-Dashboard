import { confidenceColor } from '@/lib/calc';
import { CONFIDENCE_LABEL } from '@/lib/constants';
import type { Confidence } from '@/lib/types';

const dotColor = {
  success: 'bg-status-success',
  warning: 'bg-status-warning',
  danger: 'bg-status-danger',
  idle: 'bg-status-idle',
} as const;

const dotsActive = { high: 3, mid: 2, low: 1 } as const;

export function ConfidenceLight({
  value,
  variant = 'dots',
}: {
  value: Confidence;
  variant?: 'dots' | 'single';
}) {
  const color = confidenceColor(value);
  const label = CONFIDENCE_LABEL[value];

  if (variant === 'single') {
    return (
      <div className="inline-flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${dotColor[color]}`} />
        <span className="text-body-md text-text-primary num">{label}</span>
      </div>
    );
  }

  const active = dotsActive[value];
  return (
    <div className="inline-flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < active ? dotColor[color] : 'bg-bg-surface3'
            }`}
          />
        ))}
      </div>
      <span className="text-body-sm text-text-secondary num">{label}</span>
    </div>
  );
}
