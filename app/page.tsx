import { ClipboardList, Inbox } from 'lucide-react';
import { GlobalHeader } from '@/components/header/GlobalHeader';
import { HeroSummary } from '@/components/hero/HeroSummary';
import { QuarterMetaBar } from '@/components/meta/QuarterMetaBar';
import { OKRTree } from '@/components/tree/OKRTree';
import { ScoreTable } from '@/components/score/ScoreTable';
import { KPTSection } from '@/components/retro/KPTSection';
import { EmptyState } from '@/components/ui/EmptyState';
import { getActiveQuarterId, getQuarterBundle } from '@/lib/kv';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const qid = searchParams.q ?? (await getActiveQuarterId());
  const bundle = await getQuarterBundle(qid);

  const { quarter, quartersList, objectives, finalScores, retros, members } = bundle;
  const isReadOnly = !!quarter && quarter.status !== 'active';

  return (
    <main className="min-h-screen pb-16">
      <GlobalHeader
        current={quarter}
        quarters={quartersList}
        members={members}
        isReadOnly={isReadOnly}
      />

      {!quarter ? (
        <EmptyState
          icon={<Inbox size={80} strokeWidth={1.5} />}
          title="분기가 아직 없습니다"
          description="우상단의 [+ 새 분기] 버튼으로 첫 분기를 만들어주세요."
        />
      ) : (
        <>
          <QuarterMetaBar quarter={quarter} krs={objectives.flatMap((o) => o.krs)} />

          <div className="mb-10">
            <HeroSummary quarter={quarter} krs={objectives.flatMap((o) => o.krs)} />
          </div>

          {objectives.length === 0 ? (
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
          ) : null}

          <OKRTree
            qid={quarter.id}
            objectives={objectives}
            members={members}
            readOnly={isReadOnly}
          />

          <ScoreTable
            qid={quarter.id}
            objectives={objectives}
            finalScores={finalScores}
            readOnly={isReadOnly}
          />

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
