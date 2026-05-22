'use client';

import { AlertTriangle, Check, Circle } from 'lucide-react';
import { TypeBadge } from '@/components/ui/TypeBadge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { isKRAchieved } from '@/lib/calc';
import { ACHIEVEMENT_THRESHOLDS } from '@/lib/constants';
import type { KR, Objective, StatusColor } from '@/lib/types';

type Verdict = {
  label: string;
  color: StatusColor;
  icon: React.ReactNode;
  detail: string;
};

function evaluate(kr: KR): Verdict {
  const threshold = ACHIEVEMENT_THRESHOLDS[kr.type];
  const thresholdPct = Math.round(threshold * 100);
  const achieved = isKRAchieved(kr);

  if (achieved) {
    return {
      label: '성공',
      color: 'success',
      icon: <Check size={14} strokeWidth={2.5} />,
      detail: `${kr.type} 기준 ${thresholdPct}% 달성`,
    };
  }
  if (kr.progress > 0) {
    return {
      label: '진행 중',
      color: 'warning',
      icon: <AlertTriangle size={14} strokeWidth={2.5} />,
      detail: `${kr.type} 성공 기준 ${thresholdPct}%`,
    };
  }
  return {
    label: '미시작',
    color: 'idle',
    icon: <Circle size={14} strokeWidth={2.5} />,
    detail: '아직 갱신 없음',
  };
}

function formatResult(kr: KR): string {
  const pct = Math.round(kr.progress * 100);
  if (kr.target_value !== null && kr.target_value > 0) {
    const detailPart = kr.current_detail ? ` · ${kr.current_detail}` : '';
    return `${pct}% (${kr.current_value} / ${kr.target_value})${detailPart}`;
  }
  return `${pct}%`;
}

export function ScoreTable({
  objectives,
}: {
  objectives: Array<Objective & { krs: KR[] }>;
}) {
  const allKrs = objectives.flatMap((o) => o.krs);
  if (allKrs.length === 0) return null;

  const successCount = allKrs.filter(isKRAchieved).length;

  return (
    <section className="px-8 pt-12">
      <SectionHeader
        number="03"
        title="분기 점수표"
        description="진척도 기반 자동 평가 · Aspire ≥ 60% · Commit ≥ 100%"
        right={
          <div className="flex items-baseline gap-2 px-4 py-2 bg-bg-surface2 rounded-full">
            <span className="text-label-md text-text-tertiary">달성</span>
            <span className="text-heading-md text-text-primary num">
              {successCount}/{allKrs.length}
            </span>
            <span className="text-body-sm text-text-tertiary num">
              ({allKrs.length > 0 ? Math.round((successCount / allKrs.length) * 100) : 0}%)
            </span>
          </div>
        }
      />

      <div className="bg-bg-surface1 rounded-2xl border border-border-subtle overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-bg-surface2 text-label-md text-text-tertiary">
              <th className="text-left px-4 py-3 w-28">KR</th>
              <th className="text-left px-4 py-3 w-24">유형</th>
              <th className="text-left px-4 py-3">목표</th>
              <th className="text-left px-4 py-3 w-72">결과</th>
              <th className="text-left px-4 py-3 w-36">평가</th>
            </tr>
          </thead>
          <tbody>
            {allKrs.map((kr) => (
              <ScoreRow key={kr.id} kr={kr} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const badgeBg: Record<StatusColor, string> = {
  success: 'bg-status-success-soft text-status-success',
  warning: 'bg-status-warning-soft text-status-warning',
  danger: 'bg-status-danger-soft text-status-danger',
  idle: 'bg-status-idle-soft text-text-tertiary',
};

function ScoreRow({ kr }: { kr: KR }) {
  const verdict = evaluate(kr);
  return (
    <tr className="score-row border-t border-border-subtle">
      <td className="px-4 py-4 align-top">
        <span className="text-body-md text-text-primary num">{kr.id}</span>
      </td>
      <td className="px-4 py-4 align-top">
        <TypeBadge type={kr.type} />
      </td>
      <td className="px-4 py-4 align-top">
        <span className="text-body-md text-text-secondary">{kr.target_text || '—'}</span>
      </td>
      <td className="px-4 py-4 align-top">
        <span className="text-body-md text-text-primary num break-words">
          {formatResult(kr)}
        </span>
      </td>
      <td className="px-4 py-4 align-top">
        <div className="flex flex-col gap-1">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm w-fit text-label-sm ${badgeBg[verdict.color]}`}
          >
            {verdict.icon}
            {verdict.label}
          </span>
          <span className="text-caption text-text-muted">{verdict.detail}</span>
        </div>
      </td>
    </tr>
  );
}
