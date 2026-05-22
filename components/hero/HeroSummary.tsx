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
    <section className="hero-summary grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-8">
      <HeroCard
        variant="signature"
        color={avgColor}
        label="전체 평균 진척도"
        value={formatPercent(avg)}
        hint={`vs 분기 경과율 ${qProgress}%`}
      />
      <HeroCard
        variant="plain"
        color={doneColor}
        label="달성 KR"
        value={`${done}/${total}`}
        hint={total > 0 ? formatPercent(done / total) : '—'}
        extra={
          <span
            className={`w-3 h-3 rounded-full inline-block ${
              doneColor === 'success'
                ? 'bg-status-success'
                : doneColor === 'warning'
                ? 'bg-status-warning'
                : doneColor === 'danger'
                ? 'bg-status-danger'
                : 'bg-status-idle'
            }`}
          />
        }
      />
      <HeroCard
        variant="plain"
        color={confColor}
        label="평균 신뢰도"
        value={CONFIDENCE_LABEL[conf]}
        hint={confColor === 'success' ? '안정적' : confColor === 'warning' ? '주의' : '위험'}
        extra={
          <span
            className={`w-3 h-3 rounded-full inline-block ${
              confColor === 'success'
                ? 'bg-status-success'
                : confColor === 'warning'
                ? 'bg-status-warning'
                : 'bg-status-danger'
            }`}
          />
        }
      />
      <HeroCard
        variant="plain"
        label="분기 경과율"
        value={`${qProgress}%`}
        hint={`${quarter.start_date} ~ ${quarter.end_date}`}
      />
    </section>
  );
}
