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
    <div className="meta-bar px-8 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <span className="text-label-md text-text-tertiary uppercase mb-2 block">현재 분기</span>
          <h1 className="text-heading-xl text-text-primary num leading-none">{quarter.name}</h1>
          <span className="text-body-sm text-text-tertiary num mt-2 block">
            {formatDate(quarter.start_date)} ~ {formatDate(quarter.end_date)}
          </span>
        </div>

        <div className="no-print flex items-center gap-2 bg-bg-surface2 rounded-full pl-4 pr-3 py-2">
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

      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 px-5 py-4 bg-bg-surface1 rounded-2xl border border-border-subtle">
        <MetaItem label="경과율" value={`${progress}%`} />
        <Divider />
        <MetaItem label="현재 주차" value={`${week}주차`} />
        <Divider />
        <MetaItem label="남은 기간" value={`${weeksLeft}주`} />
        <Divider />
        <MetaItem
          label="이번 주 갱신"
          value={`${update.done}/${update.total}`}
          accent={update.total > 0 && update.done === update.total ? 'success' : 'default'}
        />
      </div>
    </div>
  );
}

function Divider() {
  return <span className="w-px h-5 bg-border-subtle hidden sm:inline-block" />;
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
