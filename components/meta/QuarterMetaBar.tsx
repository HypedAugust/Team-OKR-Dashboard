'use client';

import { Calendar } from 'lucide-react';
import {
  currentWeek,
  formatDate,
  quarterProgress,
  thisWeekUpdateRate,
  weeksRemaining,
} from '@/lib/calc';
import type { KR, Quarter } from '@/lib/types';

function toInputDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function QuarterMetaBar({
  quarter,
  krs,
  viewDate,
  onChangeViewDate,
}: {
  quarter: Quarter;
  krs: KR[];
  viewDate: Date;
  onChangeViewDate: (d: Date) => void;
}) {
  const progress = Math.round(quarterProgress(quarter.start_date, quarter.end_date, viewDate) * 100);
  const weeksLeft = weeksRemaining(quarter.end_date, viewDate);
  const week = currentWeek(quarter.start_date, viewDate);
  const update = thisWeekUpdateRate(krs, viewDate);
  const inputValue = toInputDate(viewDate);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    if (!v) return;
    const [y, m, d] = v.split('-').map(Number);
    const next = new Date(y, (m ?? 1) - 1, d ?? 1, 9, 0, 0);
    onChangeViewDate(next);
  }

  return (
    <div className="px-8 py-5">
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
        <h1 className="text-heading-xl text-text-primary num">{quarter.name}</h1>
        <span className="text-body-md text-text-tertiary num">
          {formatDate(quarter.start_date)} ~ {formatDate(quarter.end_date)}
        </span>

        <div className="no-print ml-auto flex items-center gap-2 bg-bg-surface2 rounded-full pl-3 pr-2 py-1.5">
          <Calendar size={14} className="text-text-tertiary" />
          <label className="text-label-md text-text-tertiary">기준 날짜</label>
          <input
            type="date"
            value={inputValue}
            onChange={handleChange}
            className="bg-transparent text-body-md text-text-primary num focus:outline-none cursor-pointer"
            style={{ colorScheme: 'dark' }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-8 gap-y-2">
        <MetaItem label="경과율" value={`${progress}%`} />
        <MetaItem label="현재 주차" value={`${week}주차`} />
        <MetaItem label="남은 기간" value={`${weeksLeft}주`} />
        <MetaItem
          label="이번 주 갱신"
          value={`${update.done}/${update.total}`}
          accent={update.total > 0 && update.done === update.total ? 'success' : 'default'}
        />
      </div>
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
