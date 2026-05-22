import {
  achievedRatioColor,
  avgConfidence,
  avgProgress,
  confidenceColor,
  doneCount,
  formatPercent,
  progressColor,
  quarterProgress,
} from '@/lib/calc';
import { CONFIDENCE_LABEL } from '@/lib/constants';
import type { KR, Quarter } from '@/lib/types';
import { HeroCard } from './HeroCard';

export function HeroSummary({
  quarter,
  krs,
  viewDate,
}: {
  quarter: Quarter;
  krs: KR[];
  viewDate?: Date;
}) {
  const now = viewDate ?? new Date();
  const hasAnyUpdate = krs.some((k) => k.updated_at !== null);
  const avg = avgProgress(krs);
  const avgColor = progressColor(avg, hasAnyUpdate);

  const { done, total } = doneCount(krs);
  const doneColor = achievedRatioColor(done, total);

  const conf = avgConfidence(krs);
  const confColor = confidenceColor(conf);

  const qProgress = Math.round(quarterProgress(quarter.start_date, quarter.end_date, now) * 100);

  return (
    <section className="hero-summary px-8">
      {/* 섹션 헤더 — 요약 영역임을 명시 */}
      <div className="flex items-end justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="w-1 h-7 bg-status-success rounded-full" />
          <h2 className="text-heading-md text-text-primary">이번 분기 요약</h2>
        </div>
        <span className="text-caption text-text-tertiary num">
          기준 {now.toISOString().slice(0, 10)}
        </span>
      </div>

      {/* 4카드 — 모두 동일 높이/구조 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <HeroCard
          variant="signature"
          color={avgColor}
          label="전체 평균 진척도"
          value={formatPercent(avg)}
          hint={`분기 경과율 ${qProgress}%`}
        />
        <HeroCard
          variant="plain"
          color={doneColor}
          label="달성 KR"
          value={`${done}/${total}`}
          hint={total > 0 ? `${Math.round((done / total) * 100)}% 달성` : '—'}
        />
        <HeroCard
          variant="plain"
          color={confColor}
          label="평균 신뢰도"
          value={CONFIDENCE_LABEL[conf]}
          hint={confColor === 'success' ? '안정적' : confColor === 'warning' ? '주의 필요' : '위험 신호'}
        />
        <HeroCard
          variant="plain"
          color="idle"
          label="분기 경과율"
          value={`${qProgress}%`}
          hint={`${quarter.start_date} ~ ${quarter.end_date}`}
        />
      </div>
    </section>
  );
}
