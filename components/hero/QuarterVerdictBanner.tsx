import type { StatusColor } from '@/lib/types';

interface VerdictResult {
  label: string;
  color: StatusColor;
  detail: string;
}

function computeVerdict(
  done: number,
  total: number,
  quarterProgressPct: number,
  riskCount: number
): VerdictResult | null {
  if (total === 0) return null;
  // 분기 경과율 20% 미만이면 판단 보류
  if (quarterProgressPct < 20) {
    return {
      label: '진행 중',
      color: 'idle',
      detail: '분기 초반 · 판단 보류',
    };
  }

  const doneRatio = (done / total) * 100;

  // 80% 이상 달성 — 초과 달성
  if (doneRatio >= 80) {
    return {
      label: '목표 초과 달성',
      color: 'success',
      detail: `KR ${done}/${total} 달성`,
    };
  }

  // 분기 경과율 이상 달성 — 순항
  if (doneRatio >= quarterProgressPct) {
    return {
      label: '분기 순항',
      color: 'success',
      detail: `KR ${done}/${total} 달성 · 페이스 양호`,
    };
  }

  // 위험 KR이 달성보다 많으면 위기
  if (riskCount > done && quarterProgressPct >= 40) {
    return {
      label: '위기 신호',
      color: 'danger',
      detail: `위험 ${riskCount}건 vs 달성 ${done}건`,
    };
  }

  // 그 외 — 주의
  return {
    label: '주의 필요',
    color: 'warning',
    detail: `달성률(${Math.round(doneRatio)}%) < 경과율(${quarterProgressPct}%)`,
  };
}

const bgClass: Record<StatusColor, string> = {
  success: 'bg-status-success text-bg-base',
  warning: 'bg-status-warning text-bg-base',
  danger: 'bg-status-danger text-bg-base',
  idle: 'bg-bg-surface3 text-text-secondary',
};

export function QuarterVerdictBanner({
  doneCount,
  totalCount,
  quarterProgressPct,
  riskCount,
}: {
  doneCount: number;
  totalCount: number;
  quarterProgressPct: number;
  riskCount: number;
}) {
  const v = computeVerdict(doneCount, totalCount, quarterProgressPct, riskCount);
  if (!v) return null;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${bgClass[v.color]}`}
      title={v.detail}
    >
      <span className="text-label-sm">{v.label}</span>
      <span className="text-caption opacity-80">· {v.detail}</span>
    </span>
  );
}
