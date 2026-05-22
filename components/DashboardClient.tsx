'use client';

import { ClipboardList, Database, Inbox } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GlobalHeader } from '@/components/header/GlobalHeader';
import { HeroSummary } from '@/components/hero/HeroSummary';
import { QuarterMetaBar } from '@/components/meta/QuarterMetaBar';
import { OKRTree } from '@/components/tree/OKRTree';
import { ScoreTable } from '@/components/score/ScoreTable';
import { KPTSection } from '@/components/retro/KPTSection';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { getActiveQuarterId, getBundle, onStorageChange } from '@/lib/storage';
import { loadSampleData } from '@/lib/seed';
import type { QuarterBundle } from '@/lib/types';

export function DashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedQid = searchParams.get('q');

  const [hydrated, setHydrated] = useState(false);
  const [bundle, setBundle] = useState<QuarterBundle | null>(null);
  const [viewDate, setViewDate] = useState<Date>(() => new Date());

  // hydrate from localStorage on mount
  useEffect(() => {
    const effectiveQid = requestedQid ?? getActiveQuarterId();
    setBundle(getBundle(effectiveQid));
    setHydrated(true);
  }, [requestedQid]);

  // subscribe to storage changes (from this tab or another tab)
  useEffect(() => {
    const off = onStorageChange(() => {
      const effectiveQid = requestedQid ?? getActiveQuarterId();
      setBundle(getBundle(effectiveQid));
    });
    return off;
  }, [requestedQid]);

  if (!hydrated || !bundle) {
    return (
      <main className="min-h-screen grid place-items-center">
        <div className="text-text-tertiary text-body-md">불러오는 중…</div>
      </main>
    );
  }

  const { quarter, quartersList, objectives, retros, members } = bundle;
  const isReadOnly = !!quarter && quarter.status !== 'active';
  const hasNoData = !quarter;

  return (
    <main className="min-h-screen pb-16">
      <GlobalHeader
        current={quarter}
        quarters={quartersList}
        members={members}
        isReadOnly={isReadOnly}
      />

      {hasNoData ? (
        <EmptyState
          icon={<Inbox size={80} strokeWidth={1.5} />}
          title="분기가 아직 없습니다"
          description="새 분기를 만들거나 샘플 데이터를 불러와 시작해보세요."
          action={
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                onClick={() => {
                  loadSampleData();
                  router.push('/?q=26q2');
                }}
              >
                <Database size={16} />26.Q2 샘플 데이터 불러오기
              </Button>
            </div>
          }
        />
      ) : (
        <>
          <QuarterMetaBar
            quarter={quarter}
            krs={objectives.flatMap((o) => o.krs)}
            viewDate={viewDate}
            onChangeViewDate={setViewDate}
          />

          <div className="mb-10">
            <HeroSummary
              quarter={quarter}
              krs={objectives.flatMap((o) => o.krs)}
              viewDate={viewDate}
            />
          </div>

          {objectives.length === 0 && (
            <div className="px-8">
              <EmptyState
                icon={<ClipboardList size={64} strokeWidth={1.5} />}
                title="아직 Objective가 없습니다"
                description={
                  isReadOnly
                    ? '이 분기에는 등록된 Objective가 없습니다.'
                    : '아래의 [+ Objective 추가] 버튼으로 첫 목표를 등록하세요.'
                }
              />
            </div>
          )}

          <OKRTree
            qid={quarter.id}
            objectives={objectives}
            members={members}
            readOnly={isReadOnly}
          />

          <ScoreTable objectives={objectives} />

          <KPTSection
            qid={quarter.id}
            members={members}
            retros={retros}
            readOnly={isReadOnly}
          />
        </>
      )}
    </main>
  );
}
