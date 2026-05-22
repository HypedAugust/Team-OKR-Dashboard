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
  const year = quarter.start_date.slice(0, 4);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    if (!v) return;
    const [y, m, d] = v.split('-').map(Number);
    const next = new Date(y, (m ?? 1) - 1, d ?? 1, 9, 0, 0);
    onChangeViewDate(next);
  }

  return (
    <div className="meta-bar px-8 pt-10 pb-8 border-b border-border-subtle">
      {/* 매거진 메타 — 한 줄 */}
      <div className="flex items-center justify-between mb-6 text-label-md text-text-tertiary font-mono uppercase">
        <span className="tracking-widest">
          ISSUE №{quarter.name} · 사업전략팀 · {year}
        </span>
        <div className="no-print flex items-center gap-2">
          <Calendar size={12} className="text-text-muted" />
          <input
            type="date"
            value={inputValue}
            onChange={handleChange}
            className="bg-transparent text-label-md text-text-secondary num focus:outline-none cursor-pointer font-mono"
            style={{ colorScheme: 'dark' }}
          />
        </div>
      </div>

      {/* 거대 분기명 — 매거진 헤드라인 */}
      <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
        <h1
          className="text-text-primary num font-serif font-black tracking-tight leading-none"
          style={{ fontSize: 'clamp(72px, 12vw, 144px)' }}
        >
          {quarter.name}
        </h1>
        <div className="flex flex-col items-end text-right">
          <span className="text-label-md text-text-tertiary uppercase tracking-wider mb-1">분기 기간</span>
          <span className="text-body-lg text-text-secondary num">
            {formatDate(quarter.start_date)} — {formatDate(quarter.end_date)}
          </span>
        </div>
      </div>

      {/* 통계 라인 — 표 같은 정렬 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3 pt-6 border-t border-border-subtle">
        <Stat label="경과율" value={`${progress}%`} />
        <Stat label="현재 주차" value={`${week}주차`} />
        <Stat label="남은 기간" value={`${weeksLeft}주`} />
        <Stat
          label="이번 주 갱신"
          value={`${update.done} / ${update.total}`}
          highlight={update.total > 0 && update.done === update.total}
        />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-label-md text-text-tertiary uppercase tracking-wider">{label}</span>
      <span className={`text-heading-md num ${highlight ? 'text-status-success' : 'text-text-primary'}`}>
        {value}
      </span>
    </div>
  );
}
