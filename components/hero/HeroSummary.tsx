import {
  achievedRatioColor,
  avgConfidence,
  avgProgress,
  confidenceColor,
  doneCount,
  formatPercent,
  krDisplayStatus,
  progressColor,
  quarterProgress,
} from '@/lib/calc';
import { ACHIEVEMENT_THRESHOLDS, CONFIDENCE_LABEL } from '@/lib/constants';
import type { KR, Member, Quarter } from '@/lib/types';
import { HeroCard } from './HeroCard';
import { RiskAlertChip } from './RiskAlertChip';
import { QuarterVerdictBanner } from './QuarterVerdictBanner';

export function HeroSummary({
  quarter,
  krs,
  members,
  viewDate,
}: {
  quarter: Quarter;
  krs: KR[];
  members: Member[];
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
  const paceGap = Math.round(avg * 100) - qProgress;

  // 임계값 — Aspire 60%를 기본으로 (대부분의 KR이 Aspire이므로)
  const threshold = ACHIEVEMENT_THRESHOLDS.Aspire;
  const thresholdPassed = avg >= threshold;

  // 위험 KR 카운트
  const riskCount = krs.filter((kr) => krDisplayStatus(kr) === 'risk').length;

  return (
    <section className="hero-summary px-8">
      {/* 섹션 헤더 — 종합 상태 배너 + 위험 알림 인라인 */}
      <div className="flex flex-wrap items-center gap-3 mb-5 justify-between">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-7 bg-status-success rounded-full" />
          <h2 className="text-heading-md text-text-primary">이번 분기 요약</h2>
          <QuarterVerdictBanner
            doneCount={done}
            totalCount={total}
            quarterProgressPct={qProgress}
            riskCount={riskCount}
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <RiskAlertChip krs={krs} members={members} />
          <span className="text-caption text-text-tertiary num">
            기준 {now.toISOString().slice(0, 10)}
          </span>
        </div>
      </div>

      {/* 4카드 — gap 20px */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <HeroCard
          variant="signature"
          color={avgColor}
          label="전체 평균 진척도"
          value={formatPercent(avg)}
          hint={
            paceGap >= 0
              ? `경과율(${qProgress}%) 대비 +${paceGap}%p 앞섬`
              : `경과율(${qProgress}%) 대비 ${paceGap}%p 뒤처짐`
          }
          progress={avg}
          threshold={threshold}
          thresholdPassed={thresholdPassed}
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
