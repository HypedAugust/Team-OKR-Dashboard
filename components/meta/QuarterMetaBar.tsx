import {
  currentWeek,
  formatDate,
  quarterProgress,
  thisWeekUpdateRate,
  weeksRemaining,
} from '@/lib/calc';
import type { KR, Quarter } from '@/lib/types';

export function QuarterMetaBar({ quarter, krs }: { quarter: Quarter; krs: KR[] }) {
  const now = new Date();
  const progress = Math.round(quarterProgress(quarter.start_date, quarter.end_date, now) * 100);
  const weeksLeft = weeksRemaining(quarter.end_date, now);
  const week = currentWeek(quarter.start_date, now);
  const update = thisWeekUpdateRate(krs, now);

  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 px-8 py-5">
      <h1 className="text-heading-xl text-text-primary num">{quarter.name}</h1>
      <span className="text-body-md text-text-tertiary num">
        {formatDate(quarter.start_date)} ~ {formatDate(quarter.end_date)}
      </span>
      <MetaItem label="경과율" value={`${progress}%`} />
      <MetaItem label="현재 주차" value={`${week}주차`} />
      <MetaItem label="남은 기간" value={`${weeksLeft}주`} />
      <MetaItem
        label="이번 주 갱신"
        value={`${update.done}/${update.total}`}
        accent={update.total > 0 && update.done === update.total ? 'success' : 'default'}
      />
    </div>
  );
}

function MetaItem({
  label,
  value,
  accent = 'default',
}: {
  label: string;
  value: string;
  accent?: 'default' | 'success';
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-label-md text-text-tertiary">{label}</span>
      <span
        className={`text-body-lg num ${
          accent === 'success' ? 'text-status-success' : 'text-text-primary'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
