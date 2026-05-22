'use client';

import { ClipboardList, Database, Inbox, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { loadSampleDataAction, resetDataAction } from '@/app/actions';
import { GlobalHeader } from '@/components/header/GlobalHeader';
import { HeroSummary } from '@/components/hero/HeroSummary';
import { QuarterMetaBar } from '@/components/meta/QuarterMetaBar';
import { OKRTree } from '@/components/tree/OKRTree';
import { ScoreTable } from '@/components/score/ScoreTable';
import { KPTSection } from '@/components/retro/KPTSection';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import type { QuarterBundle } from '@/lib/types';

export function DashboardClient({ bundle }: { bundle: QuarterBundle }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [viewDate, setViewDate] = useState<Date>(() => new Date());

  const { quarter, quartersList, objectives, retros, members } = bundle;
  const isReadOnly = !!quarter && quarter.status !== 'active';
  const hasNoData = !quarter;

  function handleLoadSample() {
    startTransition(async () => {
      const r = await loadSampleDataAction();
      if (r.ok) {
        toast.show('샘플 데이터를 불러왔습니다.');
        router.push('/?q=26q2');
        router.refresh();
      } else {
        toast.show(r.error, 'error');
      }
    });
  }

  function handleReset() {
    if (!confirm('모든 데이터를 삭제하시겠습니까? (Upstash DB에서도 삭제됩니다)')) return;
    startTransition(async () => {
      const r = await resetDataAction();
      if (r.ok) {
        toast.show('데이터가 초기화되었습니다.');
        router.push('/');
        router.refresh();
      } else {
        toast.show(r.error, 'error');
      }
    });
  }

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
              <Button variant="primary" onClick={handleLoadSample} disabled={pending}>
                <Database size={16} />
                {pending ? '불러오는 중…' : '26.Q2 샘플 데이터 불러오기'}
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
              members={members}
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

          {!isReadOnly && (
            <div className="no-print px-8 mt-8 flex justify-end">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-caption text-text-muted hover:text-status-danger transition-colors"
              >
                <RotateCcw size={12} />
                전체 데이터 초기화
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
